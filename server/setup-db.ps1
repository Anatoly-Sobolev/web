# Подготовка базы данных проекта «Мера» (ЛР4–ЛР5).
# 1) создаёт отдельный кластер PostgreSQL 18 в .local\pgdata (порт 5433), если его ещё нет;
# 2) создаёт пользователя mera_app и базу mera;
# 3) выполняет database\schema.sql и database\seed.sql;
# 4) записывает пароль пользователя приложения в app\config\local.php.
# Запуск: powershell -ExecutionPolicy Bypass -File server\setup-db.ps1
$ErrorActionPreference = 'Stop'
$Server = $PSScriptRoot
$Root = Split-Path -Parent $Server
$PgBin = if ($env:PG_BIN) { $env:PG_BIN } else { 'C:\Program Files\PostgreSQL\18\bin' }
$PgData = Join-Path $Root '.local\pgdata'
$PgPort = 5433
$PhpDir = Join-Path $Server 'bin\php'
$NginxExe = Join-Path $Server 'bin\nginx\nginx.exe'
$Prefix = ($Server -replace '\\', '/') + '/'

$LocalDir = Join-Path $Root '.local'
$PwFile = Join-Path $LocalDir 'pg_superuser_pw.txt'
New-Item -ItemType Directory -Force $LocalDir | Out-Null

function New-Password { -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ }) }

if (-not (Test-Path (Join-Path $PgData 'PG_VERSION'))) {
    Write-Host 'Инициализация кластера PostgreSQL...'
    Set-Content -Path $PwFile -Value (New-Password) -NoNewline -Encoding ascii
    & "$PgBin\initdb.exe" -D $PgData -U postgres --pwfile=$PwFile --auth=scram-sha-256 --encoding=UTF8 `
        --locale-provider=icu --icu-locale=ru-RU --locale=C
    if ($LASTEXITCODE -ne 0) { throw 'initdb завершился с ошибкой' }
    Add-Content -Path (Join-Path $PgData 'postgresql.conf') -Encoding ascii -Value @(
        '', "port = $PgPort", "listen_addresses = 'localhost'", "lc_messages = 'C'")
}

& "$PgBin\pg_ctl.exe" -D $PgData status *> $null
if ($LASTEXITCODE -ne 0) {
    $pg = Start-Process -FilePath "$PgBin\pg_ctl.exe" -WindowStyle Hidden -PassThru `
        -ArgumentList @('-D', "`"$PgData`"", '-l', "`"$LocalDir\postgres.log`"", '-w', 'start')
    $pg.WaitForExit()
}

$env:PGPASSWORD = (Get-Content $PwFile -Raw).Trim()
$env:PGCLIENTENCODING = 'UTF8'
$psql = "$PgBin\psql.exe"
$admin = @('-h', 'localhost', '-p', $PgPort, '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-q')

$appPassword = New-Password
& $psql @admin -d postgres -c 'DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = ''mera_app'') THEN CREATE ROLE mera_app LOGIN; END IF; END $$;'
& $psql @admin -d postgres -c "ALTER ROLE mera_app PASSWORD '$appPassword';"
$exists = & $psql @admin -d postgres -tA -c "SELECT 1 FROM pg_database WHERE datname = 'mera'"
if ($exists -ne '1') {
    & $psql @admin -d postgres -c "CREATE DATABASE mera OWNER mera_app ENCODING 'UTF8';"
}

$env:PGPASSWORD = $appPassword
$app = @('-h', 'localhost', '-p', $PgPort, '-U', 'mera_app', '-d', 'mera', '-v', 'ON_ERROR_STOP=1', '-q')
& $psql @app -f (Join-Path $Root 'database\schema.sql')
if ($LASTEXITCODE -ne 0) { throw 'Ошибка выполнения schema.sql' }
& $psql @app -f (Join-Path $Root 'database\seed.sql')
if ($LASTEXITCODE -ne 0) { throw 'Ошибка выполнения seed.sql' }

$local = "<?php`n// Создано server/setup-db.ps1. Не добавлять в Git.`nreturn ['db' => ['password' => '$appPassword']];`n"
[IO.File]::WriteAllText((Join-Path $Root 'app\config\local.php'), $local, (New-Object Text.UTF8Encoding $false))

& $psql @app -c 'SELECT c.name AS category, COUNT(u.id) AS units FROM categories c LEFT JOIN units u ON u.category_id = c.id GROUP BY c.id ORDER BY c.sort_order;'
Write-Host 'База данных mera готова.'
