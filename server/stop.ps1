# Остановка окружения «Мера».
$ErrorActionPreference = 'Stop'
$Server = $PSScriptRoot
$Root = Split-Path -Parent $Server
$PgBin = if ($env:PG_BIN) { $env:PG_BIN } else { 'C:\Program Files\PostgreSQL\18\bin' }
$PgData = Join-Path $Root '.local\pgdata'
$PgPort = 5433
$PhpDir = Join-Path $Server 'bin\php'
$NginxExe = Join-Path $Server 'bin\nginx\nginx.exe'
$Prefix = ($Server -replace '\\', '/') + '/'

if (Get-Process nginx -ErrorAction SilentlyContinue) {
    & $NginxExe -p $Prefix -c nginx/nginx.conf -s quit
    Start-Sleep -Seconds 1
    Get-Process nginx -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $NginxExe } | Stop-Process -Force
}
Get-Process php-cgi -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "$PhpDir*" } | Stop-Process
& "$PgBin\pg_ctl.exe" -D $PgData status *> $null
if ($LASTEXITCODE -eq 0) {
    & "$PgBin\pg_ctl.exe" -D $PgData -m fast stop
}
Write-Host 'Окружение остановлено.'
