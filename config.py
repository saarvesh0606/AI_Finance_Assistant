# config.py
import os

class Settings:
    # Core security
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # Database
    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///quantara.db"  # default for local development
    )

    # External APIs
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    # Redis
    REDIS_URL = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )

settings = Settings()