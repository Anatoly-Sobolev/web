const fs = require('fs');
const path = require('path');

const output = path.join(__dirname, '..', 'design', 'prototypes.drawio');

const screens = [
  ['Главная и конвертер', ['Шапка: логотип, Каталог, О проекте', 'Заголовок и краткое описание', 'Конвертер: значение, из, в, результат', 'Популярные категории', 'Подвал']],
  ['Каталог единиц', ['Шапка', 'Поиск по названию или обозначению', 'Фильтр по категории', 'Таблица единиц измерения', 'Подвал']],
  ['Карточка единицы', ['Шапка и возврат в каталог', 'Название, обозначение и категория', 'Описание и размерность', 'Формула и коэффициент', 'Подвал']],
];

const variants = [
  ['Mobile', 360, 760],
  ['Tablet', 768, 900],
  ['Desktop', 1280, 900],
];

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cell(id, value, style, x, y, width, height, parent = '1') {
  return `<mxCell id="${id}" value="${esc(value)}" style="${style}" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`;
}

function diagram(name, width, height, blocks, index) {
  const margin = width < 500 ? 20 : width < 1000 ? 36 : 64;
  const contentWidth = width - margin * 2;
  const headerHeight = 64;
  const footerHeight = 54;
  const available = height - headerHeight - footerHeight - 110;
  const gap = 14;
  const blockHeight = Math.max(62, Math.floor((available - gap * (blocks.length - 1)) / blocks.length));
  let id = index * 100 + 2;
  let xml = '';
  xml += cell(id++, `${name}`, 'rounded=0;whiteSpace=wrap;html=1;fillColor=#172554;fontColor=#ffffff;strokeColor=#172554;fontSize=18;fontStyle=1;align=left;spacingLeft=20;', 0, 0, width, headerHeight);
  xml += cell(id++, 'Навигация', 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#93c5fd;fontColor=#1e3a8a;fontSize=12;', Math.max(width - 150, margin), 14, Math.min(120, width - margin * 2), 36);
  let y = headerHeight + 32;
  blocks.forEach((block, blockIndex) => {
    const fill = blockIndex === 0 ? '#eff6ff' : '#ffffff';
    xml += cell(id++, block, `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=#94a3b8;fontColor=#0f172a;fontSize=15;align=left;verticalAlign=middle;spacingLeft=18;dashed=${blockIndex === 0 ? 0 : 1};`, margin, y, contentWidth, blockHeight);
    y += blockHeight + gap;
  });
  xml += cell(id++, 'Подвал: контакты и информация', 'rounded=0;whiteSpace=wrap;html=1;fillColor=#e2e8f0;strokeColor=#94a3b8;fontColor=#334155;fontSize=12;', 0, height - footerHeight, width, footerHeight);
  return `<diagram id="screen-${index}" name="${esc(name)}"><mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width + 120}" pageHeight="${height + 120}" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${xml}</root></mxGraphModel></diagram>`;
}

let pages = '';
let index = 1;
for (const [screen, blocks] of screens) {
  for (const [variant, width, height] of variants) {
    pages += diagram(`${screen} — ${variant}`, width, height, blocks, index++);
  }
}

const result = `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" modified="2026-09-27T00:00:00.000Z" agent="Codex" version="24.7.17" type="device" pages="9">${pages}</mxfile>`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, result, 'utf8');
console.log(`Created ${output} with ${index - 1} pages`);
