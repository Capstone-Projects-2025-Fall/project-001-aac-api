from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from .routers import transcribe

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # in prod url will go here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcribe.router)


#example from fastapi website
@app.get("/")
def root():
    return {"message": "Speech Transcription API"}
