from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.analysis import Analysis
from app.db.dependency import get_db
from app.models.user import User
from app.core.auth import get_verified_user
from app.schemas.analysis import AnalysisRead, AnalysisWrite
from app.service.analysis.analysis import infer_model
from app.db.services.analysis import AnalysisDbService

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/stream")
async def stream_analysis(user: Annotated[User, Depends(get_verified_user)]):

    return StreamingResponse(
        infer_model(user.id), media_type="text/plain; charset=utf-8"
    )


@router.get("/recent-analysis", response_model=AnalysisRead)
async def get_my_analyses(
    user: Annotated[User, Depends(get_verified_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):

    service = AnalysisDbService(db)

    analysis = await service.get_latest_by_user_id(user_id=user.id)

    return AnalysisRead.model_validate(analysis)


@router.post("/write-new", response_model=AnalysisRead)
async def write_analysis(
    write: AnalysisWrite,
    user: Annotated[User, Depends(get_verified_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
):

    db_analysis = Analysis(
        concerns=write.concerns,
        short_analysis=write.short_analysis,
        full_analysis=write.full_analysis,
        user_id=user.id,
    )

    service = AnalysisDbService(db)
    try:
        await service.save_analysis(db_analysis)
        await db.commit()

    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Incorrect Analysis model",
        )

    return AnalysisRead.model_validate(db_analysis)
