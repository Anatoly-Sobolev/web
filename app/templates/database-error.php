<?php /** @var string|null $details */ ?>
<div class="empty-state empty-state--page empty-state--error" role="alert">
  <p class="empty-state__title">База данных недоступна</p>
  <p>Не удалось подключиться к серверу PostgreSQL. Данные справочника временно не отображаются.</p>
  <p>Повторите попытку позже. Если ошибка сохраняется, проверьте, что сервер БД запущен.</p>
  <?php if ($details !== null): ?>
    <p><code><?= e($details) ?></code></p>
  <?php endif; ?>
  <a class="button button--secondary" href="<?= e($_SERVER['REQUEST_URI'] ?? '/') ?>">Повторить</a>
</div>
