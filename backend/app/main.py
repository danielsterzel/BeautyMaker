from fastapi import FastAPI, Request
import logging

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.api import router as api_router
from app.api.auth import router as user_router

app = FastAPI()
app.include_router(api_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")


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
