from fastapi import FastAPI, Request
import logging

from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.questionnaire import router as api_router
from app.api.auth import router as user_router
from app.api.analysis import router as analysis_router
from app.core.settings import settings

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url.rstrip("/")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")
app.include_router(analysis_router, prefix="/api/v1")


@app.get("/")
async def home_page():
    return "hi"


logger = logging.getLogger("uvicorn.error")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    logged_body = exc.body
    if isinstance(logged_body, dict):
        sensitive_fields = {"password", "token"}
        logged_body = {
            key: "[REDACTED]" if key in sensitive_fields else value
            for key, value in logged_body.items()
        }

    logger.error(
        "Validation error | %s %s | body=%s | error_count=%d",
        request.method,
        request.url.path,
        logged_body,
        len(exc.errors()),
    )

    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
