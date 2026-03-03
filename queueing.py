# queueing.py

from redis import Redis
from rq import Queue
from config import settings

# Create Redis connection
redis_conn = Redis.from_url(settings.REDIS_URL)

# Factory function used by app.py
def get_queue(name="quantara"):
    return Queue(
        name,
        connection=redis_conn,
        default_timeout=None  # Windows-safe
    )