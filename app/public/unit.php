<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';

$repository = repository($config);
$slug = (string) ($_GET['id'] ?? '');

try {
    $unit = $slug === '' ? null : $repository->findUnit($slug);
    $related = $unit ? $repository->unitsInCategory($unit['category_slug']) : [];
} catch (PDOException $error) {
    render_database_error($error, $config);
}

if ($unit === null) {
    http_response_code(404);
    render('layout-start', ['title' => 'Единица не найдена', 'active' => 'catalog']);
    ?>
    <a class="back-link" href="/catalog.php">← Назад к каталогу</a>
    <div class="empty-state empty-state--page">
      <p class="empty-state__title">Единица не найдена</p>
      <p>Проверьте ссылку или выберите единицу в каталоге.</p>
      <a class="button button--secondary" href="/catalog.php">Перейти в каталог</a>
    </div>
    <?php
    render('layout-end');
    exit;
}

$base = null;
foreach ($related as $item) {
    if ($item['is_base']) {
        $base = $item;
    }
}
$target = ($base === null || $base['slug'] === $unit['slug'])
    ? (array_values(array_filter($related, fn ($item) => $item['slug'] !== $unit['slug']))[0] ?? $unit)
    : $base;

render('layout-start', ['title' => $unit['name'], 'active' => 'catalog']);
?>
    <a class="back-link" href="/catalog.php">← Назад к каталогу</a>

    <article class="detail-card">
      <div class="detail-card__title">
        <h1><?= e($unit['name']) ?></h1>
        <div class="badges">
          <span class="badge">Обозначение: <?= e($unit['symbol']) ?></span>
          <a class="badge badge--accent" href="/catalog.php?category=<?= e($unit['category_slug']) ?>">Категория: <?= e($unit['category_name']) ?></a>
        </div>
      </div>
      <section>
        <h2>Описание</h2>
        <p><?= e($unit['description'] !== '' ? $unit['description'] : 'Описание пока не добавлено.') ?></p>
      </section>
      <section>
        <h2>Характеристики</h2>
        <dl class="facts">
          <div><dt>Международное обозначение</dt><dd><?= e($unit['symbol_intl'] . ' (' . $unit['name_en'] . ')') ?></dd></div>
          <div><dt>Размерность</dt><dd><?= e($unit['dimension']) ?></dd></div>
          <div><dt>Пересчёт в базовую единицу СИ</dt><dd><?= e($base === null ? 'Базовая единица не задана' : ($base['slug'] === $unit['slug'] ? 'Базовая единица категории' : relation_text($unit, $base))) ?></dd></div>
        </dl>
      </section>
      <section class="relations">
        <h2 class="relations__title">Соотношение с другими единицами</h2>
        <?php if (count($related) > 1): ?>
          <ul class="relations__list">
            <?php foreach ($related as $other): if ($other['slug'] === $unit['slug']) continue; ?>
              <li><?= e(relation_text($unit, $other)) ?></li>
            <?php endforeach; ?>
          </ul>
        <?php else: ?>
          <p>В категории пока нет других единиц.</p>
        <?php endif; ?>
      </section>
      <a class="button button--secondary" href="/?value=1&amp;from=<?= e($unit['slug']) ?>&amp;to=<?= e($target['slug']) ?>">Открыть в конвертере</a>
    </article>
<?php render('layout-end'); ?>
