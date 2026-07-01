from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_optional_user
from app.db.session import get_db
from app.models.content import HskLevel, Lesson, LessonType, Question
from app.models.progress import LessonStatus, UserLessonProgress
from app.models.user import User
from app.schemas.content import HskLevelOut, LessonDetail, LessonListItem, QuestionOut

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/levels", response_model=list[HskLevelOut])
def list_levels(db: Session = Depends(get_db)) -> list[HskLevel]:
    return list(db.scalars(select(HskLevel).order_by(HskLevel.level_number)))


@router.get("/levels/{level_id}/lessons", response_model=list[LessonListItem])
def list_lessons(
    level_id: int,
    lesson_type: str | None = Query(None, description="Filter: vocabulary, grammar, reading, listening, writing"),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
) -> list[LessonListItem]:
    stmt = select(Lesson).where(Lesson.hsk_level_id == level_id)
    if lesson_type:
        normalized = lesson_type.strip().lower()
        try:
            lt = LessonType(normalized)
        except ValueError as exc:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid lesson_type. Use: {', '.join(t.value for t in LessonType)}",
            ) from exc
        stmt = stmt.where(Lesson.lesson_type == lt)
    lessons = db.scalars(stmt.order_by(Lesson.sort_order)).all()
    progress_map: dict[int, UserLessonProgress] = {}
    if current_user:
        progress_rows = db.scalars(
            select(UserLessonProgress).where(
                UserLessonProgress.user_id == current_user.id,
                UserLessonProgress.lesson_id.in_([l.id for l in lessons]),
            )
        ).all()
        progress_map = {p.lesson_id: p for p in progress_rows}
    result = []
    for lesson in lessons:
        prog = progress_map.get(lesson.id)
        result.append(
            LessonListItem(
                id=lesson.id,
                title=lesson.title,
                description=lesson.description,
                lesson_type=lesson.lesson_type.value,
                sort_order=lesson.sort_order,
                duration_minutes=lesson.duration_minutes,
                status=prog.status.value if prog else LessonStatus.NOT_STARTED.value,
                score_percent=prog.score_percent if prog else None,
            )
        )
    return result


@router.get("/lessons/{lesson_id}", response_model=LessonDetail)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return LessonDetail(
        id=lesson.id,
        hsk_level_id=lesson.hsk_level_id,
        title=lesson.title,
        description=lesson.description,
        lesson_type=lesson.lesson_type.value,
        duration_minutes=lesson.duration_minutes,
        content=lesson.content,
    )


@router.get("/lessons/{lesson_id}/questions", response_model=list[QuestionOut])
def get_lesson_questions(lesson_id: int, db: Session = Depends(get_db)) -> list[QuestionOut]:
    questions = db.scalars(
        select(Question)
        .where(Question.lesson_id == lesson_id)
        .order_by(Question.sort_order)
    ).all()
    return [
        QuestionOut(
            id=q.id,
            question_type=q.question_type.value,
            prompt=q.prompt,
            options=q.options,
            sort_order=q.sort_order,
        )
        for q in questions
    ]
