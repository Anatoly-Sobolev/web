<?php

declare(strict_types=1);

// Проверка серверного окружения: NGINX → PHP (FastCGI) → PostgreSQL.
require dirname(__DIR__) . '/src/bootstrap.php';

$checks = [
    'Веб-сервер' => $_SERVER['SERVER_SOFTWARE'] ?? 'неизвестно',
    'Виртуальный хост' => ($_SERVER['SERVER_NAME'] ?? '') . ':' . ($_SERVER['SERVER_PORT'] ?? ''),
    'Версия PHP' => PHP_VERSION,
    'Интерфейс PHP (SAPI)' => PHP_SAPI,
    'Драйверы PDO' => implode(', ', PDO::getAvailableDrivers()),
    'Файл скрипта' => $_SERVER['SCRIPT_FILENAME'] ?? __FILE__,
];

$demoSql = "SELECT c.name AS category, COUNT(u.id) AS units, MIN(u.name) FILTER (WHERE u.is_base) AS base_unit
FROM categories c
LEFT JOIN units u ON u.category_id = c.id
GROUP BY c.id
ORDER BY c.sort_order";

$db = null;
$rows = [];
$dbError = null;
try {
    $pdo = Database::connect($config['db']);
    $db = (new UnitRepository($pdo))->serverInfo();
    $rows = $pdo->query($demoSql)->fetchAll();
} catch (PDOException $error) {
    error_log('[Мера] status.php: ' . $error->getMessage());
    $dbError = $config['debug'] ? $error->getMessage() : 'Не удалось подключиться к PostgreSQL.';
}

render('layout-start', ['title' => 'Состояние сервера', 'active' => '']);
?>
    <section class="intro">
      <h1>Состояние сервера</h1>
      <p>Страница выполняется PHP через NGINX и проверяет подключение приложения к базе данных.</p>
    </section>

    <section class="detail-card">
      <h2>Окружение</h2>
      <dl class="facts facts--wide">
        <?php foreach ($checks as $label => $value): ?>
          <div><dt><?= e($label) ?></dt><dd><?= e($value) ?></dd></div>
        <?php endforeach; ?>
      </dl>

      <section>
        <h2>База данных</h2>
        <?php if ($db !== null): ?>
          <dl class="facts facts--wide">
            <div><dt>Подключение</dt><dd class="status-ok">установлено</dd></div>
            <div><dt>СУБД</dt><dd><?= e($db['version']) ?></dd></div>
            <div><dt>База / пользователь</dt><dd><?= e($db['database'] . ' / ' . $db['user']) ?></dd></div>
            <div><dt>Порт / кодировка</dt><dd><?= e($db['port'] . ' / ' . $db['encoding']) ?></dd></div>
            <div><dt>Время сервера БД</dt><dd><?= e($db['now']) ?></dd></div>
          </dl>
        <?php else: ?>
          <p class="message message--error"><?= e($dbError) ?></p>
        <?php endif; ?>
      </section>

      <?php if ($db !== null): ?>
        <section>
          <h2>Пример запроса</h2>
          <pre class="code"><?= e($demoSql) ?></pre>
          <table class="unit-table unit-table--plain">
            <thead><tr><th>category</th><th>units</th><th>base_unit</th></tr></thead>
            <tbody>
              <?php foreach ($rows as $row): ?>
                <tr><td><?= e($row['category']) ?></td><td><?= e($row['units']) ?></td><td><?= e($row['base_unit'] ?? '—') ?></td></tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </section>
      <?php endif; ?>
    </section>
<?php render('layout-end'); ?>
