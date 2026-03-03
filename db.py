from __future__ import annotations
import json
import uuid
from datetime import datetime
from typing import Any, Optional
from sqlalchemy import (
    DateTime,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from config import settings
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
def _normalize_db_url(url: str) -> str:
    if url.startswith("postgres://"):
        return "postgresql://" + url[len("postgres://") :]
    return url

ENGINE = create_engine(_normalize_db_url(settings.DATABASE_URL), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=ENGINE, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_type: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="queued")
    input_json: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    result_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    def set_input(self, payload: dict[str, Any]) -> None:
        self.input_json = json.dumps(payload, ensure_ascii=False)

    def set_result(self, payload: dict[str, Any]) -> None:
        self.result_json = json.dumps(payload, ensure_ascii=False)

    def input(self) -> dict[str, Any]:
        try:
            return json.loads(self.input_json or "{}")
        except Exception:
            return {}

    def result(self) -> Optional[dict[str, Any]]:
        if not self.result_json:
            return None
        try:
            return json.loads(self.result_json)
        except Exception:
            return None


def init_db() -> None:
    Base.metadata.create_all(bind=ENGINE)
