<?php
// Скопируйте файл в config/local.php и укажите пароль пользователя БД.
// server/setup-db.ps1 создаёт local.php автоматически.

return [
    'db' => [
        'password' => 'пароль_пользователя_mera_app',
    ],
    'debug' => false,
];
