<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';

$repository = repository($config);
$query = trim((string) ($_GET['q'] ?? ''));
$category = (string) ($_GET['category'] ?? '');

try {
    $categories = $repository->categoriesWithCounts();
    if ($category !== '' && !$repository->categoryExists($category)) {
        $category = '';
    }
    $units = $repository->search($query, $category);
} catch (PDOException $error) {
    render_database_error($error, $config);
}

$categoryNames = array_column($categories, 'name', 'slug');
$found = count($units);

render('layout-start', ['title' => 'Каталог единиц', 'active' => 'catalog']);
?>
    <section class="intro">
      <h1>Каталог единиц</h1>
      <p>Найдите нужную единицу измерения по названию, обозначению или категории.</p>
    </section>

    <form class="filters filters--server" method="get" action="/catalog.php" role="search" data-catalog-filters data-autosubmit>
      <label class="field">
        <span class="field__label">Поиск по названию или обозначению</span>
        <span class="search">
          <svg class="icon search__icon" aria-hidden="true"><use href="/img/icons.svg#search"></use></svg>
          <input class="field__control" type="search" name="q" value="<?= e($query) ?>" placeholder="Введите запрос, например, метр…" autocomplete="off">
        </span>
      </label>
      <label class="field">
        <span class="field__label">Категория</span>
        <select class="field__control" name="category">
          <option value="">Все категории</option>
          <?php foreach ($categories as $item): ?>
            <option value="<?= e($item['slug']) ?>"<?= $item['slug'] === $category ? ' selected' : '' ?>><?= e($item['name']) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
      <button class="button" type="submit">Найти</button>
    </form>

    <p class="catalog-summary" aria-live="polite">
      Найдено: <?= $found ?> <?= plural($found, 'единица', 'единицы', 'единиц') ?><?= $category !== '' ? ' в категории «' . e($categoryNames[$category]) . '»' : '' ?><?= $query !== '' ? ' по запросу «' . e($query) . '»' : '' ?>
    </p>

    <section class="table-card" aria-label="Единицы измерения">
      <?php if ($found > 0): ?>
        <table class="unit-table">
          <thead>
            <tr><th scope="col">Название</th><th scope="col">Обозначение</th><th scope="col">Категория</th><th scope="col">Коэффициент к СИ</th></tr>
          </thead>
          <tbody>
            <?php foreach ($units as $unit): ?>
              <tr>
                <td><a href="/unit.php?id=<?= e($unit['slug']) ?>"><?= e($unit['name']) ?></a></td>
                <td><span class="symbol"><?= e($unit['symbol']) ?></span></td>
                <td><?= e($unit['category_name']) ?></td>
                <td class="unit-table__factor"><?= e(format_number($unit['factor'])) ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php else: ?>
        <div class="empty-state">
          <svg class="icon empty-state__icon" aria-hidden="true"><use href="/img/icons.svg#search"></use></svg>
          <?php if ($query === '' && $category === ''): ?>
            <p class="empty-state__title">Справочник пуст</p>
            <p>В базе данных пока нет ни одной единицы измерения.</p>
          <?php elseif ($query === ''): ?>
            <p class="empty-state__title">В категории нет единиц</p>
            <p>Для категории «<?= e($categoryNames[$category]) ?>» единицы ещё не добавлены.</p>
            <a class="button button--secondary" href="/catalog.php">Показать все единицы</a>
          <?php else: ?>
            <p class="empty-state__title">Ничего не найдено</p>
            <p>Измените запрос или выберите другую категорию.</p>
            <a class="button button--secondary" href="/catalog.php">Сбросить фильтры</a>
          <?php endif; ?>
        </div>
      <?php endif; ?>
    </section>
<?php render('layout-end'); ?>
