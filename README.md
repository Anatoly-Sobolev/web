# Мера

Учебный проект «Мера — справочник единиц измерения» по дисциплине «Основы web-технологий» (тема 12).
Сайт: конвертер величин, каталог единиц по категориям, поиск по названию и обозначению, формулы
и коэффициенты пересчёта в базовую единицу СИ.

## Состав

| Лабораторная | Результат | Отчёт |
|---|---|---|
| ЛР1. Прототипы | `design/prototypes.drawio` — карта сайта, 9 прототипов (Mobile/Tablet/Desktop), состояния интерфейса | `docs/lab-01/Отчёт_ЛР1_Соболев.docx` |
| ЛР2. Дизайн | [Проект Figma](https://www.figma.com/design/sCt5ju49i6680hCjosaYHh/): стили, компоненты, 9 макетов, состояния, Prototype | `docs/lab-02/Отчёт_ЛР2_Соболев.docx` |
| ЛР3. Вёрстка | `site/` — статическая адаптивная вёрстка с рабочим JavaScript | `docs/lab-03/Отчёт_ЛР3_Соболев.docx` |
| ЛР4. Окружение | `server/` — NGINX 1.30.5 + PHP 8.4.26 (FastCGI) + PostgreSQL 18.1, `compose.yaml` для Linux | `docs/lab-04/Отчёт_ЛР4_Соболев.docx` |
| ЛР5. База данных | `database/`, `app/` — PHP + PDO, динамический вывод данных | `docs/lab-05/Отчёт_ЛР5_Соболев.docx` |

Снимки экрана для отчётов лежат в `docs/lab-0N/screenshots/`.

## Структура

```text
app/            PHP-приложение (public/ — корень сайта, src/ — PDO и SQL, templates/, config/)
data/units.json единый источник данных: 12 категорий, 140 единиц
database/       schema.sql, seed.sql (seed генерируется из data/units.json)
design/         prototypes.drawio
docker/         конфигурация для docker compose
docs/           отчёты, снимки экрана, дизайн-спецификация
scripts/        build_data.js, build_prototypes.js, build_reports.py, report_content.py
server/         конфигурация NGINX и PHP, сценарии setup-db.ps1, start.ps1, stop.ps1
site/           статическая вёрстка (ЛР3); css/js/img используются и PHP-приложением
```

## Запуск в Windows

Портативные NGINX и PHP распаковываются в `server/bin/` (в Git не хранятся):

- `server/bin/nginx/` — nginx-1.30.5.zip с https://nginx.org/ru/download.html;
- `server/bin/php/` — php-8.4.26-nts-Win32-vs17-x64.zip с https://windows.php.net/download/.

Нужен установленный PostgreSQL 18 (`C:\Program Files\PostgreSQL\18\bin`, другой путь — переменная `PG_BIN`).

```powershell
powershell -ExecutionPolicy Bypass -File server\setup-db.ps1   # кластер .local\pgdata (порт 5433), база mera, данные
powershell -ExecutionPolicy Bypass -File server\start.ps1      # PostgreSQL, php-cgi :9000, NGINX :8080
powershell -ExecutionPolicy Bypass -File server\stop.ps1
```

- http://mera.localhost:8080/ — PHP-приложение (ЛР4–5), http://mera.localhost:8080/status.php — проверка окружения;
- http://static.mera.localhost:8080/ — статическая вёрстка (ЛР3).

В Linux с Docker: `docker compose up -d` → http://localhost:8080/.

## Пересборка

```powershell
node scripts/build_data.js          # site/js/units-data.js и database/seed.sql из data/units.json
node scripts/build_prototypes.js    # design/prototypes.drawio
python scripts/build_reports.py     # пять DOCX-отчётов (нужны python-docx, pypdf, Pillow и LibreOffice)
```

## Принятые решения

- Справочник расширен до 12 категорий и 140 единиц: добавлены скорость, давление, энергия, мощность, сила, данные,
  а также исторические русские и британские меры. Данные хранятся только в `data/units.json`; коэффициент `factor` — NUMERIC(60,32).
- Язык правки отчётов DOCX — русский; каждый раздел и подраздел начинается с новой страницы.
- Статическая вёрстка (`site/`) публикуется на GitHub Pages workflow `.github/workflows/pages.yml`.
- СУБД — PostgreSQL 18: уже установлен в системе; для проекта создан отдельный кластер на порту 5433,
  системная служба (5432) не изменялась.
- Docker и WSL на компьютере отсутствуют, поэтому NGINX и PHP — официальные портативные сборки без установки.
  PHP-FPM в Windows не поставляется; его роль выполняет `php-cgi -b 127.0.0.1:9000`. `compose.yaml`
  (nginx + php-fpm + postgres) подготовлен для Linux.
- Поиск и фильтр — часть каталога, отдельных страниц для них нет.
- Ширина макетов: Desktop 1440 px, Tablet 768 px, Mobile 360 px.

## Что осталось сделать вручную

- Опубликовать изменения в репозитории https://github.com/Anatoly-Sobolev/web: отчёты ссылаются на него
  как на исходный код, а изменения пока не закоммичены.
- По желанию заменить снимки Figma (`docs/lab-02/screenshots/`) на более крупные: они сделаны в браузерной
  панели шириной около 800 px. Имена файлов сохранить, затем выполнить `python scripts/build_reports.py 2`.
- `compose.yaml` не запускался (нет Docker); проверить на компьютере с Docker.
- Вёрстка проверена только в браузерах на движке Chromium (Edge); Firefox/Safari и валидатор W3C не использовались.
- Сверить в отчётах должность преподавателя («к.т.н., доцент Е. О. Викулов» взято из прежнего отчёта ЛР1).
- Демонстрационная запись «Фурлонг» (ЛР5) добавлена в БД вручную через psql; `server\setup-db.ps1`
  восстанавливает исходные 140 единиц.
