# Reels Script Generator — Developer Skill

Ты работаешь с проектом **Автогенератор сценариев для Reels/Shorts/TikTok**.

## Структура проекта

```
reels-script-generator/
├── backend/
│   └── main.py            # FastAPI. Единственный эндпоинт: POST /generate
├── frontend/              # Next.js 16 (App Router, TypeScript, Tailwind)
│   ├── app/
│   │   ├── page.tsx       # Главная страница (Client Component)
│   │   ├── layout.tsx     # Метаданные, шрифты
│   │   └── api/generate/  # УСТАРЕЛО — бэкенд теперь на FastAPI, не трогать
│   ├── components/
│   │   ├── ScriptForm.tsx     # Форма ввода (topic, product, audience, style)
│   │   ├── ScriptResult.tsx   # Вывод сценария по блокам
│   │   └── CopyButton.tsx     # Копирование в буфер
│   ├── lib/
│   │   └── anthropic.ts   # OpenAI-клиент (ProxyAPI) — здесь MODEL и baseURL
│   └── types/
│       └── script.ts      # ScriptInput, ScriptOutput, Scene, VideoStyle
├── prompts/
│   └── script_prompt.py   # build_prompt() — шаблон промпта для бэкенда
├── .env                   # PROXYAPI_KEY (не коммитить)
├── requirements.txt       # Python-зависимости
└── README.md
```

## Запуск сервисов

**Бэкенд (FastAPI, порт 8001):**
```bash
python -m uvicorn backend.main:app --reload --port 8001
```
Запускать из корня проекта (`reels-script-generator/`).

**Фронтенд (Next.js, порт 3000):**
```bash
cd frontend && npm run dev
```

**Проверить что оба работают:**
```bash
curl http://localhost:8001/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{"topic":"тест","product":"тест","audience":"тест","style":"expert"}'
```

## Ключевые детали

- **Модель**: `gpt-5-mini` через ProxyAPI (`https://api.proxyapi.ru/openai/v1`)
- **API-ключ**: переменная `PROXYAPI_KEY` в `.env` (корень проекта)
- **CORS**: бэкенд разрешает запросы с `localhost:3000` и `localhost:3001`
- **Фронтенд → бэкенд**: `fetch("http://localhost:8001/generate", ...)` в `frontend/app/page.tsx`
- **JSON-режим**: бэкенд передаёт `response_format={"type": "json_object"}` и **не ограничивает** `max_completion_tokens` (без лимита — иначе модель возвращает пустой ответ)
- **Стили видео**: `expert | sales | entertainment | educational` — описания в `prompts/script_prompt.py`

## Типичные задачи

### Изменить промпт
Редактировать `prompts/script_prompt.py` → функция `build_prompt()`.
Бэкенд перезагрузится автоматически (uvicorn --reload).

### Добавить поле в форму
1. `frontend/types/script.ts` — добавить поле в `ScriptInput`
2. `frontend/components/ScriptForm.tsx` — добавить input/select
3. `prompts/script_prompt.py` — использовать новое поле в промпте
4. `backend/main.py` — добавить поле в `ScriptRequest`

### Изменить модель
`frontend/lib/anthropic.ts` → `MODEL = "..."` (для Next.js API route, если используется)
`backend/main.py` → `MODEL = "..."` (для FastAPI бэкенда — актуально)

### Добавить новый стиль видео
`prompts/script_prompt.py` → `STYLE_DESCRIPTIONS`
`frontend/types/script.ts` → `VideoStyle`
`frontend/components/ScriptForm.tsx` → массив `styles`

## Диагностика ошибок

| Симптом | Причина | Решение |
|---|---|---|
| `Ошибка соединения с сервером` | Бэкенд не запущен или занят другой процесс на 8001 | Запустить бэкенд, проверить порт |
| `400 Unsupported parameter: max_tokens` | Модель не поддерживает `max_tokens` | Использовать `max_completion_tokens` или убрать лимит |
| `finish_reason=length`, пустой ответ | Лимит токенов слишком мал | Убрать `max_completion_tokens` |
| `401` от ProxyAPI | Ключ не загружен | Проверить `.env`, перезапустить uvicorn |
| `Не удалось разобрать ответ модели` | Модель вернула не-JSON | Убедиться что `response_format={"type":"json_object"}` передаётся |
| Порт 8000 занят чужим процессом | user-manual-generator или другой FastAPI | Использовать порт 8001 |

## Обновление README

README находится в корне: `reels-script-generator/README.md`.
После изменений:
```bash
git add README.md
git commit -m "docs: update README"
git push
```

## Публикация на GitHub

Репозиторий: **https://github.com/kgruzdova/reels-script-generator**

Перед пушем проверить:
- [ ] `.env` не попал в коммит (есть в `.gitignore`)
- [ ] `frontend/node_modules/` не в коммите
- [ ] Бэкенд запускается без ошибок
- [ ] Фронтенд открывается в браузере
- [ ] Генерация работает end-to-end

```bash
git add .
git status          # проверить что .env не попал
git commit -m "..."
git push
```
