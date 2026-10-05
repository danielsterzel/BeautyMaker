from fastapi import FastAPI, Request
import logging
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
app = FastAPI()


@app.get("/")
async def home_page():
    return "hi"

logger = logging.getLogger("uvicorn.error")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    logger.error(
        "Validation error | %s %s | body=%s | errors=%s",
        request.method,
        request.url.path,
        exc.body,
        exc.errors(),
    )

    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )