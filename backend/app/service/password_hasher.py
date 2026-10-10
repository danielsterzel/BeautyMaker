from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

_password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """Create a salted Argon2id hash suitable for storing in the database."""
    if not password:
        raise ValueError("Password cannot be empty")

    return _password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Return True only when the password matches the stored hash."""
    try:
        return _password_hasher.verify(password_hash, password)
    except (VerificationError, InvalidHashError):
        return False


def password_needs_rehash(password_hash: str) -> bool:
    """Check whether an existing hash should be upgraded after a valid login."""
    try:
        return _password_hasher.check_needs_rehash(password_hash)
    except InvalidHashError:
        return True
