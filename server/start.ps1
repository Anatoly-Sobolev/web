# Запуск окружения «Мера»: PostgreSQL 18 (5433), PHP FastCGI (127.0.0.1:9000), NGINX (8080).
# Запуск: powershell -ExecutionPolicy Bypass -File server\start.ps1
$ErrorActionPreference = 'Stop'
$Server = $PSScriptRoot
$Root = Split-Path -Parent $Server
$PgBin = if ($env:PG_BIN) { $env:PG_BIN } else { 'C:\Program Files\PostgreSQL\18\bin' }
$PgData = Join-Path $Root '.local\pgdata'
$PgPort = 5433
$PhpDir = Join-Path $Server 'bin\php'
$NginxExe = Join-Path $Server 'bin\nginx\nginx.exe'
$Prefix = ($Server -replace '\\', '/') + '/'

New-Item -ItemType Directory -Force (Join-Path $Server 'logs'), (Join-Path $Server 'temp') | Out-Null

function Test-Port([int]$Port) {
    [bool](Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
}

# 1. PostgreSQL
if (-not (Test-Port $PgPort)) {
    $pg = Start-Process -FilePath "$PgBin\pg_ctl.exe" -WindowStyle Hidden -PassThru `
        -ArgumentList @('-D', "`"$PgData`"", '-l', "`"$Root\.local\postgres.log`"", '-w', 'start')
    $pg.WaitForExit()
}

# 2. PHP: php-cgi в режиме FastCGI-сервера (аналог пула PHP-FPM для Windows).
if (-not (Test-Port 9000)) {
    $env:PHP_FCGI_MAX_REQUESTS = '0'
    Start-Process -FilePath "$PhpDir\php-cgi.exe" -WorkingDirectory $Server -WindowStyle Hidden `
        -ArgumentList @('-b', '127.0.0.1:9000', '-c', "`"$Server\php\php.ini`"", '-d', "extension_dir=`"$PhpDir\ext`"")
}

# 3. NGINX: корень виртуального хоста с абсолютным путём к app/public.
$Generated = Join-Path $Server 'nginx\generated'
New-Item -ItemType Directory -Force $Generated | Out-Null
$AppRoot = (Join-Path $Root 'app\public').Replace([string][char]92, '/')
[IO.File]::WriteAllText((Join-Path $Generated 'app-root.conf'), "root `"$AppRoot`";`n", (New-Object Text.UTF8Encoding $false))
& $NginxExe -p $Prefix -c nginx/nginx.conf -t
if ($LASTEXITCODE -ne 0) { throw 'Ошибка в конфигурации NGINX' }
if (-not (Test-Port 8080)) {
    Start-Process -FilePath $NginxExe -WorkingDirectory $Server -WindowStyle Hidden `
        -ArgumentList @('-p', $Prefix, '-c', 'nginx/nginx.conf')
}

Start-Sleep -Seconds 2
foreach ($port in @($PgPort, 9000, 8080)) {
    Write-Host ("Порт {0}: {1}" -f $port, $(if (Test-Port $port) { 'слушает' } else { 'НЕ слушает' }))
}
Write-Host 'Сайт: http://mera.localhost:8080/   Проверка: http://mera.localhost:8080/status.php'
