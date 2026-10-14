// Собирает из data/units.json два производных файла:
//   site/js/units-data.js  — данные для статической вёрстки (ЛР3);
//   database/seed.sql      — начальные данные БД PostgreSQL (ЛР5).
// Запуск: node scripts/build_data.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'data', 'units.json'), 'utf8'));

const categorySlugs = new Set(source.categories.map((c) => c.slug));
for (const unit of source.units) {
  if (!categorySlugs.has(unit.category)) throw new Error(`Неизвестная категория у ${unit.slug}`);
}
for (const category of source.categories) {
  if (!source.units.some((u) => u.slug === category.base && u.category === category.slug)) {
    throw new Error(`Базовая единица ${category.base} не найдена в категории ${category.slug}`);
  }
}

const js = '/* Файл создан scripts/build_data.js из data/units.json. Не редактировать вручную. */\n' +
  `window.MERA_DATA = ${JSON.stringify(source, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'site', 'js', 'units-data.js'), js, 'utf8');

const q = (value) => `'${String(value).replaceAll("'", "''")}'`;
const n = (value) => String(Number(value));

let sql = '-- Начальные данные справочника «Мера».\n' +
  '-- Файл создан scripts/build_data.js из data/units.json.\n\n' +
  'BEGIN;\n\nTRUNCATE units, categories RESTART IDENTITY CASCADE;\n\n' +
  'INSERT INTO categories (slug, name, icon, dimension, description, sort_order) VALUES\n';
sql += source.categories.map((c, i) =>
  `  (${q(c.slug)}, ${q(c.name)}, ${q(c.icon)}, ${q(c.dimension)}, ${q(c.description)}, ${i + 1})`).join(',\n') + ';\n\n';

sql += 'INSERT INTO units (category_id, slug, name, name_en, symbol, symbol_intl, factor, offset_si, description, is_base, sort_order) VALUES\n';
sql += source.units.map((u, i) => {
  const base = source.categories.find((c) => c.slug === u.category).base === u.slug;
  return `  ((SELECT id FROM categories WHERE slug = ${q(u.category)}), ${q(u.slug)}, ${q(u.name)}, ${q(u.name_en)}, ` +
    `${q(u.symbol)}, ${q(u.symbol_intl)}, ${n(u.factor)}, ${n(u.offset)}, ${q(u.description)}, ${base ? 'TRUE' : 'FALSE'}, ${i + 1})`;
}).join(',\n') + ';\n\nCOMMIT;\n';
fs.writeFileSync(path.join(root, 'database', 'seed.sql'), sql, 'utf8');

console.log(`categories: ${source.categories.length}, units: ${source.units.length}`);
