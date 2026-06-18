import os
import sys
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from prompts.script_prompt import build_prompt

app = FastAPI(title="Reels Script Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

client = OpenAI(
    api_key=os.getenv("PROXYAPI_KEY"),
    base_url="https://api.proxyapi.ru/openai/v1",
)

MODEL = "gpt-5-mini"


class ScriptRequest(BaseModel):
    topic: str
    product: str
    audience: str
    style: str


@app.post("/generate")
async def generate(req: ScriptRequest):
    if not all([req.topic, req.product, req.audience, req.style]):
        raise HTTPException(status_code=400, detail="Все поля обязательны")

    prompt = build_prompt(req.topic, req.product, req.audience, req.style)

    response = client.chat.completions.create(
        model=MODEL,
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )

    choice = response.choices[0]
    raw = choice.message.content or ""
    print(f"finish_reason: {choice.finish_reason}")
    print(f"raw response: {repr(raw[:300])}")

    if not raw:
        raise HTTPException(status_code=500, detail=f"Модель вернула пустой ответ (finish_reason={choice.finish_reason})")

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        import re
        match = re.search(r"\{[\s\S]*\}", raw)
        if match:
            return json.loads(match.group())
        raise HTTPException(status_code=500, detail=f"Не удалось разобрать ответ модели: {raw[:200]}")
