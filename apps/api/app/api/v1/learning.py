from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.achievement import Achievement, UserAchievement
from app.models.content import SavedWord
from app.models.user import User
from app.schemas.learning import AchievementOut, MockTestOut, SavedWordCreate, SavedWordOut

router = APIRouter(prefix="/learning", tags=["learning"])


@router.get("/saved-words", response_model=list[SavedWordOut])
def list_saved_words(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SavedWord]:
    return list(
        db.scalars(
            select(SavedWord)
            .where(SavedWord.user_id == current_user.id)
            .order_by(SavedWord.saved_at.desc())
        )
    )


@router.post("/saved-words", response_model=SavedWordOut, status_code=status.HTTP_201_CREATED)
def add_saved_word(
    payload: SavedWordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SavedWord:
    word = SavedWord(
        user_id=current_user.id,
        hanzi=payload.hanzi,
        pinyin=payload.pinyin,
        meaning=payload.meaning,
        hsk_level=payload.hsk_level,
    )
    db.add(word)
    db.commit()
    db.refresh(word)
    return word


@router.delete("/saved-words/{word_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_saved_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    word = db.get(SavedWord, word_id)
    if word is None or word.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()


@router.get("/achievements", response_model=list[AchievementOut])
def list_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[AchievementOut]:
    achievements = db.scalars(select(Achievement)).all()
    earned = {
        ua.achievement_id: ua.earned_at
        for ua in db.scalars(
            select(UserAchievement).where(UserAchievement.user_id == current_user.id)
        )
    }
    return [
        AchievementOut(
            id=a.id,
            code=a.code,
            title=a.title,
            description=a.description,
            icon=a.icon,
            earned=a.id in earned,
            earned_at=earned.get(a.id),
        )
        for a in achievements
    ]


@router.get("/mock-tests", response_model=list[MockTestOut])
def list_mock_tests(db: Session = Depends(get_db)) -> list[MockTestOut]:
    from app.models.content import HskLevel

    levels = db.scalars(select(HskLevel).order_by(HskLevel.level_number)).all()
    return [
        MockTestOut(
            id=level.id,
            title=f"HSK {level.level_number} Mock Test",
            hsk_level=level.level_number,
            duration_minutes=60,
            question_count=30,
        )
        for level in levels
    ]
