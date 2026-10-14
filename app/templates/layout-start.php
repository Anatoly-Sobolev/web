<?php
/** @var string $title */
/** @var string $active  home | catalog | '' */
$links = [
    'home' => ['/', 'Главная'],
    'catalog' => ['/catalog.php', 'Каталог'],
    'about' => ['/#about', 'О проекте'],
];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($title) ?> — Мера</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="header">
    <div class="container header__content">
      <a class="logo" href="/"><svg class="icon" aria-hidden="true"><use href="/img/icons.svg#ruler"></use></svg>Мера</a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Открыть меню">
        <span></span><span></span><span></span>
      </button>
      <nav class="navigation" id="main-nav" aria-label="Основная навигация">
        <?php foreach ($links as $key => [$href, $label]): ?>
          <a href="<?= e($href) ?>"<?= $key === $active ? ' aria-current="page"' : '' ?>><?= e($label) ?></a>
        <?php endforeach; ?>
      </nav>
    </div>
  </header>

  <main class="container main">
