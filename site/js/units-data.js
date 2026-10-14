/* Файл создан scripts/build_data.js из data/units.json. Не редактировать вручную. */
window.MERA_DATA = {
  "categories": [
    {
      "slug": "length",
      "name": "Длина",
      "icon": "ruler",
      "dimension": "L",
      "base": "metre",
      "description": "Расстояние между двумя точками. Базовая единица СИ — метр."
    },
    {
      "slug": "mass",
      "name": "Масса",
      "icon": "scale",
      "dimension": "M",
      "base": "kilogram",
      "description": "Мера инертности и количества вещества тела. Базовая единица СИ — килограмм."
    },
    {
      "slug": "time",
      "name": "Время",
      "icon": "clock",
      "dimension": "T",
      "base": "second",
      "description": "Длительность процессов и интервалов. Базовая единица СИ — секунда."
    },
    {
      "slug": "temperature",
      "name": "Температура",
      "icon": "thermometer",
      "dimension": "Θ",
      "base": "kelvin",
      "description": "Тепловое состояние тела. Базовая единица СИ — кельвин; шкалы связаны линейной формулой со сдвигом."
    },
    {
      "slug": "area",
      "name": "Площадь",
      "icon": "square",
      "dimension": "L²",
      "base": "square-metre",
      "description": "Размер поверхности. Производная единица СИ — квадратный метр."
    },
    {
      "slug": "volume",
      "name": "Объём",
      "icon": "cube",
      "dimension": "L³",
      "base": "cubic-metre",
      "description": "Вместимость или размер тела в пространстве. Производная единица СИ — кубический метр."
    }
  ],
  "units": [
    {
      "category": "length",
      "slug": "metre",
      "name": "Метр",
      "name_en": "metre",
      "symbol": "м",
      "symbol_intl": "m",
      "factor": 1,
      "offset": 0,
      "description": "Основная единица длины в Международной системе единиц (СИ). Равен расстоянию, которое свет проходит в вакууме за 1/299 792 458 секунды."
    },
    {
      "category": "length",
      "slug": "kilometre",
      "name": "Километр",
      "name_en": "kilometre",
      "symbol": "км",
      "symbol_intl": "km",
      "factor": 1000,
      "offset": 0,
      "description": "Кратная единица длины, равная 1000 метров. Используется для расстояний между населёнными пунктами."
    },
    {
      "category": "length",
      "slug": "decimetre",
      "name": "Дециметр",
      "name_en": "decimetre",
      "symbol": "дм",
      "symbol_intl": "dm",
      "factor": 0.1,
      "offset": 0,
      "description": "Дольная единица длины, равная 0,1 метра."
    },
    {
      "category": "length",
      "slug": "centimetre",
      "name": "Сантиметр",
      "name_en": "centimetre",
      "symbol": "см",
      "symbol_intl": "cm",
      "factor": 0.01,
      "offset": 0,
      "description": "Дольная единица длины, равная 0,01 метра."
    },
    {
      "category": "length",
      "slug": "millimetre",
      "name": "Миллиметр",
      "name_en": "millimetre",
      "symbol": "мм",
      "symbol_intl": "mm",
      "factor": 0.001,
      "offset": 0,
      "description": "Дольная единица длины, равная 0,001 метра. Применяется в черчении и машиностроении."
    },
    {
      "category": "length",
      "slug": "micrometre",
      "name": "Микрометр",
      "name_en": "micrometre",
      "symbol": "мкм",
      "symbol_intl": "µm",
      "factor": 0.000001,
      "offset": 0,
      "description": "Дольная единица длины, равная одной миллионной метра."
    },
    {
      "category": "length",
      "slug": "inch",
      "name": "Дюйм",
      "name_en": "inch",
      "symbol": "дюйм",
      "symbol_intl": "in",
      "factor": 0.0254,
      "offset": 0,
      "description": "Английская единица длины, равная 2,54 сантиметра. Используется для диагоналей экранов и диаметров труб."
    },
    {
      "category": "length",
      "slug": "foot",
      "name": "Фут",
      "name_en": "foot",
      "symbol": "фут",
      "symbol_intl": "ft",
      "factor": 0.3048,
      "offset": 0,
      "description": "Английская единица длины, равная 12 дюймам или 0,3048 метра."
    },
    {
      "category": "length",
      "slug": "yard",
      "name": "Ярд",
      "name_en": "yard",
      "symbol": "ярд",
      "symbol_intl": "yd",
      "factor": 0.9144,
      "offset": 0,
      "description": "Английская единица длины, равная 3 футам или 0,9144 метра."
    },
    {
      "category": "length",
      "slug": "mile",
      "name": "Миля",
      "name_en": "mile",
      "symbol": "миля",
      "symbol_intl": "mi",
      "factor": 1609.344,
      "offset": 0,
      "description": "Международная сухопутная миля, равная 1609,344 метра."
    },
    {
      "category": "length",
      "slug": "nautical-mile",
      "name": "Морская миля",
      "name_en": "nautical mile",
      "symbol": "мор. миля",
      "symbol_intl": "nmi",
      "factor": 1852,
      "offset": 0,
      "description": "Единица длины в навигации, равная 1852 метрам."
    },
    {
      "category": "mass",
      "slug": "kilogram",
      "name": "Килограмм",
      "name_en": "kilogram",
      "symbol": "кг",
      "symbol_intl": "kg",
      "factor": 1,
      "offset": 0,
      "description": "Основная единица массы в СИ. С 2019 года определяется через фиксированное значение постоянной Планка."
    },
    {
      "category": "mass",
      "slug": "gram",
      "name": "Грамм",
      "name_en": "gram",
      "symbol": "г",
      "symbol_intl": "g",
      "factor": 0.001,
      "offset": 0,
      "description": "Дольная единица массы, равная 0,001 килограмма."
    },
    {
      "category": "mass",
      "slug": "milligram",
      "name": "Миллиграмм",
      "name_en": "milligram",
      "symbol": "мг",
      "symbol_intl": "mg",
      "factor": 0.000001,
      "offset": 0,
      "description": "Дольная единица массы, равная 0,001 грамма. Применяется в фармакологии."
    },
    {
      "category": "mass",
      "slug": "tonne",
      "name": "Тонна",
      "name_en": "tonne",
      "symbol": "т",
      "symbol_intl": "t",
      "factor": 1000,
      "offset": 0,
      "description": "Внесистемная единица массы, равная 1000 килограммов."
    },
    {
      "category": "mass",
      "slug": "centner",
      "name": "Центнер",
      "name_en": "quintal",
      "symbol": "ц",
      "symbol_intl": "q",
      "factor": 100,
      "offset": 0,
      "description": "Внесистемная единица массы, равная 100 килограммам. Используется в сельском хозяйстве."
    },
    {
      "category": "mass",
      "slug": "pound",
      "name": "Фунт",
      "name_en": "pound",
      "symbol": "фунт",
      "symbol_intl": "lb",
      "factor": 0.45359237,
      "offset": 0,
      "description": "Международный торговый фунт, равный 0,45359237 килограмма."
    },
    {
      "category": "mass",
      "slug": "ounce",
      "name": "Унция",
      "name_en": "ounce",
      "symbol": "унц.",
      "symbol_intl": "oz",
      "factor": 0.028349523125,
      "offset": 0,
      "description": "Торговая унция, равная 1/16 фунта."
    },
    {
      "category": "mass",
      "slug": "carat",
      "name": "Карат",
      "name_en": "carat",
      "symbol": "кар",
      "symbol_intl": "ct",
      "factor": 0.0002,
      "offset": 0,
      "description": "Метрический карат для драгоценных камней, равный 200 миллиграммам."
    },
    {
      "category": "time",
      "slug": "second",
      "name": "Секунда",
      "name_en": "second",
      "symbol": "с",
      "symbol_intl": "s",
      "factor": 1,
      "offset": 0,
      "description": "Основная единица времени в СИ, определяемая через частоту перехода атома цезия-133."
    },
    {
      "category": "time",
      "slug": "millisecond",
      "name": "Миллисекунда",
      "name_en": "millisecond",
      "symbol": "мс",
      "symbol_intl": "ms",
      "factor": 0.001,
      "offset": 0,
      "description": "Дольная единица времени, равная 0,001 секунды."
    },
    {
      "category": "time",
      "slug": "minute",
      "name": "Минута",
      "name_en": "minute",
      "symbol": "мин",
      "symbol_intl": "min",
      "factor": 60,
      "offset": 0,
      "description": "Внесистемная единица времени, равная 60 секундам."
    },
    {
      "category": "time",
      "slug": "hour",
      "name": "Час",
      "name_en": "hour",
      "symbol": "ч",
      "symbol_intl": "h",
      "factor": 3600,
      "offset": 0,
      "description": "Внесистемная единица времени, равная 60 минутам."
    },
    {
      "category": "time",
      "slug": "day",
      "name": "Сутки",
      "name_en": "day",
      "symbol": "сут",
      "symbol_intl": "d",
      "factor": 86400,
      "offset": 0,
      "description": "Внесистемная единица времени, равная 24 часам."
    },
    {
      "category": "time",
      "slug": "week",
      "name": "Неделя",
      "name_en": "week",
      "symbol": "нед",
      "symbol_intl": "wk",
      "factor": 604800,
      "offset": 0,
      "description": "Календарная единица времени, равная 7 суткам."
    },
    {
      "category": "temperature",
      "slug": "kelvin",
      "name": "Кельвин",
      "name_en": "kelvin",
      "symbol": "К",
      "symbol_intl": "K",
      "factor": 1,
      "offset": 0,
      "description": "Основная единица термодинамической температуры в СИ. Отсчёт ведётся от абсолютного нуля."
    },
    {
      "category": "temperature",
      "slug": "celsius",
      "name": "Градус Цельсия",
      "name_en": "degree Celsius",
      "symbol": "°C",
      "symbol_intl": "°C",
      "factor": 1,
      "offset": 273.15,
      "description": "Единица температуры, равная кельвину по величине; ноль шкалы соответствует 273,15 К."
    },
    {
      "category": "temperature",
      "slug": "fahrenheit",
      "name": "Градус Фаренгейта",
      "name_en": "degree Fahrenheit",
      "symbol": "°F",
      "symbol_intl": "°F",
      "factor": 0.5555555555555556,
      "offset": 255.3722222222222,
      "description": "Единица температуры, принятая в США: T(К) = (T(°F) + 459,67) × 5/9."
    },
    {
      "category": "temperature",
      "slug": "rankine",
      "name": "Градус Ранкина",
      "name_en": "degree Rankine",
      "symbol": "°Ra",
      "symbol_intl": "°R",
      "factor": 0.5555555555555556,
      "offset": 0,
      "description": "Абсолютная шкала с шагом градуса Фаренгейта: T(К) = T(°Ra) × 5/9."
    },
    {
      "category": "area",
      "slug": "square-metre",
      "name": "Квадратный метр",
      "name_en": "square metre",
      "symbol": "м²",
      "symbol_intl": "m²",
      "factor": 1,
      "offset": 0,
      "description": "Производная единица площади в СИ — площадь квадрата со стороной 1 метр."
    },
    {
      "category": "area",
      "slug": "square-kilometre",
      "name": "Квадратный километр",
      "name_en": "square kilometre",
      "symbol": "км²",
      "symbol_intl": "km²",
      "factor": 1000000,
      "offset": 0,
      "description": "Кратная единица площади, равная 1 000 000 м²."
    },
    {
      "category": "area",
      "slug": "square-centimetre",
      "name": "Квадратный сантиметр",
      "name_en": "square centimetre",
      "symbol": "см²",
      "symbol_intl": "cm²",
      "factor": 0.0001,
      "offset": 0,
      "description": "Дольная единица площади, равная 0,0001 м²."
    },
    {
      "category": "area",
      "slug": "hectare",
      "name": "Гектар",
      "name_en": "hectare",
      "symbol": "га",
      "symbol_intl": "ha",
      "factor": 10000,
      "offset": 0,
      "description": "Внесистемная единица площади земельных участков, равная 10 000 м²."
    },
    {
      "category": "area",
      "slug": "are",
      "name": "Ар (сотка)",
      "name_en": "are",
      "symbol": "а",
      "symbol_intl": "a",
      "factor": 100,
      "offset": 0,
      "description": "Внесистемная единица площади, равная 100 м²."
    },
    {
      "category": "area",
      "slug": "acre",
      "name": "Акр",
      "name_en": "acre",
      "symbol": "акр",
      "symbol_intl": "ac",
      "factor": 4046.8564224,
      "offset": 0,
      "description": "Английская единица площади земли, равная 4046,8564224 м²."
    },
    {
      "category": "volume",
      "slug": "cubic-metre",
      "name": "Кубический метр",
      "name_en": "cubic metre",
      "symbol": "м³",
      "symbol_intl": "m³",
      "factor": 1,
      "offset": 0,
      "description": "Производная единица объёма в СИ — объём куба с ребром 1 метр."
    },
    {
      "category": "volume",
      "slug": "litre",
      "name": "Литр",
      "name_en": "litre",
      "symbol": "л",
      "symbol_intl": "L",
      "factor": 0.001,
      "offset": 0,
      "description": "Внесистемная единица объёма, равная 1 дм³ или 0,001 м³."
    },
    {
      "category": "volume",
      "slug": "millilitre",
      "name": "Миллилитр",
      "name_en": "millilitre",
      "symbol": "мл",
      "symbol_intl": "mL",
      "factor": 0.000001,
      "offset": 0,
      "description": "Дольная единица объёма, равная 0,001 литра или 1 см³."
    },
    {
      "category": "volume",
      "slug": "cubic-centimetre",
      "name": "Кубический сантиметр",
      "name_en": "cubic centimetre",
      "symbol": "см³",
      "symbol_intl": "cm³",
      "factor": 0.000001,
      "offset": 0,
      "description": "Дольная единица объёма, равная 0,000001 м³."
    },
    {
      "category": "volume",
      "slug": "us-gallon",
      "name": "Галлон США",
      "name_en": "US gallon",
      "symbol": "гал",
      "symbol_intl": "gal",
      "factor": 0.003785411784,
      "offset": 0,
      "description": "Единица объёма жидкостей в США, равная 3,785411784 литра."
    },
    {
      "category": "volume",
      "slug": "oil-barrel",
      "name": "Нефтяной баррель",
      "name_en": "oil barrel",
      "symbol": "барр.",
      "symbol_intl": "bbl",
      "factor": 0.158987294928,
      "offset": 0,
      "description": "Единица объёма нефти, равная 42 галлонам США или 158,987 литра."
    }
  ]
};
