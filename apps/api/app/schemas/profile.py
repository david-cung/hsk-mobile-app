from pydantic import BaseModel, Field


class ProfileOut(BaseModel):
    target_hsk_level: int
    current_hsk_level: int
    daily_goal_minutes: int
    study_streak_days: int
    onboarding_completed: bool

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    target_hsk_level: int | None = None
    current_hsk_level: int | None = None
    daily_goal_minutes: int | None = Field(None, ge=5, le=180)
    onboarding_completed: bool | None = None
