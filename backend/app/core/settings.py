from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

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

    model_config = SettingsConfigDict(
        env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
