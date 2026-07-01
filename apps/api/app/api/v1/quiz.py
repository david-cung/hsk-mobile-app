from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.content import Lesson, Question
from app.models.progress import LessonStatus, QuizAttempt, UserLessonProgress
from app.models.user import User
from app.schemas.content import QuizSubmitRequest, QuizSubmitResult
from app.services.achievements import check_quiz_achievements

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/lessons/{lesson_id}/submit", response_model=QuizSubmitResult)
def submit_quiz(
    lesson_id: int,
    payload: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> QuizSubmitResult:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    questions = db.scalars(
        select(Question).where(Question.lesson_id == lesson_id).order_by(Question.sort_order)
    ).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No questions for this lesson")

    results = []
    correct_count = 0
    for q in questions:
        user_answer = payload.answers.get(str(q.id), "").strip()
        is_correct = user_answer.lower() == q.correct_answer.strip().lower()
        if is_correct:
            correct_count += 1
        results.append(
            {
                "question_id": q.id,
                "correct": is_correct,
                "user_answer": user_answer,
                "correct_answer": q.correct_answer,
                "explanation": q.explanation,
            }
        )

    total = len(questions)
    score_percent = round((correct_count / total) * 100) if total else 0

    attempt = QuizAttempt(
        user_id=current_user.id,
        lesson_id=lesson_id,
        score=score_percent,
        total_questions=total,
        answers={"responses": results},
    )
    db.add(attempt)

    progress = db.scalar(
        select(UserLessonProgress).where(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.lesson_id == lesson_id,
        )
    )
    if progress is None:
        progress = UserLessonProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(progress)
    progress.score_percent = float(score_percent)
    progress.status = LessonStatus.COMPLETED if score_percent >= 70 else LessonStatus.IN_PROGRESS

    check_quiz_achievements(db, current_user.id, score_percent)

    db.commit()
    db.refresh(attempt)

    return QuizSubmitResult(
        attempt_id=attempt.id,
        score=score_percent,
        total_questions=total,
        correct_count=correct_count,
        results=results,
    )
