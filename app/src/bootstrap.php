<?php

declare(strict_types=1);

mb_internal_encoding('UTF-8');
header('Content-Type: text/html; charset=UTF-8');

require __DIR__ . '/helpers.php';
require __DIR__ . '/Database.php';
require __DIR__ . '/UnitRepository.php';

$config = require dirname(__DIR__) . '/config/config.php';

/** Подключение к БД; при ошибке подключения выводится страница 503. */
function repository(array $config): UnitRepository
{
    try {
        return new UnitRepository(Database::connect($config['db']));
    } catch (PDOException $error) {
        render_database_error($error, $config);
    }
}
