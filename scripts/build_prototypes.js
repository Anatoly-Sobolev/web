const fs = require('fs');
const path = require('path');

const output = path.join(__dirname, '..', 'design', 'prototypes.drawio');
let nextId = 2;

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function box(value, x, y, width, height, style) {
  const id = nextId++;
  return `<mxCell id="${id}" value="${escapeXml(value)}" style="${style}" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`;
}

function text(value, x, y, width, height, size = 14, bold = false) {
  return box(value, x, y, width, height, `text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=${size};fontStyle=${bold ? 1 : 0};fontColor=#0f172a;`);
}

function field(value, x, y, width, height) {
  return box(value, x, y, width, height, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#94a3b8;fontColor=#475569;align=left;spacingLeft=12;fontSize=13;');
}

function button(value, x, y, width, height) {
  return box(value, x, y, width, height, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#2563eb;strokeColor=#1d4ed8;fontColor=#ffffff;fontStyle=1;fontSize=13;');
}

function panel(x, y, width, height) {
  return box('', x, y, width, height, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#f8fafc;strokeColor=#cbd5e1;');
}

function header(width, mobile) {
  let xml = box('Мера', 0, 0, width, 64, 'rounded=0;whiteSpace=wrap;html=1;fillColor=#172554;strokeColor=#172554;fontColor=#ffffff;fontSize=19;fontStyle=1;align=left;spacingLeft=20;');
  const navWidth = mobile ? 80 : 240;
  const navText = mobile ? 'Меню' : 'Главная   Каталог   О проекте';
  xml += box(navText, width - navWidth - 20, 14, navWidth, 36, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#93c5fd;fontColor=#1e3a8a;fontSize=12;');
  return xml;
}

function footer(width, height) {
  return box('Учебный проект · Справочник единиц измерения', 0, height - 48, width, 48, 'rounded=0;whiteSpace=wrap;html=1;fillColor=#e2e8f0;strokeColor=#94a3b8;fontColor=#334155;fontSize=11;');
}

function home(width, height) {
  const mobile = width < 500;
  const margin = mobile ? 18 : 40;
  const contentWidth = width - margin * 2;
  let xml = header(width, mobile);
  xml += text('Конвертер единиц измерения', margin, 82, contentWidth, 38, mobile ? 22 : 28, true);
  xml += text('Введите значение и выберите единицы.', margin, 120, contentWidth, 28, 14);

  const panelY = 164;
  const panelHeight = mobile ? 354 : 220;
  xml += panel(margin, panelY, contentWidth, panelHeight);

  if (mobile) {
    xml += text('Значение', margin + 16, panelY + 14, contentWidth - 32, 22, 12, true);
    xml += field('100', margin + 16, panelY + 38, contentWidth - 32, 42);
    xml += text('Из', margin + 16, panelY + 88, contentWidth - 32, 22, 12, true);
    xml += field('Метры ▼', margin + 16, panelY + 112, contentWidth - 32, 42);
    xml += text('В', margin + 16, panelY + 162, contentWidth - 32, 22, 12, true);
    xml += field('Сантиметры ▼', margin + 16, panelY + 186, contentWidth - 32, 42);
    xml += button('Конвертировать', margin + 16, panelY + 244, contentWidth - 32, 44);
    xml += box('Результат: 10 000 см', margin + 16, panelY + 300, contentWidth - 32, 38, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dcfce7;strokeColor=#86efac;fontColor=#166534;fontStyle=1;fontSize=13;');
  } else {
    const gap = 12;
    const controlWidth = Math.floor((contentWidth - 32 - gap * 2) / 3);
    const x1 = margin + 16;
    const x2 = x1 + controlWidth + gap;
    const x3 = x2 + controlWidth + gap;
    xml += text('Значение', x1, panelY + 18, controlWidth, 22, 12, true);
    xml += text('Из', x2, panelY + 18, controlWidth, 22, 12, true);
    xml += text('В', x3, panelY + 18, controlWidth, 22, 12, true);
    xml += field('100', x1, panelY + 44, controlWidth, 44);
    xml += field('Метры ▼', x2, panelY + 44, controlWidth, 44);
    xml += field('Сантиметры ▼', x3, panelY + 44, controlWidth, 44);
    xml += button('Конвертировать', x1, panelY + 108, controlWidth, 44);
    xml += box('Результат: 10 000 см', x2, panelY + 108, controlWidth * 2 + gap, 44, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dcfce7;strokeColor=#86efac;fontColor=#166534;fontStyle=1;fontSize=13;');
  }

  const categoriesY = panelY + panelHeight + 20;
  xml += text('Популярные категории', margin, categoriesY, contentWidth, 30, 18, true);
  const gap = 10;
  const columns = mobile ? 2 : 4;
  const cardWidth = Math.floor((contentWidth - gap * (columns - 1)) / columns);
  ['Длина', 'Масса', 'Время', 'Температура'].forEach((name, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    xml += box(name, margin + column * (cardWidth + gap), categoriesY + 40 + row * 58, cardWidth, 48, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#94a3b8;fontColor=#1e3a8a;fontStyle=1;fontSize=13;');
  });
  xml += footer(width, height);
  return xml;
}

function catalog(width, height) {
  const mobile = width < 500;
  const margin = mobile ? 18 : 40;
  const contentWidth = width - margin * 2;
  let xml = header(width, mobile);
  xml += text('Каталог единиц', margin, 82, contentWidth, 38, mobile ? 22 : 28, true);
  if (mobile) {
    xml += field('Поиск по названию или обозначению', margin, 136, contentWidth, 44);
    xml += field('Все категории ▼', margin, 190, contentWidth, 44);
  } else {
    xml += field('Поиск по названию или обозначению', margin, 136, contentWidth * 0.62, 44);
    xml += field('Все категории ▼', margin + contentWidth * 0.64, 136, contentWidth * 0.36, 44);
  }

  const listY = mobile ? 254 : 202;
  if (mobile) {
    const rows = [['Метр', 'м · Длина'], ['Километр', 'км · Длина'], ['Сантиметр', 'см · Длина'], ['Миллиметр', 'мм · Длина']];
    rows.forEach((row, index) => {
      const y = listY + index * 84;
      xml += box('', margin, y, contentWidth, 70, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#cbd5e1;');
      xml += text(row[0], margin + 14, y + 10, contentWidth - 28, 24, 15, true);
      xml += text(row[1], margin + 14, y + 36, contentWidth - 28, 20, 12);
    });
  } else {
    const col1 = Math.floor(contentWidth * 0.44);
    const col2 = Math.floor(contentWidth * 0.22);
    const col3 = contentWidth - col1 - col2;
    const rows = [['Название', 'Обозначение', 'Категория'], ['Метр', 'м', 'Длина'], ['Километр', 'км', 'Длина'], ['Сантиметр', 'см', 'Длина'], ['Миллиметр', 'мм', 'Длина']];
    rows.forEach((row, index) => {
      const y = listY + index * 48;
      const fill = index === 0 ? '#dbeafe' : '#ffffff';
      const bold = index === 0 ? 1 : 0;
      xml += box(row[0], margin, y, col1, 48, `whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=#cbd5e1;align=left;spacingLeft=14;fontStyle=${bold};fontSize=13;`);
      xml += box(row[1], margin + col1, y, col2, 48, `whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=#cbd5e1;fontStyle=${bold};fontSize=13;`);
      xml += box(row[2], margin + col1 + col2, y, col3, 48, `whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=#cbd5e1;fontStyle=${bold};fontSize=13;`);
    });
  }
  xml += footer(width, height);
  return xml;
}

function detail(width, height) {
  const mobile = width < 500;
  const margin = mobile ? 18 : 40;
  const contentWidth = width - margin * 2;
  let xml = header(width, mobile);
  xml += text('← Вернуться в каталог', margin, 82, contentWidth, 28, 13);
  xml += text('Метр', margin, 122, contentWidth, 42, mobile ? 26 : 32, true);
  xml += text('Обозначение: м   ·   Категория: Длина', margin, 166, contentWidth, 28, 14);
  const panelY = 214;
  xml += panel(margin, panelY, contentWidth, mobile ? 300 : 260);
  xml += text('Описание', margin + 18, panelY + 18, contentWidth - 36, 26, 17, true);
  xml += text('Метр — базовая единица длины в Международной системе единиц.', margin + 18, panelY + 48, contentWidth - 36, mobile ? 58 : 36, 14);
  xml += text('Размерность', margin + 18, panelY + 116, contentWidth - 36, 24, 14, true);
  xml += text('Длина', margin + 18, panelY + 142, contentWidth - 36, 24, 14);
  xml += text('Пересчёт в базовую единицу', margin + 18, panelY + 178, contentWidth - 36, 24, 14, true);
  xml += box('1 м = 100 см = 1000 мм', margin + 18, panelY + 208, contentWidth - 36, 44, 'rounded=1;whiteSpace=wrap;html=1;fillColor=#dbeafe;strokeColor=#93c5fd;fontColor=#1e3a8a;fontStyle=1;fontSize=14;');
  xml += footer(width, height);
  return xml;
}

function diagram(name, width, height, content, index) {
  nextId = index * 100 + 2;
  return `<diagram id="screen-${index}" name="${escapeXml(name)}"><mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${content(width, height)}</root></mxGraphModel></diagram>`;
}

const variants = [['Mobile', 360, 760], ['Tablet', 768, 900], ['Desktop', 1280, 900]];
const screens = [['Главная и конвертер', home], ['Каталог единиц', catalog], ['Карточка единицы', detail]];
let pages = '';
let index = 1;
for (const screen of screens) {
  for (const variant of variants) {
    pages += diagram(`${screen[0]} — ${variant[0]}`, variant[1], variant[2], screen[1], index++);
  }
}

const result = `<?xml version="1.0" encoding="UTF-8"?><mxfile host="app.diagrams.net" modified="2026-09-27T00:00:00.000Z" agent="Codex" version="24.7.17" type="device" pages="9">${pages}</mxfile>`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, result, 'utf8');
console.log(`Created ${output} with ${index - 1} pages`);
