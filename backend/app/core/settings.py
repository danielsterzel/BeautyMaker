from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):

    database_url: str
    frontend_url: str

    jwt_private_key_path: Path
    jwt_public_key_path: Path
    jwt_algorithm: str

    google_smtp_port: int
    google_smtp_host: str
    google_smtp_username: str
    google_smtp_password: str
    google_smtp_from_email: str

    open_ai_key: str
    open_ai_model: str

    @field_validator("jwt_private_key_path", "jwt_public_key_path", mode="before")
    @classmethod
    def resolve_jwt_key_path(cls, value: str | Path) -> Path:
        key_path = Path(value).expanduser()
        if key_path.is_absolute():
            return key_path

        return (ENV_FILE.parent / key_path).resolve()

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
