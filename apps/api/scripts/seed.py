"""Seed MVP content. Run: python -m scripts.seed (from apps/api directory)."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.achievement import Achievement
from app.models.content import HskLevel, Lesson, LessonType, Question, QuestionType

SEED_LEVELS = [
    {"level_number": 1, "title": "HSK 1", "description": "Beginner — 150 words", "total_characters": 150},
    {"level_number": 2, "title": "HSK 2", "description": "Elementary — 300 words", "total_characters": 300},
    {"level_number": 3, "title": "HSK 3", "description": "Intermediate — 600 words", "total_characters": 600},
]

SEED_LESSONS = [
    {
        "title": "Greetings & Basics",
        "description": "Learn hello, thank you, and basic phrases.",
        "lesson_type": LessonType.VOCABULARY,
        "sort_order": 1,
        "content": {
            "vocabulary": [
                {"hanzi": "你好", "pinyin": "nǐ hǎo", "meaning": "hello"},
                {"hanzi": "谢谢", "pinyin": "xiè xie", "meaning": "thank you"},
                {"hanzi": "再见", "pinyin": "zài jiàn", "meaning": "goodbye"},
            ]
        },
        "questions": [
            {
                "prompt": "What does 你好 mean?",
                "options": ["hello", "goodbye", "thank you", "please"],
                "correct_answer": "hello",
                "explanation": "你好 (nǐ hǎo) is the standard greeting.",
            },
            {
                "prompt": "How do you say 'thank you' in Chinese?",
                "options": ["再见", "谢谢", "你好", "对不起"],
                "correct_answer": "谢谢",
                "explanation": "谢谢 (xiè xie) means thank you.",
            },
            {
                "prompt": "Which character means 'goodbye'?",
                "options": ["你", "好", "再", "见"],
                "correct_answer": "见",
                "explanation": "再见 combines 再 (again) and 见 (see).",
            },
        ],
    },
    {
        "title": "Restaurant Etiquette",
        "description": "Order food and interact politely at restaurants.",
        "lesson_type": LessonType.MIXED,
        "sort_order": 2,
        "content": {
            "vocabulary": [
                {"hanzi": "菜单", "pinyin": "cài dān", "meaning": "menu"},
                {"hanzi": "服务员", "pinyin": "fú wù yuán", "meaning": "waiter"},
                {"hanzi": "买单", "pinyin": "mǎi dān", "meaning": "pay the bill"},
            ]
        },
        "questions": [
            {
                "prompt": "What is 菜单?",
                "options": ["menu", "waiter", "bill", "water"],
                "correct_answer": "menu",
            },
            {
                "prompt": "How do you ask for the bill?",
                "options": ["你好", "买单", "谢谢", "菜单"],
                "correct_answer": "买单",
            },
        ],
    },
    {
        "title": "Numbers 1–10",
        "description": "Count from one to ten in Mandarin.",
        "lesson_type": LessonType.VOCABULARY,
        "sort_order": 3,
        "content": {
            "vocabulary": [
                {"hanzi": "一", "pinyin": "yī", "meaning": "one"},
                {"hanzi": "五", "pinyin": "wǔ", "meaning": "five"},
                {"hanzi": "十", "pinyin": "shí", "meaning": "ten"},
            ]
        },
        "questions": [
            {
                "prompt": "What number is 五?",
                "options": ["3", "5", "7", "9"],
                "correct_answer": "5",
            },
        ],
    },
]

ACHIEVEMENTS = [
    {"code": "first_lesson", "title": "First Steps", "description": "Complete your first lesson", "icon": "school"},
    {"code": "streak_7", "title": "Week Warrior", "description": "Maintain a 7-day study streak", "icon": "local_fire_department"},
    {"code": "quiz_perfect", "title": "Perfect Score", "description": "Score 100% on a quiz", "icon": "emoji_events"},
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(HskLevel).limit(1)):
            print("Database already seeded.")
            return

        levels = []
        for data in SEED_LEVELS:
            level = HskLevel(**data)
            db.add(level)
            levels.append(level)
        db.flush()

        level1 = levels[0]
        for lesson_data in SEED_LESSONS:
            data = {**lesson_data}
            questions_data = data.pop("questions")
            lesson = Lesson(
                hsk_level_id=level1.id,
                title=data["title"],
                description=data["description"],
                lesson_type=data["lesson_type"],
                sort_order=data["sort_order"],
                duration_minutes=15,
                content=data["content"],
            )
            db.add(lesson)
            db.flush()
            for q_idx, q in enumerate(questions_data):
                db.add(
                    Question(
                        lesson_id=lesson.id,
                        question_type=QuestionType.MULTIPLE_CHOICE,
                        prompt=q["prompt"],
                        options=q["options"],
                        correct_answer=q["correct_answer"],
                        explanation=q.get("explanation"),
                        sort_order=q_idx,
                    )
                )

        for ach in ACHIEVEMENTS:
            db.add(Achievement(**ach))

        db.commit()
        print("Seed completed successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
