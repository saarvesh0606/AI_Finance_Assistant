import traceback
from db import SessionLocal, Job
from datetime import datetime
from db import Job, SessionLocal
from services import (
    summarize_text,
    industry_analyze,
    what_if_analysis,
    corporate_analysis,
    fetch_live_news,
    stock_analysis,
    market_intelligence,
)

def _run_job(job_id, handler):
    db = SessionLocal()

    try:
        job = db.get(Job, job_id)
        if not job:
            print("Job not found:", job_id)
            return

        job.status = "running"
        job.updated_at = datetime.utcnow()
        db.commit()

        input_data = job.input()   # ✅ CORRECT METHOD

        print("DEBUG INPUT:", input_data)

        result = handler(input_data)

        print("DEBUG RESULT:", result)

        job.set_result(result)     # ✅ CORRECT METHOD
        job.status = "succeeded"
        job.updated_at = datetime.utcnow()
        db.commit()

    except Exception as e:
        print("ERROR:", str(e))

        job = db.get(Job, job_id)
        if job:
            job.status = "failed"
            job.error = str(e)
            job.updated_at = datetime.utcnow()
            db.commit()

    finally:
        db.close()



def run_summarize(job_id):
    _run_job(job_id, summarize_text)


def run_industry_analyze(job_id):
    _run_job(job_id, industry_analyze)


def run_what_if(job_id):
    _run_job(job_id, what_if_analysis)


def run_corporate_analyze(job_id):
    _run_job(job_id, corporate_analysis)


def run_live_news(job_id):
    _run_job(job_id, fetch_live_news)


def run_stock_analysis(job_id):
    _run_job(job_id, stock_analysis)


def run_market_intel(job_id):
    _run_job(job_id, market_intelligence)


# Optional future-ready handlers
def run_optimize_finances(job_id):
    from services import optimize_finances
    _run_job(job_id, optimize_finances)


def run_digital_twin(job_id):
    from services import digital_twin
    _run_job(job_id, digital_twin)


def run_proactive_impact(job_id):
    from services import proactive_impact_analysis
    _run_job(job_id, proactive_impact_analysis)