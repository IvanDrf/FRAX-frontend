# FRAX — React + Redux Toolkit + Axios

Каталог, лента, авторизация и добавление факторов риска. Все AJAX-запросы приложения выполняются Axios. Методы факторов вызываются через сгенерированный `RiskFactorsService` внутри тематических thunk; регистрация, вход и выход написаны вручную без thunk.

## Запуск

```bash
npm ci
npm run dev
```

Адрес: http://localhost:3000. Для гостя без API автоматически включаются моки каталога и ленты. При сетевой ошибке/таймауте или HTTP 5xx показываются демонстрационные данные; HTTP 4xx и пустые ответы ими не подменяются. Авторизованному пользователю показывается ошибка, а не моки.

Для работы с настоящими данными запустите инфраструктуру и API в соседнем `FRAX-backend` с его настроенным `.env`:

```bash
cd ../FRAX-backend
docker compose up -d
venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Если схема БД ещё не создана, примените миграции: `venv/bin/alembic upgrade head`. В MinIO необходим bucket `frax-bucket` с разрешённым публичным чтением медиа. Приложение не меняет политику существующего хранилища.

Vite проксирует `/api` на порт 8000, `/s3` на порт 9000. При других адресах скопируйте `.env.example` в `.env.local` и измените targets. Браузер обращается только к origin фронтенда. Для production настройте аналогичные маршруты reverse proxy и SPA fallback на `index.html`: Vite dev proxy не включается в статическую сборку.

## Генерация и проверки

```bash
npm run codegen
npm run build
npm run lint
npm test
```

Браузерные тесты используют установленный Google Chrome (`channel: 'chrome'`). При его отсутствии установите Chrome через `npx playwright install chrome` или измените channel в `playwright.config.ts`.

`openapi.json` — исходная спецификация. `scripts/generate-api.mjs` адаптирует обозначение файлов OpenAPI 3.1 к `format: binary`, задаёт тематические operationId и тег `RiskFactors`, затем генерирует клиент с `httpClient: 'axios'`. Сгенерированные файлы вручную не редактируются. Результат: `src/shared/api/generated/services/RiskFactorsService.ts`; Axios-транспорт: `src/shared/api/generated/core/request.ts`.

Интеграционная проверка с реальными API, PostgreSQL, Redis и MinIO:

```bash
node scripts/demo-live.mjs
```

Нужны работающие Vite/API и Python-окружение соседнего бэкенда. Скрипт создаёт отдельного пользователя `frax_demo_*`, через UI загружает файлы, публикует фактор, меняет только его запись SQL-запросом, проверяет лайки, F5, cookie, права удаления и отзыв сессии. В `finally` удаляет только созданные им записи, файлы и сессии. Скриншоты сохраняются в `docs/screenshots`, результаты без значений cookie — в `docs/live-verification.json`. Первые два скриншота были сняты отдельно при выключенном API.

## Состояние и поведение

- `session`: username, status (`idle/loading/failed`), error. При F5 инициализируется гостем; cookie `session_id` остаётся до истечения срока или выхода. Автоматического восстановления UI по cookie нет — это условие задания.
- `riskFactorFilter`: вес. Фильтр передаётся в `risk_factor_weight`; сервер использует строгое сравнение `weight > value`. При нуле параметр не передаётся. Выход сбрасывает фильтр.
- `riskFactors`: каталог, текущий фактор ленты, черновик, признаки моков, ошибка, идентификаторы актуальных запросов.
- `requests`: ожидающие thunk по requestId. Вместе со статусом авторизации управляет общей анимацией загрузки и `inert` для блокирования интерфейса.

`configureStore` включает redux-thunk и Redux DevTools. Файлы `File` передаются thunk как аргументы, а в Redux сохраняется только ответ сервера. Пароль и cookie не сохраняются в Redux/localStorage.

Каталог открывает `/reels/:id` и выполняет `GET /api/factors/reels?risk_factor_id=id&next=false`. Кнопка «Следующий» отправляет `next=true` с текущим ID; полученный ID обновляет адрес страницы без дополнительного запроса `next=false`. `likes` и `is_liked` берутся из ответа; активный лайк красный, клик отправляет `POST /api/factors/like?risk_factor_id=id&add_like=false`, неактивный — `add_like=true`. Счётчик меняется после успешного ответа. Гость по нажатию на лайк переходит ко входу.

Кнопка удаления показывается только авторизованному автору (`is_creator`); удаление логическое. Добавление состоит из создания черновика (имя + image/video), затем публикации (описание + вес 1–2 + распространённость 0–100). Существующий черновик загружается с сервера; его можно удалить.

## Сопутствующие исправления API

В `FRAX-backend` исправлены три ошибки, мешавшие сценарию:

1. Лента при `next=false` теперь выбирает именно `risk_factor_id`.
2. Черновик резервирует ID последовательности PostgreSQL до INSERT, чтобы записывать обязательные URL файлов без нарушения NOT NULL.
3. Logout удаляет тот же ключ Redis `session:{session_id}`, который создал login.

Архитектурный пример изучен: [Licensing-cost-frontend, ветка redux-api](https://github.com/ivanSaichkin/Licensing-cost-frontend/tree/redux-api). Использованы те же принципы разделения session, доменных thunk, фильтра, API-клиента и состояния загрузки; контракт запросов соответствует FRAX.

Сценарий сдачи, контрольные вопросы и диаграмма: [docs/assignment.md](docs/assignment.md).
