# services.py

import json
import re
import requests
import pandas as pd
import numpy as np
from alpha_vantage.timeseries import TimeSeries
from config import settings
from datetime import datetime, timedelta
from db import Job, SessionLocal

# -----------------------------------------------------------------------------
# Gemini Helper
# -----------------------------------------------------------------------------
from google import genai

def call_gemini_with_retry(prompt, document_text=None):
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

    full_prompt = prompt
    if document_text:
        full_prompt += "\n\nDocument:\n" + document_text

    response = client.models.generate_content(
        model="gemini-2.5-pro",  # modern supported model
        contents=full_prompt,
    )

    return response.text


# -----------------------------------------------------------------------------
# Summarize
# -----------------------------------------------------------------------------
def summarize_text(data):
    text = data.get("text")
    style = data.get("style", "short")

    prompt = f"Summarize the following text in {style} format:"
    result = call_gemini_with_retry(prompt, text)

    return {"summary": result}


# -----------------------------------------------------------------------------
# Industry Analyze
# -----------------------------------------------------------------------------
def industry_analyze(data):
    industry = data.get("industry")
    inputs = data.get("inputs", "")

    prompt = f"Analyze the {industry} industry.\nAdditional context:\n{inputs}"
    result = call_gemini_with_retry(prompt)

    return {"overview": result}


# -----------------------------------------------------------------------------
# What-If Analysis
# -----------------------------------------------------------------------------
def what_if_analysis(data):
    query = data.get("query")
    context = data.get("context", "")

    prompt = f'Given this financial context, answer this what-if scenario in Markdown:\n"{query}"'
    result = call_gemini_with_retry(prompt, context)

    return {"answer": result}


# -----------------------------------------------------------------------------
# Corporate Analysis
# -----------------------------------------------------------------------------
def corporate_analysis(data):
    document_text = data.get("document_text")

    prompt = "Provide a structured financial corporate analysis."
    result = call_gemini_with_retry(prompt, document_text)

    return {"summary": result}


# -----------------------------------------------------------------------------
# Live News
# -----------------------------------------------------------------------------


def fetch_live_news(data):
    company = data.get("company")

    if not company:
        return {"summary": "No company provided.", "articles": []}

    url = "https://newsapi.org/v2/everything"

    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).strftime("%Y-%m-%d")

    params = {
        "q": company,
        "language": "en",
        "sortBy": "publishedAt",
        "from": seven_days_ago,
        "pageSize": 5,
        "apiKey": settings.NEWS_API_KEY,
    }

    response = requests.get(url, params=params)
    news_data = response.json()

    print("DEBUG NEWS RAW RESPONSE:", news_data)

    if news_data.get("status") != "ok":
        return {
            "summary": f"News API error: {news_data.get('message', 'Unknown error')}",
            "articles": []
        }

    articles = news_data.get("articles", [])

    if not articles:
        return {
            "summary": f"No recent news found for {company}.",
            "articles": []
        }

    headlines = [a["title"] for a in articles if a.get("title")]

    prompt = (
        "Classify overall sentiment (Positive, Negative, Neutral) "
        "and give a short 2-line market impact summary:\n\n"
        + "\n".join(headlines)
    )

    sentiment = call_gemini_with_retry(prompt)

    return {
        "summary": sentiment,
        "articles": articles
    }


# -----------------------------------------------------------------------------
# Stock Analysis
# -----------------------------------------------------------------------------
def stock_analysis(data):
    ticker = data.get("ticker")

    ts = TimeSeries(key=settings.ALPHA_VANTAGE_API_KEY, output_format='pandas')
    df, _ = ts.get_daily(symbol=ticker, outputsize='compact')

    latest_price = float(df.iloc[0]["4. close"])

    prompt = f"Provide a short technical outlook for stock {ticker}"
    outlook = call_gemini_with_retry(prompt)

    return {
        "metrics": {"latest_price": latest_price},
        "analysis": outlook
    }


# -----------------------------------------------------------------------------
# Market Intelligence
# -----------------------------------------------------------------------------
def market_intelligence(data):
    combined = data.get("combined_text", "")
    sources = data.get("sources", [])

    prompt = f"As a market analyst, synthesize insights from sources: {', '.join(sources)}"
    result = call_gemini_with_retry(prompt, combined)

    return {"briefing": result}