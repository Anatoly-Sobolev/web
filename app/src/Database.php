<?php

declare(strict_types=1);

/** Создание PDO-подключения к PostgreSQL. */
final class Database
{
    public static function connect(array $db): PDO
    {
        $dsn = sprintf('pgsql:host=%s;port=%d;dbname=%s', $db['host'], (int) $db['port'], $db['name']);

        return new PDO($dsn, $db['user'], $db['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 3,
        ]);
    }
}
