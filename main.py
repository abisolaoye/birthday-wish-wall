from models import Wish
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from database import engine, Base, SessionLocal

app = FastAPI()

Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

class WishRequest(BaseModel):
    name: str
    wish: str


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )

@app.post("/wishes")
def create_wish(wish: WishRequest):

    db = SessionLocal()

    new_wish = Wish(
        name=wish.name,
        message=wish.wish
    )

    db.add(new_wish)
    db.commit()
    db.refresh(new_wish)

    db.close()

    return {
        "message": f"Thank you, {wish.name}! Your birthday wish has reached Abisola! 🎂💕",
        "wish_id": new_wish.id
    }

@app.get("/wishes")
def get_wishes():

    db = SessionLocal()

    wishes = db.query(Wish).order_by(Wish.created_at.desc()).all()

    db.close()

    return wishes