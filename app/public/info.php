<?php

declare(strict_types=1);

// Полные сведения о конфигурации PHP. Доступны только с локального компьютера.
$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($remote, ['127.0.0.1', '::1'], true)) {
    http_response_code(403);
    exit('Доступ запрещён');
}

phpinfo(INFO_GENERAL | INFO_CONFIGURATION | INFO_MODULES);
