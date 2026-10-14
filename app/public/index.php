<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';

$repository = repository($config);

try {
    $categories = $repository->categoriesWithCounts();
    $units = $repository->allUnits();
} catch (PDOException $error) {
    render_database_error($error, $config);
}

$bySlug = array_column($units, null, 'slug');
$byCategory = [];
foreach ($units as $unit) {
    $byCategory[$unit['category_slug']][] = $unit;
}

// Конвертация на сервере по коэффициентам из БД (работает и без JavaScript).
$input = [
    'value' => (string) ($_GET['value'] ?? '100'),
    'from' => (string) ($_GET['from'] ?? 'metre'),
    'to' => (string) ($_GET['to'] ?? 'centimetre'),
];
$result = null;
$error = null;
if ($units === []) {
    $error = 'Справочник пуст: в базе данных нет единиц измерения.';
} elseif (!isset($bySlug[$input['from']], $bySlug[$input['to']])) {
    $error = 'Выбрана неизвестная единица измерения.';
} elseif (trim($input['value']) === '') {
    $error = 'Введите значение для конвертации.';
} elseif (($value = parse_number($input['value'])) === null) {
    $error = 'Значение должно быть числом, например 12,5 или -40.';
} else {
    $from = $bySlug[$input['from']];
    $to = $bySlug[$input['to']];
    if ($from['category_slug'] !== $to['category_slug']) {
        $error = 'Единицы должны относиться к одной категории.';
    } elseif ($from['category_slug'] === 'temperature' && $value * $from['factor'] + $from['offset_si'] < 0) {
        $error = 'Температура не может быть ниже абсолютного нуля (0 К).';
    } else {
        $result = [
            'text' => format_number($value) . ' ' . $from['symbol'] . ' = '
                . format_number(convert_value($value, $from, $to)) . ' ' . $to['symbol'],
            'formula' => relation_text($from, $to),
        ];
    }
}

$selectOptions = static function (string $selected) use ($categories, $byCategory): void {
    foreach ($categories as $category) {
        if (empty($byCategory[$category['slug']])) {
            continue;
        }
        echo '<optgroup label="' . e($category['name']) . '" data-category="' . e($category['slug']) . '">';
        foreach ($byCategory[$category['slug']] as $unit) {
            printf(
                '<option value="%s" data-factor="%s" data-offset="%s" data-symbol="%s" data-category="%s"%s>%s (%s)</option>',
                e($unit['slug']), e($unit['factor']), e($unit['offset_si']), e($unit['symbol']),
                e($unit['category_slug']), $unit['slug'] === $selected ? ' selected' : '',
                e($unit['name']), e($unit['symbol'])
            );
        }
        echo '</optgroup>';
    }
};

render('layout-start', ['title' => 'Конвертер единиц', 'active' => 'home']);
?>
    <section class="intro">
      <h1>Конвертер единиц измерения</h1>
      <p>Простой и быстрый инструмент для точного перевода величин</p>
    </section>

    <section class="panel" aria-labelledby="converter-title">
      <h2 id="converter-title" class="visually-hidden">Конвертер</h2>
      <form class="converter" method="get" action="/" data-converter novalidate>
        <label class="field">
          <span class="field__label">Значение</span>
          <input class="field__control" type="text" name="value" inputmode="decimal" value="<?= e($input['value']) ?>" autocomplete="off" aria-describedby="converter-error"<?= $error !== null && $units !== [] ? ' aria-invalid="true"' : '' ?>>
        </label>
        <label class="field">
          <span class="field__label">Из</span>
          <select class="field__control" name="from" data-unit-select><?php $selectOptions($input['from']); ?></select>
        </label>
        <label class="field">
          <span class="field__label">В</span>
          <select class="field__control" name="to" data-unit-select><?php $selectOptions($input['to']); ?></select>
        </label>
        <button class="button" type="submit">Конвертировать</button>
      </form>
      <div class="result" data-result role="status" aria-live="polite"<?= $result === null ? ' hidden' : '' ?>>
        <span class="result__label">Результат конвертации</span>
        <strong class="result__value" data-result-value><?= e($result['text'] ?? '') ?></strong>
        <span class="result__formula" data-result-formula><?= $result ? 'Формула: ' . e($result['formula']) : '' ?></span>
      </div>
      <p class="message message--error" id="converter-error" data-error role="alert"<?= $error === null ? ' hidden' : '' ?>><?= e($error ?? '') ?></p>
    </section>

    <section class="categories" aria-labelledby="categories-title">
      <h2 id="categories-title">Категории</h2>
      <?php if ($categories === []): ?>
        <div class="empty-state empty-state--page">
          <p class="empty-state__title">Категории не найдены</p>
          <p>В базе данных пока нет ни одной категории единиц.</p>
        </div>
      <?php else: ?>
        <div class="category-grid">
          <?php foreach ($categories as $category): $count = (int) $category['unit_count']; ?>
            <a class="category-card" href="/catalog.php?category=<?= e($category['slug']) ?>">
              <span class="category-card__icon"><svg class="icon" aria-hidden="true"><use href="/img/icons.svg#<?= e($category['icon']) ?>"></use></svg></span>
              <span class="category-card__name"><?= e($category['name']) ?></span>
              <span class="category-card__count"><?= $count ?> <?= plural($count, 'единица', 'единицы', 'единиц') ?></span>
            </a>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </section>

    <section class="about" id="about" aria-labelledby="about-title">
      <h2 id="about-title">О проекте</h2>
      <p>«Мера» — учебный справочник единиц измерения: конвертер величин, каталог единиц по категориям, поиск по названию и обозначению, коэффициенты и формулы пересчёта в базовую единицу СИ.</p>
    </section>
<?php render('layout-end'); ?>
