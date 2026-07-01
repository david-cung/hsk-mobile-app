from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.achievement import Achievement, UserAchievement
from app.models.progress import LessonStatus, UserLessonProgress


def award_achievement(db: Session, user_id: int, code: str) -> None:
    achievement = db.scalar(select(Achievement).where(Achievement.code == code))
    if achievement is None:
        return
    existing = db.scalar(
        select(UserAchievement).where(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement.id,
        )
    )
    if existing:
        return
    db.add(UserAchievement(user_id=user_id, achievement_id=achievement.id))


def check_quiz_achievements(db: Session, user_id: int, score: int) -> None:
    if score == 100:
        award_achievement(db, user_id, "quiz_perfect")

    count = db.scalar(
        select(func.count())
        .select_from(UserLessonProgress)
        .where(
            UserLessonProgress.user_id == user_id,
            UserLessonProgress.status == LessonStatus.COMPLETED,
        )
    )
    if count == 1:
        award_achievement(db, user_id, "first_lesson")
