from dotenv import load_dotenv
load_dotenv()
import os
from redis import Redis
from rq import SimpleWorker, Queue, Connection

# ---- No-op "death penalty" to disable SIGALRM timeouts on Windows ----
class NoDeathPenalty:
    def __init__(self, timeout, exception, **kwargs):
        self.timeout = timeout
        self.exception = exception

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        # Don't suppress exceptions from the job itself
        return False


listen = ["quantara"]
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
conn = Redis.from_url(redis_url)

if __name__ == "__main__":
    with Connection(conn):
        worker = SimpleWorker(map(Queue, listen))

        # ✅ Windows fix: disable SIGALRM-based timeouts
        worker.death_penalty_class = NoDeathPenalty

        worker.work(with_scheduler=False)