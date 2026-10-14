<?php

declare(strict_types=1);

/** Экранирование вывода в HTML. */
function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Число в русской записи; совпадает с formatNumber() из site/js/app.js. */
function format_number(float $value): string
{
    if (!is_finite($value)) {
        return '—';
    }
    $abs = abs($value);
    if ($abs != 0.0 && ($abs < 1e-6 || $abs >= 1e15)) {
        [$mantissa, $exponent] = explode('e', sprintf('%.6e', $value));
        $mantissa = rtrim(rtrim($mantissa, '0'), '.');

        return str_replace('.', ',', $mantissa) . ' × 10' . superscript((int) $exponent);
    }
    $rounded = (float) sprintf('%.12g', $value);
    $integerDigits = $abs >= 1 ? (int) floor(log10($abs)) + 1 : 0;
    $text = number_format($rounded, min(10, max(0, 12 - $integerDigits)), ',', "\u{00A0}");
    if (!str_contains($text, ',')) {
        return $text;
    }

    return rtrim(rtrim($text, '0'), ',');
}

function superscript(int $number): string
{
    return strtr((string) $number, ['-' => '⁻', '0' => '⁰', '1' => '¹', '2' => '²', '3' => '³',
        '4' => '⁴', '5' => '⁵', '6' => '⁶', '7' => '⁷', '8' => '⁸', '9' => '⁹']);
}

/** Разбор числа, введённого пользователем: допускаются запятая, пробелы и экспонента. */
function parse_number(string $text): ?float
{
    $normalized = str_replace([' ', "\u{00A0}", ',', '−'], ['', '', '.', '-'], trim($text));
    if (!preg_match('/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i', $normalized)) {
        return null;
    }

    return (float) $normalized;
}

function plural(int $n, string $one, string $few, string $many): string
{
    $mod10 = $n % 10;
    $mod100 = $n % 100;
    if ($mod10 === 1 && $mod100 !== 11) {
        return $one;
    }
    if ($mod10 >= 2 && $mod10 <= 4 && ($mod100 < 12 || $mod100 > 14)) {
        return $few;
    }

    return $many;
}

/** Перевод значения: x_SI = x · factor + offset; x_B = (x_SI − offset_B) / factor_B. */
function convert_value(float $value, array $from, array $to): float
{
    return ($value * $from['factor'] + $from['offset_si'] - $to['offset_si']) / $to['factor'];
}

/** Формула пересчёта from → to: «1 км = 1000 м» или «T(°F) = T(°C) × 1,8 + 32». */
function relation_text(array $from, array $to): string
{
    $k = $from['factor'] / $to['factor'];
    $b = ($from['offset_si'] - $to['offset_si']) / $to['factor'];
    if (abs($b) < 1e-12) {
        return '1 ' . $from['symbol'] . ' = ' . format_number($k) . ' ' . $to['symbol'];
    }
    $text = 'T(' . $to['symbol'] . ') = T(' . $from['symbol'] . ')';
    if (abs($k - 1) > 1e-12) {
        $text .= ' × ' . format_number($k);
    }

    return $text . ($b < 0 ? ' − ' : ' + ') . format_number(abs($b));
}

function render(string $template, array $data = []): void
{
    extract($data, EXTR_SKIP);
    require dirname(__DIR__) . '/templates/' . $template . '.php';
}

/** Страница «База данных недоступна» с кодом 503; подробности пишутся в журнал ошибок. */
function render_database_error(Throwable $error, array $config): never
{
    error_log('[Мера] Ошибка базы данных: ' . $error->getMessage());
    http_response_code(503);
    render('layout-start', ['title' => 'База данных недоступна', 'active' => '']);
    render('database-error', ['details' => $config['debug'] ? $error->getMessage() : null]);
    render('layout-end');
    exit;
}
