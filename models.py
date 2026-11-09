from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from datetime import datetime

from database import Base


class BirthdayProfile(Base):
    __tablename__ = "birthday_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    birthday_date = Column(Date, nullable=True)
    welcome_message = Column(String(500), nullable=True)
    theme = Column(String(50), default="pink")
    created_at = Column(DateTime, default=datetime.utcnow)


class Wish(Base):
    __tablename__ = "wishes"

    id = Column(Integer, primary_key=True, index=True)

    birthday_id = Column(
        Integer,
        ForeignKey("birthday_profiles.id"),
        nullable=False
    )

    name = Column(String(100), nullable=False)
    message = Column(String(500), nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )