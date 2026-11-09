from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from models import Wish, BirthdayProfile
from database import engine, Base, SessionLocal


app = FastAPI()

Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")


class WishRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    wish: str = Field(min_length=1, max_length=500)


def get_birthday_profile(db: Session, slug: str):
    profile = (
        db.query(BirthdayProfile)
        .filter(BirthdayProfile.slug == slug)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Birthday page not found"
        )

    return profile


@app.get("/")
def home():
    return RedirectResponse(url="/birthday/abisola")


@app.get("/birthday/{slug}")
def birthday_page(slug: str, request: Request):

    db = SessionLocal()

    try:
        profile = get_birthday_profile(db, slug)

        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={"profile": profile}
        )

    finally:
        db.close()


@app.post("/birthday/{slug}/wishes")
def create_wish(slug: str, wish: WishRequest):

    db = SessionLocal()

    try:
        profile = get_birthday_profile(db, slug)

        new_wish = Wish(
            birthday_id=profile.id,
            name=wish.name.strip(),
            message=wish.wish.strip()
        )

        db.add(new_wish)
        db.commit()
        db.refresh(new_wish)

        return {
            "message": (
                f"Thank you, {wish.name}! "
                f"Your birthday wish has reached "
                f"{profile.name}! 🎂💕"
            ),
            "wish_id": new_wish.id
        }

    finally:
        db.close()


@app.get("/birthday/{slug}/wishes")
def get_wishes(slug: str):

    db = SessionLocal()

    try:
        profile = get_birthday_profile(db, slug)

        wishes = (
            db.query(Wish)
            .filter(Wish.birthday_id == profile.id)
            .order_by(Wish.created_at.desc())
            .all()
        )

        return [
            {
                "id": wish.id,
                "name": wish.name,
                "message": wish.message,
                "created_at": wish.created_at
            }
            for wish in wishes
        ]

    finally:
        db.close()