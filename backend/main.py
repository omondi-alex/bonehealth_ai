from typing import Union

from fastapi import FastAPI
from api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router, prefix="/api", tags=["Data Science"])
