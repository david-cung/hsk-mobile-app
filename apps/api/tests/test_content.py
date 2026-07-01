def _register(client, email="learner@test.com"):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "secret123", "display_name": "Test"},
    )
    return r.json()["access_token"]


def test_levels_and_quiz_flow(client):
    from app.models.content import HskLevel, Lesson, LessonType, Question, QuestionType
    from app.db.session import SessionLocal

    db = SessionLocal()
    level = HskLevel(level_number=1, title="HSK 1", description="Test", total_characters=10)
    db.add(level)
    db.flush()
    lesson = Lesson(
        hsk_level_id=level.id,
        title="Test Lesson",
        lesson_type=LessonType.VOCABULARY,
        sort_order=1,
        content={},
    )
    db.add(lesson)
    db.flush()
    db.add(
        Question(
            lesson_id=lesson.id,
            question_type=QuestionType.MULTIPLE_CHOICE,
            prompt="What is 你好?",
            options=["hello", "bye"],
            correct_answer="hello",
            sort_order=0,
        )
    )
    db.commit()
    level_id = level.id
    lesson_id = lesson.id
    db.close()

    levels = client.get("/api/v1/content/levels")
    assert levels.status_code == 200
    assert len(levels.json()) >= 1

    token = _register(client)
    headers = {"Authorization": f"Bearer {token}"}

    lessons = client.get(f"/api/v1/content/levels/{level_id}/lessons", headers=headers)
    assert lessons.status_code == 200

    q_id = client.get(f"/api/v1/content/lessons/{lesson_id}/questions").json()[0]["id"]
    submit = client.post(
        f"/api/v1/quiz/lessons/{lesson_id}/submit",
        headers=headers,
        json={"answers": {str(q_id): "hello"}},
    )
    assert submit.status_code == 200
    assert submit.json()["score"] == 100
