<?php

declare(strict_types=1);

/** SQL-запросы к таблицам categories и units. */
final class UnitRepository
{
    private const UNIT_COLUMNS = 'u.id, u.slug, u.name, u.name_en, u.symbol, u.symbol_intl,
        u.factor::float8 AS factor, u.offset_si::float8 AS offset_si, u.description, u.is_base,
        c.slug AS category_slug, c.name AS category_name, c.dimension';

    public function __construct(private PDO $pdo)
    {
    }

    /** Категории с количеством единиц (в том числе категории без единиц). */
    public function categoriesWithCounts(): array
    {
        $sql = 'SELECT c.slug, c.name, c.icon, COUNT(u.id) AS unit_count
                FROM categories c
                LEFT JOIN units u ON u.category_id = c.id
                GROUP BY c.id
                ORDER BY c.sort_order, c.name';

        return $this->pdo->query($sql)->fetchAll();
    }

    /** Все единицы, сгруппированные по категориям, — для списков конвертера. */
    public function allUnits(): array
    {
        $sql = 'SELECT ' . self::UNIT_COLUMNS . '
                FROM units u
                JOIN categories c ON c.id = u.category_id
                ORDER BY c.sort_order, u.sort_order, u.name';

        return $this->pdo->query($sql)->fetchAll();
    }

    /** Поиск по названию и обозначениям с необязательным фильтром по категории. */
    public function search(string $query, string $categorySlug): array
    {
        $sql = 'SELECT ' . self::UNIT_COLUMNS . '
                FROM units u
                JOIN categories c ON c.id = u.category_id
                WHERE (:category = \'\' OR c.slug = :category_slug)
                  AND (:query = \'\'
                       OR translate(lower(u.name), \'ё\', \'е\') LIKE :pattern_name
                       OR lower(u.name_en) LIKE :pattern_en
                       OR lower(u.symbol) LIKE :pattern_symbol
                       OR lower(u.symbol_intl) LIKE :pattern_intl)
                ORDER BY c.sort_order, u.sort_order, u.name';

        $normalized = str_replace('ё', 'е', mb_strtolower(trim($query)));
        $pattern = '%' . addcslashes($normalized, '%_\\') . '%';
        $statement = $this->pdo->prepare($sql);
        $statement->execute([
            'category' => $categorySlug,
            'category_slug' => $categorySlug,
            'query' => $normalized,
            'pattern_name' => $pattern,
            'pattern_en' => $pattern,
            'pattern_symbol' => $pattern,
            'pattern_intl' => $pattern,
        ]);

        return $statement->fetchAll();
    }

    public function findUnit(string $slug): ?array
    {
        $statement = $this->pdo->prepare('SELECT ' . self::UNIT_COLUMNS . '
            FROM units u
            JOIN categories c ON c.id = u.category_id
            WHERE u.slug = :slug');
        $statement->execute(['slug' => $slug]);
        $unit = $statement->fetch();

        return $unit === false ? null : $unit;
    }

    public function unitsInCategory(string $categorySlug): array
    {
        $statement = $this->pdo->prepare('SELECT ' . self::UNIT_COLUMNS . '
            FROM units u
            JOIN categories c ON c.id = u.category_id
            WHERE c.slug = :slug
            ORDER BY u.sort_order, u.name');
        $statement->execute(['slug' => $categorySlug]);

        return $statement->fetchAll();
    }

    public function categoryExists(string $slug): bool
    {
        $statement = $this->pdo->prepare('SELECT 1 FROM categories WHERE slug = :slug');
        $statement->execute(['slug' => $slug]);

        return $statement->fetchColumn() !== false;
    }

    /** Сведения о сервере БД для страницы проверки окружения. */
    public function serverInfo(): array
    {
        return $this->pdo->query('SELECT version() AS version, current_database() AS database,
            current_user AS "user", inet_server_port() AS port,
            pg_encoding_to_char(encoding) AS encoding, now() AS now
            FROM pg_database WHERE datname = current_database()')->fetch();
    }
}
