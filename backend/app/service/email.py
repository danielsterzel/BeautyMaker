from email.message import EmailMessage
import hashlib
import secrets
from urllib.parse import urlencode, urlsplit, urlunsplit

from aiosmtplib import SMTP

from app.core.settings import settings
from app.service.email_templates import render_verification_email


def generate_email_verification_token() -> str:
    return secrets.token_urlsafe(32)


def hash_email_verification_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def build_email_verification_link(token: str) -> str:
    configured_url = str(settings.frontend_url).strip()
    frontend_url = urlsplit(configured_url)
    if frontend_url.scheme not in {"http", "https"} or not frontend_url.netloc:
        raise ValueError("FRONTEND_URL must be an absolute HTTP(S) URL")
    if frontend_url.username or frontend_url.password:
        raise ValueError("FRONTEND_URL must not contain credentials")
    if frontend_url.scheme == "http" and frontend_url.hostname not in {
        "localhost",
        "127.0.0.1",
        "::1",
    }:
        raise ValueError("FRONTEND_URL must use HTTPS outside local development")

    return urlunsplit(
        (
            frontend_url.scheme,
            frontend_url.netloc,
            "/confirm-email",
            urlencode({"token": token}),
            "",
        )
    )


def create_client() -> SMTP:
    client = SMTP(
        hostname=settings.google_smtp_host,
        port=settings.google_smtp_port,
        start_tls=True,
        timeout=10,
    )
    return client


async def authenticate_client() -> SMTP:

    client = create_client()

    await client.connect()
    await client.login(settings.google_smtp_username, settings.google_smtp_password)
    return client


async def send_verification_email(recipient: str, link: str) -> None:

    html = render_verification_email(link=link)

    message = EmailMessage()

    message["From"] = settings.google_smtp_from_email
    message["To"] = recipient
    message["Subject"] = "BeautyMaker✨ Confirm your email"
    message.set_content(f"Confirm your BeautyMaker email: {link}")
    message.add_alternative(html, subtype="html")

    client = await authenticate_client()

    try:
        await client.send_message(message)
    finally:
        if client.is_connected:
            await client.quit()
