from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from app.db.dependency import get_db
from app.models.user import User
from app.core.auth import get_verified_user
from app.service.analysis.analysis import infer_model

router = APIRouter(prefix='/analysis', tags=['Analysis'])

@router.post("/stream")
async def stream_analysis(user: Annotated[User, Depends(get_verified_user)]):

    return StreamingResponse(
        infer_model(user.id),
        media_type="text/plain; charset=utf-8"
    )
