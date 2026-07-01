from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.progress import LessonStatus, QuizAttempt, UserLessonProgress, UserProfile
from app.models.user import User
from app.schemas.content import ProgressDashboard

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/dashboard", response_model=ProgressDashboard)
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProgressDashboard:
    profile = db.scalar(select(UserProfile).where(UserProfile.user_id == current_user.id))
    if profile is None:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    completed = db.scalar(
        select(func.count())
        .select_from(UserLessonProgress)
        .where(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.status == LessonStatus.COMPLETED,
        )
    ) or 0

    in_progress = db.scalar(
        select(func.count())
        .select_from(UserLessonProgress)
        .where(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.status == LessonStatus.IN_PROGRESS,
        )
    ) or 0

    today_start = datetime.now(UTC).replace(hour=0, minute=0, second=0, microsecond=0)
    attempts_today = db.scalars(
        select(QuizAttempt)
        .where(QuizAttempt.user_id == current_user.id, QuizAttempt.finished_at >= today_start)
        .order_by(QuizAttempt.finished_at.desc())
        .limit(5)
    ).all()

    minutes_studied = min(len(attempts_today) * 5, profile.daily_goal_minutes)

    recent = [
        {
            "attempt_id": a.id,
            "lesson_id": a.lesson_id,
            "score": a.score,
            "finished_at": a.finished_at.isoformat(),
        }
        for a in attempts_today
    ]

    return ProgressDashboard(
        current_hsk_level=profile.current_hsk_level,
        target_hsk_level=profile.target_hsk_level,
        daily_goal_minutes=profile.daily_goal_minutes,
        minutes_studied_today=minutes_studied,
        study_streak_days=profile.study_streak_days,
        lessons_completed=completed,
        lessons_in_progress=in_progress,
        recent_attempts=recent,
    )
