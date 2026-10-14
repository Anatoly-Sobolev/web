// Генератор структурных прототипов design/prototypes.drawio (ЛР1).
// Страницы: карта сайта с переходами, 9 экранов (3 страницы × Mobile/Tablet/Desktop),
// состояния интерфейса. Элементы навигации содержат ссылки на страницы документа
// (в draw.io переход выполняется щелчком по элементу в режиме просмотра).
// Запуск: node scripts/build_prototypes.js
const fs = require('fs');
const path = require('path');

const output = path.join(__dirname, '..', 'design', 'prototypes.drawio');
let nextId = 2;

const C = {
  dark: '#172554', accent: '#2563eb', accentLight: '#dbeafe', text: '#0f172a', muted: '#475569',
  line: '#94a3b8', border: '#cbd5e1', panel: '#f8fafc', footer: '#e2e8f0', ok: '#dcfce7', okLine: '#86efac',
  okText: '#166534', err: '#fee2e2', errLine: '#fca5a5', errText: '#991b1b', note: '#fef9c3', noteLine: '#eab308',
};

const PAGE = {
  map: 'map', states: 'states',
  home: { Mobile: 'screen-1', Tablet: 'screen-2', Desktop: 'screen-3' },
  catalog: { Mobile: 'screen-4', Tablet: 'screen-5', Desktop: 'screen-6' },
  unit: { Mobile: 'screen-7', Tablet: 'screen-8', Desktop: 'screen-9' },
};

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\n', '&#xa;');
}

function geometry(x, y, width, height) {
  return `<mxGeometry x="${Math.round(x)}" y="${Math.round(y)}" width="${Math.round(width)}" height="${Math.round(height)}" as="geometry"/>`;
}

function box(value, x, y, width, height, style, link) {
  const id = nextId++;
  if (link) {
    return `<UserObject label="${escapeXml(value)}" link="data:page/id,${link}" id="${id}"><mxCell style="${style}" vertex="1" parent="1">${geometry(x, y, width, height)}</mxCell></UserObject>`;
  }
  return `<mxCell id="${id}" value="${escapeXml(value)}" style="${style}" vertex="1" parent="1">${geometry(x, y, width, height)}</mxCell>`;
}

function boxWithId(id, value, x, y, width, height, style, link) {
  const attrs = link ? ` link="data:page/id,${link}"` : '';
  return `<UserObject label="${escapeXml(value)}"${attrs} id="${id}"><mxCell style="${style}" vertex="1" parent="1">${geometry(x, y, width, height)}</mxCell></UserObject>`;
}

function edge(source, target, label, style = '') {
  const id = nextId++;
  return `<mxCell id="${id}" value="${escapeXml(label)}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;strokeColor=${C.accent};strokeWidth=2;fontSize=12;fontColor=${C.text};labelBackgroundColor=#ffffff;${style}" edge="1" parent="1" source="${source}" target="${target}"><mxGeometry relative="1" as="geometry"/></mxCell>`;
}

const text = (value, x, y, width, height, size = 14, bold = false, color = C.text, align = 'left') =>
  box(value, x, y, width, height, `text;html=1;strokeColor=none;fillColor=none;align=${align};verticalAlign=middle;whiteSpace=wrap;fontSize=${size};fontStyle=${bold ? 1 : 0};fontColor=${color};`);
const linkText = (value, x, y, width, height, target, size = 13) =>
  box(value, x, y, width, height, `text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=${size};fontColor=${C.accent};fontStyle=4;`, target);
const field = (value, x, y, width, height = 40) =>
  box(value, x, y, width, height, `rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.line};fontColor=${C.muted};align=left;spacingLeft=12;fontSize=13;`);
const button = (value, x, y, width, height = 40, target, secondary = false) =>
  box(value, x, y, width, height, `rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=${secondary ? '#ffffff' : C.accent};strokeColor=${C.accent};fontColor=${secondary ? C.accent : '#ffffff'};fontStyle=1;fontSize=13;`, target);
const panel = (x, y, width, height, fill = '#ffffff') =>
  box('', x, y, width, height, `rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${C.border};`);
const label = (value, x, y, width) => text(value, x, y, width, 18, 12, true, C.muted);
const note = (value, x, y, width, height) =>
  box(value, x, y, width, height, `shape=note;size=14;whiteSpace=wrap;html=1;fillColor=${C.note};strokeColor=${C.noteLine};fontColor=${C.text};fontSize=12;align=left;spacingLeft=10;spacingRight=10;verticalAlign=top;spacingTop=8;`);
const resultBox = (value, x, y, width, height = 56, kind = 'ok') =>
  box(value, x, y, width, height, `rounded=1;arcSize=10;whiteSpace=wrap;html=1;fillColor=${kind === 'ok' ? C.ok : C.err};strokeColor=${kind === 'ok' ? C.okLine : C.errLine};fontColor=${kind === 'ok' ? C.okText : C.errText};fontStyle=1;fontSize=13;align=left;spacingLeft=14;`);

function header(width, variant, active) {
  const mobile = variant === 'Mobile';
  let xml = box('', 0, 0, width, mobile ? 56 : 64, `rounded=0;whiteSpace=wrap;html=1;fillColor=${C.dark};strokeColor=${C.dark};`);
  xml += box('▱ Мера', 16, 12, 110, 32, `text;html=1;strokeColor=none;fillColor=none;fontColor=#ffffff;fontSize=18;fontStyle=1;align=left;verticalAlign=middle;`, PAGE.home[variant]);
  if (mobile) {
    xml += box('☰ Меню', width - 96, 12, 80, 32, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.accentLight};strokeColor=#93c5fd;fontColor=#1e3a8a;fontSize=12;`, PAGE.states);
  } else {
    const items = [['Главная', PAGE.home[variant], 'home'], ['Каталог', PAGE.catalog[variant], 'catalog'], ['О проекте', PAGE.home[variant], 'about']];
    let x = width - 24 - 3 * 92;
    for (const [name, target, key] of items) {
      xml += box(name, x, 16, 86, 32, `rounded=1;whiteSpace=wrap;html=1;fillColor=${key === active ? C.accentLight : 'none'};strokeColor=${key === active ? '#93c5fd' : '#64748b'};fontColor=${key === active ? '#1e3a8a' : '#ffffff'};fontSize=12;fontStyle=${key === active ? 1 : 0};`, target);
      x += 92;
    }
  }
  return xml;
}

function footer(width, y) {
  return box('© 2026 Мера — справочник единиц измерения · подвал', 0, y, width, 48, `rounded=0;whiteSpace=wrap;html=1;fillColor=${C.footer};strokeColor=${C.line};fontColor=#334155;fontSize=11;`);
}

function layout(width, variant) {
  const margin = variant === 'Mobile' ? 16 : variant === 'Tablet' ? 24 : 64;
  return { margin, inner: width - margin * 2, top: (variant === 'Mobile' ? 56 : 64) + 24 };
}

/* ---------- Главная ---------- */
function home(width, variant) {
  const { margin, inner, top } = layout(width, variant);
  let xml = header(width, variant, 'home');
  let y = top;
  xml += text('Конвертер единиц измерения', margin, y, inner, 34, variant === 'Mobile' ? 22 : 28, true);
  y += 34;
  xml += text('Простой и быстрый инструмент для точного перевода величин', margin, y, inner, 24, 13, false, C.muted);
  y += 36;

  const pad = 16;
  const formWidth = inner - pad * 2;
  let panelHeight;
  let body = '';
  const py = y + pad;
  if (variant === 'Mobile') {
    let cy = py;
    for (const [name, value] of [['Значение', '100'], ['Из', 'Метр (м) ▼'], ['В', 'Сантиметр (см) ▼']]) {
      body += label(name, margin + pad, cy, formWidth);
      body += field(value, margin + pad, cy + 20, formWidth);
      cy += 68;
    }
    body += button('Конвертировать', margin + pad, cy, formWidth);
    body += resultBox('Результат: 100 м = 10 000 см\nФормула: 1 м = 100 см', margin + pad, cy + 52, formWidth);
    panelHeight = cy + 52 + 56 + pad - y;
  } else if (variant === 'Tablet') {
    const half = (formWidth - 12) / 2;
    body += label('Значение', margin + pad, py, formWidth);
    body += field('100', margin + pad, py + 20, formWidth);
    body += label('Из', margin + pad, py + 70, half);
    body += label('В', margin + pad + half + 12, py + 70, half);
    body += field('Метр (м) ▼', margin + pad, py + 90, half);
    body += field('Сантиметр (см) ▼', margin + pad + half + 12, py + 90, half);
    body += button('Конвертировать', margin + pad, py + 142, formWidth);
    body += resultBox('Результат: 100 м = 10 000 см\nФормула: 1 м = 100 см', margin + pad, py + 194, formWidth);
    panelHeight = 194 + 56 + pad * 2;
  } else {
    const col = (formWidth - 170 - 36) / 3;
    const xs = [0, 1, 2].map((i) => margin + pad + i * (col + 12));
    [['Значение', '100'], ['Из', 'Метр (м) ▼'], ['В', 'Сантиметр (см) ▼']].forEach(([name, value], i) => {
      body += label(name, xs[i], py, col);
      body += field(value, xs[i], py + 20, col);
    });
    body += button('Конвертировать', xs[2] + col + 12, py + 20, 170);
    body += resultBox('Результат: 100 м = 10 000 см    ·    Формула: 1 м = 100 см', margin + pad, py + 76, formWidth);
    panelHeight = 76 + 56 + pad * 2;
  }
  xml += panel(margin, y, inner, panelHeight) + body;
  y += panelHeight + 28;

  xml += text('Категории', margin, y, inner, 26, 18, true);
  y += 34;
  const columns = variant === 'Desktop' ? 3 : variant === 'Tablet' ? 2 : 1;
  const gap = 12;
  const cardWidth = (inner - gap * (columns - 1)) / columns;
  const cardHeight = variant === 'Mobile' ? 52 : 76;
  const cats = [['Длина', 11], ['Масса', 8], ['Время', 6], ['Температура', 4], ['Площадь', 6], ['Объём', 6]];
  cats.forEach(([name, count], index) => {
    const x = margin + (index % columns) * (cardWidth + gap);
    const cy = y + Math.floor(index / columns) * (cardHeight + gap);
    xml += box(`[иконка]  ${name}\n${count} единиц(ы)`, x, cy, cardWidth, cardHeight, `rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.line};fontColor=#1e3a8a;fontStyle=1;fontSize=13;align=left;spacingLeft=14;`, PAGE.catalog[variant]);
  });
  y += Math.ceil(cats.length / columns) * (cardHeight + gap) + 16;

  xml += text('О проекте', margin, y, inner, 24, 16, true);
  y += 26;
  xml += text('Краткое описание справочника и его возможностей (якорь #about).', margin, y, inner, 36, 13, false, C.muted);
  y += 52;
  xml += note('Переходы: карточка категории → «Каталог» с фильтром по категории; кнопка «Конвертировать» → результат или сообщение об ошибке (страница «Состояния интерфейса»).', margin, y, Math.min(inner, 520), 64);
  y += 84;
  xml += footer(width, y);
  return { xml, height: y + 48 };
}

/* ---------- Каталог ---------- */
function catalog(width, variant) {
  const { margin, inner, top } = layout(width, variant);
  let xml = header(width, variant, 'catalog');
  let y = top;
  xml += text('Каталог единиц', margin, y, inner, 34, variant === 'Mobile' ? 22 : 28, true);
  y += 44;
  if (variant === 'Mobile') {
    xml += label('Поиск по названию или обозначению', margin, y, inner);
    xml += field('⌕  Введите запрос, например, метр…', margin, y + 20, inner);
    xml += label('Категория', margin, y + 70, inner);
    xml += field('Все категории ▼', margin, y + 90, inner);
    y += 144;
  } else {
    const searchWidth = inner * 0.66;
    xml += label('Поиск по названию или обозначению', margin, y, searchWidth);
    xml += field('⌕  Введите запрос, например, метр…', margin, y + 20, searchWidth);
    xml += label('Категория', margin + searchWidth + 16, y, inner - searchWidth - 16);
    xml += field('Все категории ▼', margin + searchWidth + 16, y + 20, inner - searchWidth - 16);
    y += 74;
  }
  xml += text('Найдено: 41 единица', margin, y, inner, 20, 12, false, C.muted);
  y += 28;

  const rows = [['Метр', 'м', 'Длина', '1'], ['Километр', 'км', 'Длина', '1 000'], ['Сантиметр', 'см', 'Длина', '0,01'], ['Миллиметр', 'мм', 'Длина', '0,001'], ['Килограмм', 'кг', 'Масса', '1']];
  if (variant === 'Mobile') {
    rows.forEach((row) => {
      xml += box('', margin, y, inner, 84, `rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.border};`, PAGE.unit[variant]);
      xml += linkText(row[0], margin + 14, y + 8, inner - 90, 24, PAGE.unit[variant], 15);
      xml += box(row[1], margin + inner - 64, y + 10, 50, 22, `rounded=1;whiteSpace=wrap;html=1;fillColor=#f1f5f9;strokeColor=none;fontSize=12;fontStyle=1;`);
      xml += text(`Категория: ${row[2]}`, margin + 14, y + 34, inner - 28, 18, 12, false, C.muted);
      xml += text(`Коэффициент к СИ: ${row[3]}`, margin + 14, y + 56, inner - 28, 18, 12, false, C.muted);
      y += 94;
    });
  } else {
    const cols = [0.36, 0.18, 0.2, 0.26].map((p) => p * inner);
    const head = ['Название', 'Обозначение', 'Категория', 'Коэффициент к СИ'];
    [head, ...rows].forEach((row, index) => {
      let x = margin;
      row.forEach((cell, c) => {
        const isName = c === 0 && index > 0;
        xml += box(cell, x, y, cols[c], 44, `whiteSpace=wrap;html=1;fillColor=${index === 0 ? C.accentLight : '#ffffff'};strokeColor=${C.border};align=left;spacingLeft=14;fontSize=13;fontStyle=${index === 0 ? 1 : isName ? 4 : 0};fontColor=${isName ? C.accent : C.text};`, isName ? PAGE.unit[variant] : undefined);
        x += cols[c];
      });
      y += 44;
    });
    y += 4;
  }
  xml += text('… остальные строки выводятся по той же схеме', margin, y, inner, 22, 12, false, C.muted);
  y += 34;
  xml += note('Поиск и фильтр сразу изменяют список; «Найдено: N» показывает число строк. Щелчок по названию → «Карточка единицы». Пустая выборка — см. «Состояния интерфейса».', margin, y, Math.min(inner, 560), 64);
  y += 84;
  xml += footer(width, y);
  return { xml, height: y + 48 };
}

/* ---------- Карточка единицы ---------- */
function unit(width, variant) {
  const { margin, inner, top } = layout(width, variant);
  let xml = header(width, variant, 'catalog');
  let y = top;
  xml += linkText('← Назад к каталогу', margin, y, 180, 22, PAGE.catalog[variant]);
  y += 34;
  const pad = variant === 'Mobile' ? 16 : 28;
  const cw = inner - pad * 2;
  const x0 = margin + pad;
  let body = '';
  let cy = y + pad;
  body += text('Метр', x0, cy, 200, 36, variant === 'Mobile' ? 24 : 28, true);
  const badgeX = variant === 'Mobile' ? x0 : x0 + cw - 300;
  if (variant === 'Mobile') cy += 42;
  body += box('Обозначение: м', badgeX, cy + 6, 130, 26, `rounded=1;whiteSpace=wrap;html=1;fillColor=#f1f5f9;strokeColor=none;fontSize=12;`);
  body += box('Категория: Длина', badgeX + 140, cy + 6, 150, 26, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.accentLight};strokeColor=none;fontColor=${C.accent};fontSize=12;`, PAGE.catalog[variant]);
  cy += 52;
  body += text('Описание', x0, cy, cw, 22, 15, true);
  body += text('Метр — основная единица длины в СИ; текст описания из справочника.', x0, cy + 24, cw, variant === 'Mobile' ? 52 : 30, 13, false, C.muted);
  cy += variant === 'Mobile' ? 88 : 66;
  body += text('Характеристики', x0, cy, cw, 22, 15, true);
  cy += 28;
  const facts = [['Международное обозначение', 'm (metre)'], ['Размерность', 'L'], ['Пересчёт в базовую единицу СИ', 'Базовая единица']];
  if (variant === 'Desktop') {
    const fw = (cw - 24) / 3;
    facts.forEach(([a, b], i) => { body += box(`${a}\n${b}`, x0 + i * (fw + 12), cy, fw, 54, `rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.border};align=left;spacingLeft=12;fontSize=12;`); });
    cy += 70;
  } else {
    facts.forEach(([a, b]) => { body += box(`${a}: ${b}`, x0, cy, cw, 36, `rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.border};align=left;spacingLeft=12;fontSize=12;`); cy += 44; });
    cy += 8;
  }
  const relCols = variant === 'Desktop' ? 3 : variant === 'Tablet' ? 2 : 1;
  const relations = ['1 м = 0,001 км', '1 м = 10 дм', '1 м = 100 см', '1 м = 1 000 мм', '1 м = 39,37 дюйм', '1 м = 3,28 фут'];
  const relRows = Math.ceil(relations.length / relCols);
  const relHeight = 40 + relRows * 24 + 12;
  body += box('', x0, cy, cw, relHeight, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.panel};strokeColor=${C.border};`);
  body += text('Соотношение с другими единицами', x0 + 14, cy + 8, cw - 28, 22, 12, true, C.muted);
  const rw = (cw - 28) / relCols;
  relations.forEach((r, i) => { body += text(r, x0 + 14 + (i % relCols) * rw, cy + 36 + Math.floor(i / relCols) * 24, rw, 22, 13, true); });
  cy += relHeight + 16;
  body += button('Открыть в конвертере', x0, cy, variant === 'Mobile' ? cw : 200, 40, PAGE.home[variant], true);
  cy += 40 + pad;
  xml += panel(margin, y, inner, cy - y) + body;
  y = cy + 24;
  xml += note('Бейдж категории и ссылка «Назад» → «Каталог»; кнопка → «Главная» с выбранной единицей. Неизвестная единица — см. «Состояния интерфейса».', margin, y, Math.min(inner, 560), 64);
  y += 84;
  xml += footer(width, y);
  return { xml, height: y + 48 };
}

/* ---------- Карта сайта ---------- */
function siteMap() {
  let xml = text('Карта сайта «Мера» и пользовательские переходы', 40, 20, 900, 36, 22, true);
  xml += text('Три страницы, каждая в вариантах Mobile / Tablet / Desktop. Прямоугольники — страницы (щелчок открывает прототип), стрелки — действия пользователя.', 40, 56, 1000, 40, 13, false, C.muted);
  const page = (id, title, desc, x, y, target) => boxWithId(id, `<b>${title}</b><br><font style="font-size:12px">${desc}</font>`, x, y, 280, 120,
    `rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.dark};strokeWidth=2;fontSize=16;fontColor=${C.text};verticalAlign=top;spacingTop=12;`, target);
  xml += page('map-home', 'Главная (index)', 'Конвертер величин, карточки 6 категорий, блок «О проекте»', 60, 160, PAGE.home.Desktop);
  xml += page('map-catalog', 'Каталог (catalog)', 'Поиск по названию и обозначению, фильтр по категории, таблица/список единиц', 560, 160, PAGE.catalog.Desktop);
  xml += page('map-unit', 'Карточка единицы (unit?id=…)', 'Описание, характеристики, формулы и коэффициенты пересчёта', 1060, 160, PAGE.unit.Desktop);
  xml += boxWithId('map-states', '<b>Состояния интерфейса</b><br><font style="font-size:12px">Результат и ошибка конвертации, пустой поиск, единица не найдена, БД недоступна, мобильное меню</font>', 560, 420, 280, 110,
    `rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=${C.note};strokeColor=${C.noteLine};strokeWidth=2;fontSize=16;fontColor=${C.text};verticalAlign=top;spacingTop=12;`, PAGE.states);
  xml += edge('map-home', 'map-catalog', 'Меню «Каталог» / карточка категории', 'exitX=1;exitY=0.3;entryX=0;entryY=0.3;');
  xml += edge('map-catalog', 'map-home', 'Логотип / меню «Главная»', 'exitX=0;exitY=0.75;entryX=1;entryY=0.75;');
  xml += edge('map-catalog', 'map-unit', 'Щелчок по названию единицы', 'exitX=1;exitY=0.3;entryX=0;entryY=0.3;');
  xml += edge('map-unit', 'map-catalog', '«← Назад к каталогу» / бейдж категории', 'exitX=0;exitY=0.75;entryX=1;entryY=0.75;');
  xml += edge('map-unit', 'map-home', '«Открыть в конвертере»', 'exitX=0.5;exitY=0;entryX=0.5;entryY=0;');
  xml += edge('map-home', 'map-states', 'Конвертировать', 'exitX=0.5;exitY=1;entryX=0;entryY=0.5;dashed=1;strokeColor=#ca8a04;');
  xml += edge('map-catalog', 'map-states', 'Поиск без результатов', 'exitX=0.5;exitY=1;entryX=0.5;entryY=0;dashed=1;strokeColor=#ca8a04;');
  xml += edge('map-unit', 'map-states', 'Неверный id', 'exitX=0.5;exitY=1;entryX=1;entryY=0.5;dashed=1;strokeColor=#ca8a04;');
  xml += text('Варианты страниц:', 60, 580, 400, 24, 15, true);
  let x = 60;
  for (const [key, title] of [['home', 'Главная'], ['catalog', 'Каталог'], ['unit', 'Карточка']]) {
    let y = 612;
    for (const variant of ['Mobile', 'Tablet', 'Desktop']) {
      xml += box(`${title} — ${variant}`, x, y, 220, 34, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.accentLight};strokeColor=#93c5fd;fontColor=#1e3a8a;fontSize=12;`, PAGE[key][variant]);
      y += 42;
    }
    x += 240;
  }
  xml += note('Адаптация: Mobile (360 px) — одна колонка, меню «☰»; Tablet (768 px) — две колонки категорий, поля «Из/В» в строку; Desktop (1440 px) — полное меню, форма конвертера в одну строку, три колонки категорий, таблица каталога.', 820, 600, 520, 110);
  return { xml, width: 1400, height: 760 };
}

/* ---------- Состояния интерфейса ---------- */
function states() {
  let xml = text('Состояния интерфейса', 40, 20, 900, 36, 22, true);
  xml += text('Состояния показаны в мобильной ширине (360 px); на планшете и компьютере используются те же блоки.', 40, 56, 1000, 24, 13, false, C.muted);
  const cards = [
    ['1. Конвертер — результат', (x, y) => field('100', x, y, 328) + field('Метр (м) ▼', x, y + 48, 328) + field('Сантиметр (см) ▼', x, y + 96, 328) + button('Конвертировать', x, y + 144, 328) + resultBox('Результат: 100 м = 10 000 см\nФормула: 1 м = 100 см', x, y + 196, 328)],
    ['2. Конвертер — ошибка ввода', (x, y) => box('абв', x, y, 328, 40, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.err};strokeColor=#dc2626;fontColor=${C.text};align=left;spacingLeft=12;fontSize=13;`) + field('Метр (м) ▼', x, y + 48, 328) + field('Сантиметр (см) ▼', x, y + 96, 328) + button('Конвертировать', x, y + 144, 328) + resultBox('Значение должно быть числом,\nнапример 12,5 или -40.', x, y + 196, 328, 56, 'err')],
    ['3. Каталог — ничего не найдено', (x, y) => field('⌕  парсек', x, y, 328) + field('Все категории ▼', x, y + 48, 328) + text('Найдено: 0 единиц', x, y + 96, 328, 20, 12, false, C.muted) + box('Ничего не найдено\nИзмените запрос или категорию', x, y + 124, 328, 80, `rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.border};fontSize=13;`) + button('Сбросить фильтры', x + 84, y + 214, 160, 36, PAGE.catalog.Mobile, true)],
    ['4. Карточка — единица не найдена (404)', (x, y) => linkText('← Назад к каталогу', x, y, 200, 22, PAGE.catalog.Mobile) + box('Единица не найдена\nПроверьте ссылку или выберите единицу в каталоге', x, y + 34, 328, 100, `rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=${C.border};fontSize=13;`) + button('Перейти в каталог', x + 84, y + 146, 160, 36, PAGE.catalog.Mobile, true)],
    ['5. Любая страница — БД недоступна (503)', (x, y) => box('База данных недоступна\nНе удалось подключиться к серверу БД.\nПовторите попытку позже.', x, y, 328, 110, `rounded=1;whiteSpace=wrap;html=1;fillColor=${C.err};strokeColor=${C.errLine};fontColor=${C.errText};fontSize=13;`) + button('Повторить', x + 84, y + 122, 160, 36, undefined, true)],
    ['6. Мобильное меню открыто', (x, y) => box('', x, y, 328, 176, `rounded=0;whiteSpace=wrap;html=1;fillColor=${C.dark};strokeColor=${C.dark};`) + box('Главная', x + 16, y + 16, 296, 40, `text;html=1;fontColor=#ffffff;fontSize=14;align=left;verticalAlign=middle;strokeColor=none;`, PAGE.home.Mobile) + box('Каталог', x + 16, y + 64, 296, 40, `text;html=1;fontColor=#ffffff;fontSize=14;align=left;verticalAlign=middle;strokeColor=none;`, PAGE.catalog.Mobile) + box('О проекте', x + 16, y + 112, 296, 40, `text;html=1;fontColor=#ffffff;fontSize=14;align=left;verticalAlign=middle;strokeColor=none;`, PAGE.home.Mobile)],
  ];
  cards.forEach(([title, draw], i) => {
    const x = 40 + (i % 3) * 420;
    const y = 110 + Math.floor(i / 3) * 360;
    xml += box('', x, y, 380, 320, `rounded=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=${C.panel};strokeColor=${C.border};dashed=1;`);
    xml += text(title, x + 16, y + 10, 348, 26, 14, true);
    xml += draw(x + 26, y + 48);
  });
  return { xml, width: 1300, height: 820 };
}

function diagram(id, name, content, width, height) {
  return `<diagram id="${id}" name="${escapeXml(name)}"><mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${content}</root></mxGraphModel></diagram>`;
}

const variants = [['Mobile', 360], ['Tablet', 768], ['Desktop', 1440]];
const screens = [['Главная и конвертер', home, 'home'], ['Каталог единиц', catalog, 'catalog'], ['Карточка единицы', unit, 'unit']];
let pages = '';
nextId = 2;
const map = siteMap();
pages += diagram(PAGE.map, '0. Карта сайта и переходы', map.xml, map.width, map.height);
for (const [title, draw, key] of screens) {
  for (const [variant, width] of variants) {
    nextId = 1000 * (Object.keys(PAGE).indexOf(key) + 1) + 100 * variants.findIndex((v) => v[0] === variant);
    const { xml, height } = draw(width, variant);
    pages += diagram(PAGE[key][variant], `${title} — ${variant}`, xml, width, height);
  }
}
nextId = 9000;
const st = states();
pages += diagram(PAGE.states, '10. Состояния интерфейса', st.xml, st.width, st.height);

const result = `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" agent="build_prototypes.js" version="24.7.17" type="device" pages="11">${pages}</mxfile>`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, result, 'utf8');
console.log(`Created ${output} with 11 pages`);
