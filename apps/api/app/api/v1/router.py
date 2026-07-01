from fastapi import APIRouter

from app.api.v1 import auth, content, learning, profile, progress, quiz

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(content.router)
api_router.include_router(quiz.router)
api_router.include_router(progress.router)
api_router.include_router(learning.router)
