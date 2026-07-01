.PHONY: db-up db-down api-seed api-dev api-test mobile-dev

db-up:
	docker compose up -d db

db-down:
	docker compose down

api-seed:
	cd apps/api && .venv/bin/python -m scripts.seed && .venv/bin/python -m scripts.seed_focus_lessons

api-dev:
	cd apps/api && .venv/bin/uvicorn app.main:app --reload --port 8000

api-test:
	cd apps/api && .venv/bin/pytest -q

mobile-dev:
	cd apps/mobile && npm start

mobile-ios:
	cd apps/mobile && npm run ios

mobile-android:
	cd apps/mobile && npm run android
