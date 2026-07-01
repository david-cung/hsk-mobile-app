from datetime import datetime

from pydantic import BaseModel


class SavedWordCreate(BaseModel):
    hanzi: str
    pinyin: str | None = None
    meaning: str | None = None
    hsk_level: int | None = None


class SavedWordOut(BaseModel):
    id: int
    hanzi: str
    pinyin: str | None
    meaning: str | None
    hsk_level: int | None
    saved_at: datetime

    model_config = {"from_attributes": True}


class AchievementOut(BaseModel):
    id: int
    code: str
    title: str
    description: str | None
    icon: str | None
    earned: bool = False
    earned_at: datetime | None = None


class MockTestOut(BaseModel):
    id: int
    title: str
    hsk_level: int
    duration_minutes: int
    question_count: int
