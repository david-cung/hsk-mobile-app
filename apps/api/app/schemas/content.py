from pydantic import BaseModel


class HskLevelOut(BaseModel):
    id: int
    level_number: int
    title: str
    description: str | None
    total_characters: int

    model_config = {"from_attributes": True}


class LessonListItem(BaseModel):
    id: int
    title: str
    description: str | None
    lesson_type: str
    sort_order: int
    duration_minutes: int
    status: str | None = None
    score_percent: float | None = None

    model_config = {"from_attributes": True}


class LessonDetail(BaseModel):
    id: int
    hsk_level_id: int
    title: str
    description: str | None
    lesson_type: str
    duration_minutes: int
    content: dict | None

    model_config = {"from_attributes": True}


class QuestionOut(BaseModel):
    id: int
    question_type: str
    prompt: str
    options: list[str] | None
    sort_order: int

    model_config = {"from_attributes": True}


class QuizSubmitRequest(BaseModel):
    answers: dict[str, str]


class QuizSubmitResult(BaseModel):
    attempt_id: int
    score: int
    total_questions: int
    correct_count: int
    results: list[dict]


class ProgressDashboard(BaseModel):
    current_hsk_level: int
    target_hsk_level: int
    daily_goal_minutes: int
    minutes_studied_today: int
    study_streak_days: int
    lessons_completed: int
    lessons_in_progress: int
    recent_attempts: list[dict]
