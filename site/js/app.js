/* Мера — клиентская логика.
   Статическая версия (site/) получает данные из js/units-data.js (window.MERA_DATA).
   PHP-версия (app/) выводит разметку из БД, а этот файл добавляет меню и мгновенный
   пересчёт по коэффициентам из data-атрибутов <option>. */
(function () {
  'use strict';

  var data = window.MERA_DATA || null;

  /* ---------- Общие функции ---------- */

  function formatNumber(value) {
    if (!isFinite(value)) return '—';
    var abs = Math.abs(value);
    if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
      var parts = value.toExponential(6).split('e');
      var mantissa = parseFloat(parts[0]).toLocaleString('ru-RU', { maximumFractionDigits: 6 });
      return mantissa + ' × 10' + toSuperscript(parseInt(parts[1], 10));
    }
    return Number(value.toPrecision(12)).toLocaleString('ru-RU', { maximumFractionDigits: 10 });
  }

  function toSuperscript(number) {
    var map = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    return String(number).split('').map(function (ch) { return map[ch]; }).join('');
  }

  function parseNumber(text) {
    var normalized = String(text).replace(/\s| /g, '').replace(',', '.').replace('−', '-');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(normalized)) return NaN;
    return parseFloat(normalized);
  }

  function plural(n, one, few, many) {
    var mod10 = n % 10, mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function normalizeText(text) {
    return String(text || '').toLowerCase().replace(/ё/g, 'е').trim();
  }

  function convert(value, from, to) {
    return (value * from.factor + from.offset - to.offset) / to.factor;
  }

  /* Формула перевода from → to: линейная (1 a = k b) или со сдвигом (температура). */
  function relationText(from, to) {
    var k = from.factor / to.factor;
    var b = (from.offset - to.offset) / to.factor;
    if (Math.abs(b) < 1e-12) {
      return '1 ' + from.symbol + ' = ' + formatNumber(k) + ' ' + to.symbol;
    }
    var text = 'T(' + to.symbol + ') = T(' + from.symbol + ')';
    if (Math.abs(k - 1) > 1e-12) text += ' × ' + formatNumber(k);
    text += (b < 0 ? ' − ' : ' + ') + formatNumber(Math.abs(b));
    return text;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function icon(name, className) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'icon' + (className ? ' ' + className : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', 'img/icons.svg#' + name);
    svg.appendChild(use);
    return svg;
  }

  function findCategory(slug) {
    return data.categories.filter(function (c) { return c.slug === slug; })[0] || null;
  }

  function findUnit(slug) {
    return data.units.filter(function (u) { return u.slug === slug; })[0] || null;
  }

  function unitsOf(categorySlug) {
    return data.units.filter(function (u) { return u.category === categorySlug; });
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  /* ---------- Мобильное меню ---------- */

  function initMenu() {
    var button = document.querySelector('.menu-button');
    var nav = document.getElementById('main-nav');
    if (!button || !nav) return;
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      nav.classList.toggle('is-open', open);
    });
    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        button.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- Конвертер ---------- */

  function fillUnitSelect(select) {
    if (!data || select.options.length) return;
    data.categories.forEach(function (category) {
      var group = el('optgroup');
      group.label = category.name;
      group.dataset.category = category.slug;
      unitsOf(category.slug).forEach(function (unit) {
        var option = el('option', '', unit.name + ' (' + unit.symbol + ')');
        option.value = unit.slug;
        option.dataset.factor = unit.factor;
        option.dataset.offset = unit.offset;
        option.dataset.symbol = unit.symbol;
        option.dataset.category = unit.category;
        option.dataset.name = unit.name;
        option.dataset.search = unit.name_en + ' ' + unit.symbol_intl;
        group.appendChild(option);
      });
      select.appendChild(group);
    });
  }

  function optionUnit(option) {
    return {
      slug: option.value,
      factor: parseFloat(option.dataset.factor),
      offset: parseFloat(option.dataset.offset),
      symbol: option.dataset.symbol,
      category: option.dataset.category
    };
  }

  function initConverter() {
    var form = document.querySelector('[data-converter]');
    if (!form) return;
    var input = form.elements.value;
    var from = form.elements.from;
    var to = form.elements.to;
    var result = document.querySelector('[data-result]');
    var resultValue = document.querySelector('[data-result-value]');
    var resultFormula = document.querySelector('[data-result-formula]');
    var error = document.querySelector('[data-error]');

    fillUnitSelect(from);
    fillUnitSelect(to);
    if (!from.options.length || !to.options.length) return;

    var query = params();
    if (data) {
      if (query.get('value') !== null) input.value = query.get('value');
      if (query.get('from') && findUnit(query.get('from'))) from.value = query.get('from');
      else if (!query.get('from')) from.value = 'metre';
      if (query.get('to') && findUnit(query.get('to'))) to.value = query.get('to');
      else if (!query.get('to')) to.value = 'centimetre';
    }

    /* В списке «В» доступны только единицы той же категории, что и «Из». */
    function syncTargetOptions() {
      var category = from.selectedOptions[0].dataset.category;
      var firstAllowed = null;
      Array.prototype.forEach.call(to.options, function (option) {
        var allowed = option.dataset.category === category;
        option.disabled = !allowed;
        option.hidden = !allowed;
        if (allowed && option.value !== from.value && !firstAllowed) firstAllowed = option;
      });
      Array.prototype.forEach.call(to.querySelectorAll('optgroup'), function (group) {
        group.hidden = group.dataset.category !== category;
      });
      if (to.selectedOptions[0].disabled && firstAllowed) to.value = firstAllowed.value;
    }

    function showError(message) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = message;
      error.hidden = false;
      result.hidden = true;
    }

    function calculate() {
      var value = parseNumber(input.value);
      if (input.value.trim() === '') return showError('Введите значение для конвертации.');
      if (isNaN(value)) return showError('Значение должно быть числом, например 12,5 или -40.');
      var source = optionUnit(from.selectedOptions[0]);
      var target = optionUnit(to.selectedOptions[0]);
      if (source.category !== target.category) return showError('Единицы должны относиться к одной категории.');
      if (source.category === 'temperature' && value * source.factor + source.offset < 0) {
        return showError('Температура не может быть ниже абсолютного нуля (0 К).');
      }
      input.removeAttribute('aria-invalid');
      error.hidden = true;
      resultValue.textContent = formatNumber(value) + ' ' + source.symbol + ' = ' +
        formatNumber(convert(value, source, target)) + ' ' + target.symbol;
      resultFormula.textContent = 'Формула: ' + relationText(source, target);
      result.hidden = false;
    }

    from.addEventListener('change', function () { syncTargetOptions(); calculate(); });
    to.addEventListener('change', calculate);
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') calculate();
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate();
      if (window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('value', input.value);
        url.searchParams.set('from', from.value);
        url.searchParams.set('to', to.value);
        window.history.replaceState(null, '', url);
      }
    });

    syncTargetOptions();
    if (input.value.trim() !== '') calculate();
    initUnitSheet(from, to);
  }

  /* ---------- Выбор единицы на телефоне: нижняя панель ----------
     Исходные <select> остаются источником значений и частью формы: панель строится
     из их option/optgroup, выбор записывается в select и вызывает обычное событие change.
     На компьютере и в браузерах без <dialog> работает стандартный select. */

  function optionName(option) {
    return option.dataset.name || option.textContent.replace(/\s*\([^()]*\)\s*$/, '');
  }

  function initUnitSheet(from, to) {
    var dialog = el('dialog', 'unit-sheet');
    if (!window.matchMedia || typeof dialog.showModal !== 'function') return;
    var mobile = window.matchMedia('(max-width: 600px), (hover: none) and (pointer: coarse)');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var titles = { from: 'Из какой единицы', to: 'В какую единицу' };

    dialog.setAttribute('aria-labelledby', 'unit-sheet-title');
    var backdrop = el('div', 'unit-sheet__backdrop');
    var panel = el('div', 'unit-sheet__panel');
    var header = el('div', 'unit-sheet__header');
    var title = el('h2', 'unit-sheet__title');
    title.id = 'unit-sheet-title';
    var closeButton = el('button', 'unit-sheet__close');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Закрыть');
    closeButton.appendChild(icon('close'));
    header.appendChild(title);
    header.appendChild(closeButton);

    var searchBox = el('label', 'search unit-sheet__search');
    searchBox.appendChild(el('span', 'visually-hidden', 'Поиск единицы'));
    searchBox.appendChild(icon('search', 'search__icon'));
    var search = el('input', 'field__control');
    search.type = 'search';
    search.placeholder = 'Название или обозначение';
    search.autocomplete = 'off';
    search.spellcheck = false;
    search.setAttribute('enterkeyhint', 'search');
    search.setAttribute('aria-controls', 'unit-sheet-list');
    searchBox.appendChild(search);

    var status = el('p', 'visually-hidden');
    status.setAttribute('role', 'status');
    var list = el('div', 'unit-sheet__list');
    list.id = 'unit-sheet-list';

    var empty = el('div', 'empty-state unit-sheet__empty');
    empty.hidden = true;
    var emptyTitle = el('p', 'empty-state__title', 'Ничего не найдено');
    var emptyText = el('p', 'unit-sheet__empty-text');
    var clearButton = el('button', 'button button--secondary', 'Очистить поиск');
    clearButton.type = 'button';
    empty.appendChild(emptyTitle);
    empty.appendChild(emptyText);
    empty.appendChild(clearButton);
    list.appendChild(empty);

    panel.appendChild(header);
    panel.appendChild(searchBox);
    panel.appendChild(status);
    panel.appendChild(list);
    dialog.appendChild(backdrop);
    dialog.appendChild(panel);
    document.body.appendChild(dialog);

    var active = null;      // { select, trigger } открытого поля
    var closeTimer = null;
    var pageScroll = 0;

    /* Кнопки-поля создаются на месте select; label их подписывает, select скрывается. */
    var fields = [from, to].map(function (select) {
      var label = select.closest('.field').querySelector('.field__label');
      label.id = 'unit-' + select.name + '-label';
      var trigger = el('button', 'field__control unit-trigger');
      trigger.type = 'button';
      trigger.id = 'unit-' + select.name + '-trigger';
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-labelledby', label.id + ' ' + trigger.id);
      var name = el('span', 'unit-trigger__name');
      var symbol = el('span', 'symbol unit-trigger__symbol');
      trigger.appendChild(name);
      trigger.appendChild(symbol);
      trigger.appendChild(icon('chevron-down', 'unit-trigger__chevron'));
      var field = { select: select, trigger: trigger, name: name, symbol: symbol };
      trigger.addEventListener('click', function () { open(field); });
      select.addEventListener('change', updateTriggers);
      return field;
    });

    function updateTriggers() {
      fields.forEach(function (field) {
        var option = field.select.selectedOptions[0];
        field.name.textContent = option ? optionName(option) : '';
        field.symbol.textContent = option ? option.dataset.symbol : '';
      });
    }

    /* Подключение к label: в мобильном режиме кнопка стоит перед select и становится
       подписанным элементом; на компьютере её нет в DOM, и label снова относится к select. */
    function applyMode() {
      if (!mobile.matches && active) finish();
      fields.forEach(function (field) {
        if (mobile.matches) {
          field.select.parentNode.insertBefore(field.trigger, field.select);
          field.select.hidden = true;
        } else {
          field.trigger.remove();
          field.select.hidden = false;
        }
      });
      updateTriggers();
    }

    function matches(option, query) {
      if (!query) return true;
      var text = normalizeText([optionName(option), option.dataset.symbol, option.dataset.search || '', option.textContent, option.parentNode.label].join(' '));
      return text.indexOf(query) !== -1;
    }

    function optionRow(option, meta) {
      var item = el('li');
      var button = el('button', 'unit-sheet__option');
      button.type = 'button';
      button.dataset.value = option.value;
      var text = el('span', 'unit-sheet__option-text');
      text.appendChild(el('span', 'unit-sheet__option-name', optionName(option)));
      if (meta) text.appendChild(el('span', 'unit-sheet__option-meta', meta));
      button.appendChild(text);
      button.appendChild(el('span', 'symbol', option.dataset.symbol));
      button.appendChild(icon('check', 'unit-sheet__check'));
      if (option.value === active.select.value) button.setAttribute('aria-current', 'true');
      item.appendChild(button);
      return item;
    }

    /* «Из» — все категории с заголовками; «В» — только категория единицы «Из».
       При поиске — плоский список совпадений с названием категории в каждой строке. */
    function render() {
      var query = normalizeText(search.value);
      var category = active.select === to ? from.selectedOptions[0].dataset.category : null;
      var flat = el('ul', 'unit-sheet__options');
      var count = 0;
      Array.prototype.slice.call(list.children).forEach(function (child) {
        if (child !== empty) child.remove();
      });

      Array.prototype.forEach.call(active.select.querySelectorAll('optgroup'), function (group) {
        if (category && group.dataset.category !== category) return;
        var options = Array.prototype.filter.call(group.querySelectorAll('option'), function (option) {
          return matches(option, query);
        });
        if (!options.length) return;
        count += options.length;
        if (query) {
          options.forEach(function (option) { flat.appendChild(optionRow(option, group.label)); });
          return;
        }
        var section = el('section', 'unit-sheet__group');
        var heading = el('h3', 'unit-sheet__group-title', group.label);
        heading.id = 'unit-sheet-group-' + group.dataset.category;
        section.setAttribute('aria-labelledby', heading.id);
        var ul = el('ul', 'unit-sheet__options');
        options.forEach(function (option) { ul.appendChild(optionRow(option)); });
        section.appendChild(heading);
        section.appendChild(ul);
        list.insertBefore(section, empty);
      });
      if (flat.children.length) list.insertBefore(flat, empty);

      empty.hidden = count !== 0;
      emptyText.textContent = 'По запросу «' + search.value.trim() + '» единиц нет. Попробуйте другое название или обозначение.';
      status.textContent = query ? 'Найдено: ' + count + ' ' + plural(count, 'единица', 'единицы', 'единиц') : '';
    }

    function rows() {
      return Array.prototype.slice.call(list.querySelectorAll('.unit-sheet__option'));
    }

    /* Высота панели следует за видимой областью: экранная клавиатура её уменьшает. */
    function fitViewport() {
      var viewport = window.visualViewport;
      if (!viewport) return;
      dialog.style.top = viewport.offsetTop + 'px';
      dialog.style.height = viewport.height + 'px';
      dialog.classList.toggle('unit-sheet--compact', viewport.height < 520);
    }

    function lockPage() {
      pageScroll = window.pageYOffset;
      document.body.style.top = -pageScroll + 'px';
      document.documentElement.classList.add('is-sheet-open');
    }

    function unlockPage() {
      document.documentElement.classList.remove('is-sheet-open');
      document.body.style.top = '';
      window.scrollTo(0, pageScroll);
    }

    function open(field) {
      if (active) return;
      window.clearTimeout(closeTimer);
      active = field;
      title.textContent = titles[field.select.name];
      search.value = '';
      render();
      lockPage();
      fitViewport();
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', fitViewport);
        window.visualViewport.addEventListener('scroll', fitViewport);
      }
      dialog.showModal();
      field.trigger.setAttribute('aria-expanded', 'true');

      /* Фокус — на текущий выбор (без клавиатуры); строка — в середине списка. */
      var current = list.querySelector('[aria-current="true"]') || rows()[0];
      if (current) {
        current.focus({ preventScroll: true });
        list.scrollTop = current.offsetTop - (list.clientHeight - current.offsetHeight) / 2;
      }
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { dialog.classList.add('is-open'); });
      });
    }

    /* value === null — отмена: значение select не меняется. */
    function close(value) {
      if (!active || closeTimer) return;
      if (value !== null && value !== active.select.value) {
        active.select.value = value;
        active.select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      dialog.classList.remove('is-open');
      closeTimer = window.setTimeout(finish, reducedMotion.matches ? 0 : 220);
    }

    function finish() {
      window.clearTimeout(closeTimer);
      closeTimer = null;
      if (!active) return;
      var trigger = active.trigger;
      active = null;
      dialog.classList.remove('is-open');
      if (dialog.open) dialog.close();
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', fitViewport);
        window.visualViewport.removeEventListener('scroll', fitViewport);
      }
      unlockPage();
      trigger.setAttribute('aria-expanded', 'false');
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    }

    list.addEventListener('click', function (event) {
      var row = event.target.closest('.unit-sheet__option');
      if (row) close(row.dataset.value);
    });
    closeButton.addEventListener('click', function () { close(null); });
    backdrop.addEventListener('click', function () { close(null); });
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      close(null);
    });
    /* Браузер может закрыть диалог сам (повторный Escape) — приводим состояние в порядок. */
    dialog.addEventListener('close', function () { if (active) finish(); });
    search.addEventListener('input', function () {
      render();
      list.scrollTop = 0;
    });
    clearButton.addEventListener('click', function () {
      search.value = '';
      render();
      search.focus();
    });

    /* Клавиатура: стрелки между строками, Tab не выходит за пределы панели. */
    dialog.addEventListener('keydown', function (event) {
      var items = rows();
      var index = items.indexOf(document.activeElement);
      var next = null;
      /* Escape закрывает сразу, даже из поля поиска (иначе браузер лишь очищает его). */
      if (event.key === 'Escape') {
        event.preventDefault();
        close(null);
        return;
      }
      if (event.key === 'ArrowDown') {
        next = index === -1 ? (document.activeElement === search ? items[0] : null) : items[index + 1];
      } else if (event.key === 'ArrowUp' && index !== -1) {
        next = index === 0 ? search : items[index - 1];
      } else if ((event.key === 'Home' || event.key === 'End') && index !== -1) {
        next = event.key === 'Home' ? items[0] : items[items.length - 1];
      } else if (event.key === 'Tab') {
        /* Цикл: закрыть → поиск → список (одна позиция, внутри — стрелки) → закрыть. */
        var listStop = index !== -1 ? items[index] : list.querySelector('[aria-current="true"]') || items[0];
        var cycle = [closeButton, search, empty.hidden ? listStop : clearButton];
        var position = index !== -1 ? 2 : cycle.indexOf(document.activeElement);
        next = cycle[(position + (event.shiftKey ? cycle.length - 1 : 1)) % cycle.length];
      }
      if (next) {
        event.preventDefault();
        next.focus();
      }
    });

    if (mobile.addEventListener) mobile.addEventListener('change', applyMode);
    else if (mobile.addListener) mobile.addListener(applyMode);
    window.addEventListener('pageshow', updateTriggers);
    applyMode();
  }

  /* ---------- Главная: карточки категорий ---------- */

  function initCategoryGrid() {
    var grid = document.querySelector('[data-category-grid]');
    if (!grid || !data || grid.children.length) return;
    data.categories.forEach(function (category) {
      var count = unitsOf(category.slug).length;
      var card = el('a', 'category-card');
      card.href = 'catalog.html?category=' + category.slug;
      var iconBox = el('span', 'category-card__icon');
      iconBox.appendChild(icon(category.icon));
      card.appendChild(iconBox);
      card.appendChild(el('span', 'category-card__name', category.name));
      card.appendChild(el('span', 'category-card__count', count + ' ' + plural(count, 'единица', 'единицы', 'единиц')));
      grid.appendChild(card);
    });
  }

  /* ---------- Каталог: поиск и фильтр ---------- */

  function initCatalog() {
    var form = document.querySelector('[data-catalog-filters]');
    if (!form) return;
    var categorySelect = form.elements.category;

    /* PHP-версия: фильтрация выполняется SQL-запросом на сервере. */
    if (!data) {
      if (form.hasAttribute('data-autosubmit')) {
        categorySelect.addEventListener('change', function () { form.submit(); });
      }
      return;
    }

    var rows = document.querySelector('[data-unit-rows]');
    var summary = document.querySelector('[data-catalog-summary]');
    var empty = document.querySelector('[data-empty-state]');
    var search = form.elements.q;

    data.categories.forEach(function (category) {
      var option = el('option', '', category.name);
      option.value = category.slug;
      categorySelect.appendChild(option);
    });

    data.units.forEach(function (unit) {
      var category = findCategory(unit.category);
      var tr = el('tr');
      tr.dataset.category = unit.category;
      tr.dataset.search = normalizeText([unit.name, unit.name_en, unit.symbol, unit.symbol_intl].join(' '));
      var nameCell = el('td');
      var link = el('a', '', unit.name);
      link.href = 'unit.html?id=' + unit.slug;
      nameCell.appendChild(link);
      var symbolCell = el('td');
      symbolCell.appendChild(el('span', 'symbol', unit.symbol));
      tr.appendChild(nameCell);
      tr.appendChild(symbolCell);
      tr.appendChild(el('td', '', category.name));
      tr.appendChild(el('td', 'unit-table__factor', formatNumber(unit.factor)));
      rows.appendChild(tr);
    });

    var query = params();
    search.value = query.get('q') || '';
    if (query.get('category') && findCategory(query.get('category'))) categorySelect.value = query.get('category');

    function apply() {
      var text = normalizeText(search.value);
      var category = categorySelect.value;
      var visible = 0;
      Array.prototype.forEach.call(rows.rows, function (tr) {
        var match = (!category || tr.dataset.category === category) && (!text || tr.dataset.search.indexOf(text) !== -1);
        tr.hidden = !match;
        if (match) visible += 1;
      });
      summary.textContent = 'Найдено: ' + visible + ' ' + plural(visible, 'единица', 'единицы', 'единиц') +
        (category ? ' в категории «' + findCategory(category).name + '»' : '');
      empty.hidden = visible !== 0;
      rows.parentElement.hidden = visible === 0;

      var url = new URL(window.location.href);
      if (text) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
      if (category) url.searchParams.set('category', category); else url.searchParams.delete('category');
      window.history.replaceState(null, '', url);
    }

    search.addEventListener('input', apply);
    categorySelect.addEventListener('change', apply);
    form.addEventListener('submit', function (event) { event.preventDefault(); apply(); });
    document.querySelector('[data-reset-filters]').addEventListener('click', function () {
      search.value = '';
      categorySelect.value = '';
      apply();
      search.focus();
    });
    apply();
  }

  /* ---------- Карточка единицы ---------- */

  function initUnitPage() {
    var card = document.querySelector('[data-unit-detail]');
    if (!card || !data) return;
    var unit = findUnit(params().get('id') || 'metre');
    if (!unit) {
      document.querySelector('[data-unit-missing]').hidden = false;
      document.title = 'Единица не найдена — Мера';
      return;
    }
    var category = findCategory(unit.category);
    var base = findUnit(category.base);
    document.title = unit.name + ' — Мера';
    card.querySelector('[data-unit-name]').textContent = unit.name;
    card.querySelector('[data-unit-symbol]').textContent = 'Обозначение: ' + unit.symbol;
    var categoryLink = card.querySelector('[data-unit-category]');
    categoryLink.textContent = 'Категория: ' + category.name;
    categoryLink.href = 'catalog.html?category=' + category.slug;
    card.querySelector('[data-unit-description]').textContent = unit.description;
    card.querySelector('[data-unit-intl]').textContent = unit.symbol_intl + ' (' + unit.name_en + ')';
    card.querySelector('[data-unit-dimension]').textContent = category.dimension;
    card.querySelector('[data-unit-base-formula]').textContent =
      unit.slug === base.slug ? 'Базовая единица категории' : relationText(unit, base);

    var list = card.querySelector('[data-unit-relations]');
    unitsOf(category.slug).forEach(function (other) {
      if (other.slug === unit.slug) return;
      list.appendChild(el('li', '', relationText(unit, other)));
    });

    var target = unit.slug === base.slug ? unitsOf(category.slug)[1] : base;
    card.querySelector('[data-unit-convert]').href =
      'index.html?value=1&from=' + unit.slug + '&to=' + target.slug;
    card.hidden = false;
  }

  initMenu();
  initCategoryGrid();
  initConverter();
  initCatalog();
  initUnitPage();
})();
