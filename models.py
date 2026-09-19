from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class Wish(Base):

    __tablename__ = "wishes"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    message = Column(String(500), nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )