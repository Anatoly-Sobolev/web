-- Структура базы данных справочника «Мера» (PostgreSQL 18).
-- Перевод значения x из единицы A в единицу B:
--   x_SI = x * A.factor + A.offset_si;   x_B = (x_SI - B.offset_si) / B.factor

SET client_min_messages = warning;

COMMENT ON DATABASE mera IS 'Справочник единиц измерения «Мера»';

DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id          SERIAL       PRIMARY KEY,
    slug        VARCHAR(40)  NOT NULL UNIQUE,
    name        VARCHAR(60)  NOT NULL UNIQUE,
    icon        VARCHAR(30)  NOT NULL,
    dimension   VARCHAR(10)  NOT NULL,
    description TEXT         NOT NULL,
    sort_order  SMALLINT     NOT NULL DEFAULT 0
);

COMMENT ON TABLE categories IS 'Категории (типы) величин: длина, масса, время и т. д.';
COMMENT ON COLUMN categories.dimension IS 'Размерность величины в СИ (L, M, T, Θ, L², L³)';

CREATE TABLE units (
    id          SERIAL         PRIMARY KEY,
    category_id INTEGER        NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
    slug        VARCHAR(60)    NOT NULL UNIQUE,
    name        VARCHAR(100)   NOT NULL,
    name_en     VARCHAR(100)   NOT NULL,
    symbol      VARCHAR(20)    NOT NULL,
    symbol_intl VARCHAR(20)    NOT NULL,
    factor      NUMERIC(60,32) NOT NULL CHECK (factor > 0),
    offset_si   NUMERIC(60,32) NOT NULL DEFAULT 0,
    description TEXT           NOT NULL DEFAULT '',
    is_base     BOOLEAN        NOT NULL DEFAULT FALSE,
    sort_order  SMALLINT       NOT NULL DEFAULT 0,
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

COMMENT ON TABLE units IS 'Единицы измерения с коэффициентами пересчёта в базовую единицу СИ';
COMMENT ON COLUMN units.factor IS 'Множитель перевода в базовую единицу СИ';
COMMENT ON COLUMN units.offset_si IS 'Сдвиг шкалы при переводе в СИ (для температурных шкал)';

CREATE INDEX units_category_idx ON units (category_id, sort_order);
CREATE UNIQUE INDEX units_one_base_per_category ON units (category_id) WHERE is_base;
