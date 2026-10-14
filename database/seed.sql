-- Начальные данные справочника «Мера».
-- Файл создан scripts/build_data.js из data/units.json.

BEGIN;

TRUNCATE units, categories RESTART IDENTITY CASCADE;

INSERT INTO categories (slug, name, icon, dimension, description, sort_order) VALUES
  ('length', 'Длина', 'ruler', 'L', 'Расстояние между двумя точками. Базовая единица СИ — метр.', 1),
  ('mass', 'Масса', 'scale', 'M', 'Мера инертности и количества вещества тела. Базовая единица СИ — килограмм.', 2),
  ('time', 'Время', 'clock', 'T', 'Длительность процессов и интервалов. Базовая единица СИ — секунда.', 3),
  ('temperature', 'Температура', 'thermometer', 'Θ', 'Тепловое состояние тела. Базовая единица СИ — кельвин; шкалы связаны линейной формулой со сдвигом.', 4),
  ('area', 'Площадь', 'square', 'L²', 'Размер поверхности. Производная единица СИ — квадратный метр.', 5),
  ('volume', 'Объём', 'cube', 'L³', 'Вместимость или размер тела в пространстве. Производная единица СИ — кубический метр.', 6);

INSERT INTO units (category_id, slug, name, name_en, symbol, symbol_intl, factor, offset_si, description, is_base, sort_order) VALUES
  ((SELECT id FROM categories WHERE slug = 'length'), 'metre', 'Метр', 'metre', 'м', 'm', 1, 0, 'Основная единица длины в Международной системе единиц (СИ). Равен расстоянию, которое свет проходит в вакууме за 1/299 792 458 секунды.', TRUE, 1),
  ((SELECT id FROM categories WHERE slug = 'length'), 'kilometre', 'Километр', 'kilometre', 'км', 'km', 1000, 0, 'Кратная единица длины, равная 1000 метров. Используется для расстояний между населёнными пунктами.', FALSE, 2),
  ((SELECT id FROM categories WHERE slug = 'length'), 'decimetre', 'Дециметр', 'decimetre', 'дм', 'dm', 0.1, 0, 'Дольная единица длины, равная 0,1 метра.', FALSE, 3),
  ((SELECT id FROM categories WHERE slug = 'length'), 'centimetre', 'Сантиметр', 'centimetre', 'см', 'cm', 0.01, 0, 'Дольная единица длины, равная 0,01 метра.', FALSE, 4),
  ((SELECT id FROM categories WHERE slug = 'length'), 'millimetre', 'Миллиметр', 'millimetre', 'мм', 'mm', 0.001, 0, 'Дольная единица длины, равная 0,001 метра. Применяется в черчении и машиностроении.', FALSE, 5),
  ((SELECT id FROM categories WHERE slug = 'length'), 'micrometre', 'Микрометр', 'micrometre', 'мкм', 'µm', 0.000001, 0, 'Дольная единица длины, равная одной миллионной метра.', FALSE, 6),
  ((SELECT id FROM categories WHERE slug = 'length'), 'inch', 'Дюйм', 'inch', 'дюйм', 'in', 0.0254, 0, 'Английская единица длины, равная 2,54 сантиметра. Используется для диагоналей экранов и диаметров труб.', FALSE, 7),
  ((SELECT id FROM categories WHERE slug = 'length'), 'foot', 'Фут', 'foot', 'фут', 'ft', 0.3048, 0, 'Английская единица длины, равная 12 дюймам или 0,3048 метра.', FALSE, 8),
  ((SELECT id FROM categories WHERE slug = 'length'), 'yard', 'Ярд', 'yard', 'ярд', 'yd', 0.9144, 0, 'Английская единица длины, равная 3 футам или 0,9144 метра.', FALSE, 9),
  ((SELECT id FROM categories WHERE slug = 'length'), 'mile', 'Миля', 'mile', 'миля', 'mi', 1609.344, 0, 'Международная сухопутная миля, равная 1609,344 метра.', FALSE, 10),
  ((SELECT id FROM categories WHERE slug = 'length'), 'nautical-mile', 'Морская миля', 'nautical mile', 'мор. миля', 'nmi', 1852, 0, 'Единица длины в навигации, равная 1852 метрам.', FALSE, 11),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'kilogram', 'Килограмм', 'kilogram', 'кг', 'kg', 1, 0, 'Основная единица массы в СИ. С 2019 года определяется через фиксированное значение постоянной Планка.', TRUE, 12),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'gram', 'Грамм', 'gram', 'г', 'g', 0.001, 0, 'Дольная единица массы, равная 0,001 килограмма.', FALSE, 13),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'milligram', 'Миллиграмм', 'milligram', 'мг', 'mg', 0.000001, 0, 'Дольная единица массы, равная 0,001 грамма. Применяется в фармакологии.', FALSE, 14),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'tonne', 'Тонна', 'tonne', 'т', 't', 1000, 0, 'Внесистемная единица массы, равная 1000 килограммов.', FALSE, 15),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'centner', 'Центнер', 'quintal', 'ц', 'q', 100, 0, 'Внесистемная единица массы, равная 100 килограммам. Используется в сельском хозяйстве.', FALSE, 16),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'pound', 'Фунт', 'pound', 'фунт', 'lb', 0.45359237, 0, 'Международный торговый фунт, равный 0,45359237 килограмма.', FALSE, 17),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'ounce', 'Унция', 'ounce', 'унц.', 'oz', 0.028349523125, 0, 'Торговая унция, равная 1/16 фунта.', FALSE, 18),
  ((SELECT id FROM categories WHERE slug = 'mass'), 'carat', 'Карат', 'carat', 'кар', 'ct', 0.0002, 0, 'Метрический карат для драгоценных камней, равный 200 миллиграммам.', FALSE, 19),
  ((SELECT id FROM categories WHERE slug = 'time'), 'second', 'Секунда', 'second', 'с', 's', 1, 0, 'Основная единица времени в СИ, определяемая через частоту перехода атома цезия-133.', TRUE, 20),
  ((SELECT id FROM categories WHERE slug = 'time'), 'millisecond', 'Миллисекунда', 'millisecond', 'мс', 'ms', 0.001, 0, 'Дольная единица времени, равная 0,001 секунды.', FALSE, 21),
  ((SELECT id FROM categories WHERE slug = 'time'), 'minute', 'Минута', 'minute', 'мин', 'min', 60, 0, 'Внесистемная единица времени, равная 60 секундам.', FALSE, 22),
  ((SELECT id FROM categories WHERE slug = 'time'), 'hour', 'Час', 'hour', 'ч', 'h', 3600, 0, 'Внесистемная единица времени, равная 60 минутам.', FALSE, 23),
  ((SELECT id FROM categories WHERE slug = 'time'), 'day', 'Сутки', 'day', 'сут', 'd', 86400, 0, 'Внесистемная единица времени, равная 24 часам.', FALSE, 24),
  ((SELECT id FROM categories WHERE slug = 'time'), 'week', 'Неделя', 'week', 'нед', 'wk', 604800, 0, 'Календарная единица времени, равная 7 суткам.', FALSE, 25),
  ((SELECT id FROM categories WHERE slug = 'temperature'), 'kelvin', 'Кельвин', 'kelvin', 'К', 'K', 1, 0, 'Основная единица термодинамической температуры в СИ. Отсчёт ведётся от абсолютного нуля.', TRUE, 26),
  ((SELECT id FROM categories WHERE slug = 'temperature'), 'celsius', 'Градус Цельсия', 'degree Celsius', '°C', '°C', 1, 273.15, 'Единица температуры, равная кельвину по величине; ноль шкалы соответствует 273,15 К.', FALSE, 27),
  ((SELECT id FROM categories WHERE slug = 'temperature'), 'fahrenheit', 'Градус Фаренгейта', 'degree Fahrenheit', '°F', '°F', 0.5555555555555556, 255.3722222222222, 'Единица температуры, принятая в США: T(К) = (T(°F) + 459,67) × 5/9.', FALSE, 28),
  ((SELECT id FROM categories WHERE slug = 'temperature'), 'rankine', 'Градус Ранкина', 'degree Rankine', '°Ra', '°R', 0.5555555555555556, 0, 'Абсолютная шкала с шагом градуса Фаренгейта: T(К) = T(°Ra) × 5/9.', FALSE, 29),
  ((SELECT id FROM categories WHERE slug = 'area'), 'square-metre', 'Квадратный метр', 'square metre', 'м²', 'm²', 1, 0, 'Производная единица площади в СИ — площадь квадрата со стороной 1 метр.', TRUE, 30),
  ((SELECT id FROM categories WHERE slug = 'area'), 'square-kilometre', 'Квадратный километр', 'square kilometre', 'км²', 'km²', 1000000, 0, 'Кратная единица площади, равная 1 000 000 м².', FALSE, 31),
  ((SELECT id FROM categories WHERE slug = 'area'), 'square-centimetre', 'Квадратный сантиметр', 'square centimetre', 'см²', 'cm²', 0.0001, 0, 'Дольная единица площади, равная 0,0001 м².', FALSE, 32),
  ((SELECT id FROM categories WHERE slug = 'area'), 'hectare', 'Гектар', 'hectare', 'га', 'ha', 10000, 0, 'Внесистемная единица площади земельных участков, равная 10 000 м².', FALSE, 33),
  ((SELECT id FROM categories WHERE slug = 'area'), 'are', 'Ар (сотка)', 'are', 'а', 'a', 100, 0, 'Внесистемная единица площади, равная 100 м².', FALSE, 34),
  ((SELECT id FROM categories WHERE slug = 'area'), 'acre', 'Акр', 'acre', 'акр', 'ac', 4046.8564224, 0, 'Английская единица площади земли, равная 4046,8564224 м².', FALSE, 35),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'cubic-metre', 'Кубический метр', 'cubic metre', 'м³', 'm³', 1, 0, 'Производная единица объёма в СИ — объём куба с ребром 1 метр.', TRUE, 36),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'litre', 'Литр', 'litre', 'л', 'L', 0.001, 0, 'Внесистемная единица объёма, равная 1 дм³ или 0,001 м³.', FALSE, 37),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'millilitre', 'Миллилитр', 'millilitre', 'мл', 'mL', 0.000001, 0, 'Дольная единица объёма, равная 0,001 литра или 1 см³.', FALSE, 38),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'cubic-centimetre', 'Кубический сантиметр', 'cubic centimetre', 'см³', 'cm³', 0.000001, 0, 'Дольная единица объёма, равная 0,000001 м³.', FALSE, 39),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'us-gallon', 'Галлон США', 'US gallon', 'гал', 'gal', 0.003785411784, 0, 'Единица объёма жидкостей в США, равная 3,785411784 литра.', FALSE, 40),
  ((SELECT id FROM categories WHERE slug = 'volume'), 'oil-barrel', 'Нефтяной баррель', 'oil barrel', 'барр.', 'bbl', 0.158987294928, 0, 'Единица объёма нефти, равная 42 галлонам США или 158,987 литра.', FALSE, 41);

COMMIT;
