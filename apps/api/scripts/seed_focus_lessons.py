"""Add grammar, reading, listening, writing lessons for HSK 1. Safe to re-run."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.content import HskLevel, Lesson, LessonType, Question, QuestionType

FOCUS_LESSONS = [
    {
        "title": "Basic Sentence Structure",
        "description": "Learn 是, 不, and simple sentence patterns for HSK 1.",
        "lesson_type": LessonType.GRAMMAR,
        "sort_order": 10,
        "content": {
            "grammar_points": [
                {
                    "title": "A 是 B — \"A is B\"",
                    "explanation": "Use 是 (shì) to link the subject and a noun or noun phrase.",
                    "examples": [
                        {"hanzi": "我是学生。", "pinyin": "Wǒ shì xuésheng.", "meaning": "I am a student."},
                        {"hanzi": "他是老师。", "pinyin": "Tā shì lǎoshī.", "meaning": "He is a teacher."},
                    ],
                },
                {
                    "title": "Negation with 不",
                    "explanation": "Place 不 (bù) before the verb to make a negative sentence.",
                    "examples": [
                        {"hanzi": "我不是医生。", "pinyin": "Wǒ bù shì yīshēng.", "meaning": "I am not a doctor."},
                    ],
                },
            ]
        },
        "questions": [
            {
                "prompt": "How do you say \"I am a student\"?",
                "options": ["我是学生", "我有学生", "我喜欢学生", "我学生"],
                "correct_answer": "我是学生",
            },
        ],
    },
    {
        "title": "At the Café — Reading",
        "description": "A short dialogue about ordering drinks.",
        "lesson_type": LessonType.READING,
        "sort_order": 11,
        "content": {
            "passage_title": "在咖啡馆",
            "passage": [
                {"hanzi": "你好！你想喝什么？", "pinyin": "Nǐ hǎo! Nǐ xiǎng hē shénme?", "meaning": "Hello! What would you like to drink?"},
                {"hanzi": "我想喝一杯茶。", "pinyin": "Wǒ xiǎng hē yì bēi chá.", "meaning": "I'd like a cup of tea."},
                {"hanzi": "好的。你还要别的吗？", "pinyin": "Hǎo de. Nǐ hái yào biéde ma?", "meaning": "OK. Would you like anything else?"},
                {"hanzi": "不要，谢谢。", "pinyin": "Bù yào, xièxie.", "meaning": "No thanks."},
            ],
            "vocabulary": [
                {"hanzi": "茶", "pinyin": "chá", "meaning": "tea"},
                {"hanzi": "杯", "pinyin": "bēi", "meaning": "cup"},
            ],
        },
        "questions": [
            {
                "prompt": "What does the customer want to drink?",
                "options": ["tea", "coffee", "water", "juice"],
                "correct_answer": "tea",
            },
        ],
    },
    {
        "title": "Meeting a Friend — Listening",
        "description": "Listen to a short greeting conversation.",
        "lesson_type": LessonType.LISTENING,
        "sort_order": 12,
        "content": {
            "tip": "Tap the speaker icon on each line to hear the pronunciation, then practice aloud.",
            "transcript": [
                {"hanzi": "你好！好久不见。", "pinyin": "Nǐ hǎo! Hǎo jiǔ bú jiàn.", "meaning": "Hello! Long time no see."},
                {"hanzi": "是啊，你最近怎么样？", "pinyin": "Shì a, nǐ zuìjìn zěnmeyàng?", "meaning": "Yeah, how have you been lately?"},
                {"hanzi": "我很好，谢谢。", "pinyin": "Wǒ hěn hǎo, xièxie.", "meaning": "I'm fine, thank you."},
            ],
        },
        "questions": [
            {
                "prompt": "What greeting is used at the start?",
                "options": ["你好", "再见", "谢谢", "对不起"],
                "correct_answer": "你好",
            },
        ],
    },
    {
        "title": "Writing Basic Characters",
        "description": "Practice stroke order for common HSK 1 characters.",
        "lesson_type": LessonType.WRITING,
        "sort_order": 13,
        "content": {
            "tip": "Study the stroke count, then trace each character in your notebook.",
            "characters": [
                {"hanzi": "人", "pinyin": "rén", "meaning": "person", "strokes": 2},
                {"hanzi": "大", "pinyin": "dà", "meaning": "big", "strokes": 3},
                {"hanzi": "水", "pinyin": "shuǐ", "meaning": "water", "strokes": 4},
            ],
        },
        "questions": [
            {
                "prompt": "How many strokes does 人 have?",
                "options": ["1", "2", "3", "4"],
                "correct_answer": "2",
            },
        ],
    },
]


def seed_focus() -> None:
    db = SessionLocal()
    try:
        level = db.scalar(select(HskLevel).where(HskLevel.level_number == 1))
        if level is None:
            print("HSK 1 level not found. Run scripts.seed first.")
            return

        added = 0
        for data in FOCUS_LESSONS:
            exists = db.scalar(
                select(Lesson).where(
                    Lesson.hsk_level_id == level.id,
                    Lesson.title == data["title"],
                    Lesson.lesson_type == data["lesson_type"],
                )
            )
            if exists:
                continue

            payload = {**data}
            questions_data = payload.pop("questions")
            lesson = Lesson(
                hsk_level_id=level.id,
                title=payload["title"],
                description=payload["description"],
                lesson_type=payload["lesson_type"],
                sort_order=payload["sort_order"],
                duration_minutes=15,
                content=payload["content"],
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
            added += 1

        db.commit()
        print(f"Focus lessons: {added} added.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_focus()
