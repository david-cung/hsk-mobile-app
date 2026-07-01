# HSK Chinese Master

Mobile app for learning Chinese (HSK-aligned) with React Native (Expo) and FastAPI + PostgreSQL backend.

## Project structure

```
apps/mobile/            React Native CLI app (iOS & Android)
apps/mobile-expo-legacy/  Old Expo project (archived)
apps/api/               FastAPI backend
scholar_redux/          Design system reference
*/code.html             UI prototypes (reference only)
```

## Quick start

### 1. Database & API

```bash
# Start PostgreSQL (requires Docker Desktop running)
make db-up

# API setup (first time)
cd apps/api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# From repo root:
make api-seed    # load HSK levels, lessons, questions
make api-dev     # http://localhost:8000
```

Migrations (optional, production): `cd apps/api && alembic upgrade head`

API docs: http://localhost:8000/docs

### 2. Mobile app (React Native CLI)

```bash
cd apps/mobile
npm install
cd ios && bundle exec pod install && cd ..   # first time iOS only

# Terminal 1
npm start

# Terminal 2
npm run ios      # or: npm run android
```

API URL: edit `apps/mobile/src/config.ts` (Android emulator uses `10.0.2.2` by default).

### Demo account

Register in the app, or use the API:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@hsk.app","password":"demo123","display_name":"Alex"}'
```

## Features (MVP)

- Auth (register/login, JWT)
- Onboarding (goal, HSK level, daily minutes)
- Home dashboard with progress stats
- HSK levels & lessons
- Multiple-choice quiz with scoring
- Progress dashboard
- Saved words, achievements, mock test intro
- Scholar Redux design tokens

## Tests

```bash
cd apps/api && .venv/bin/pytest
```
