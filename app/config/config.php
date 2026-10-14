<?php
// Настройки приложения «Мера».
// Пароль БД и локальные переопределения задаются в config/local.php (файл не хранится в Git,
// образец — local.example.php) или переменными окружения DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD.

$config = [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 5433,
        'name' => 'mera',
        'user' => 'mera_app',
        'password' => '',
    ],
    // true — показывать технические подробности ошибок БД на странице (только для отладки)
    'debug' => false,
];

$local = __DIR__ . '/local.php';
if (is_file($local)) {
    $config = array_replace_recursive($config, require $local);
}

$env = ['host' => 'DB_HOST', 'port' => 'DB_PORT', 'name' => 'DB_NAME', 'user' => 'DB_USER', 'password' => 'DB_PASSWORD'];
foreach ($env as $key => $name) {
    $value = getenv($name);
    if ($value !== false && $value !== '') {
        $config['db'][$key] = $value;
    }
}

return $config;
