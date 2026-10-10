from functools import lru_cache
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

EMAIL_TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "resources" / "email"
EMAIL_MASCOT_PATH = EMAIL_TEMPLATE_DIR / "assets" / "cupcake-mascot.png"
EMAIL_MASCOT_CONTENT_ID = "beautymaker-cupcake"
DEFAULT_MASCOT_SRC = f"cid:{EMAIL_MASCOT_CONTENT_ID}"


@lru_cache(maxsize=1)
def _template_environment() -> Environment:
    return Environment(
        loader=FileSystemLoader(EMAIL_TEMPLATE_DIR),
        autoescape=select_autoescape(enabled_extensions=("html", "xml")),
        undefined=StrictUndefined,
    )


def render_email_template(template_name: str, **context: object) -> str:
    """Render an HTML email template from app/resources/email."""
    return _template_environment().get_template(template_name).render(**context)


def render_verification_email(
    *,
    link: str,
    recipient_name: str | None = None,
    mascot_src: str = DEFAULT_MASCOT_SRC,
) -> str:
    return render_email_template(
        "confirm_email.html",
        link=link,
        recipient_name=recipient_name,
        mascot_src=mascot_src,
    )


def render_password_reset_email(
    *,
    link: str,
    recipient_name: str | None = None,
    expiration_minutes: int = 30,
    mascot_src: str = DEFAULT_MASCOT_SRC,
) -> str:
    return render_email_template(
        "reset_password.html",
        link=link,
        recipient_name=recipient_name,
        expiration_minutes=expiration_minutes,
        mascot_src=mascot_src,
    )
