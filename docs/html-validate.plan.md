## Этап 1 — легко/безопасно сделать

### 1.1. Базовая семантика и простые синтаксические ошибки

- **[LEGACY_BNP/index.html] добавить `lang` и убрать лишний `role`**  
В файле [`pages/LEGACY_BNP/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/index.html) добавить атрибут `lang="ru"` (или другой корректный язык) к `<html>` и удалить `role="main"` у тега `<main>`.

- **[2012/bnp38.html] закрыть незакрытый `<span>`**  
В [`pages/LEGACY_BNP/2012/bnp38.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/bnp38.html) найти незакрытый `<span>` (ошибка `Unclosed element '<span>'`) и добавить корректный закрывающий `</span>` в нужном месте.

- **[2012/bnp42.html] поправить лишние/незакрытые `<b>`**  
В [`pages/LEGACY_BNP/2012/bnp42.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/bnp42.html) устранить `Stray end tag '</b>'` и `Unclosed element '<b>'`, приведя количество открывающих/закрывающих `<b>` в соответствие.

- **[2013/bnp33.html] убрать лишний `</b>`**  
В [`pages/LEGACY_BNP/2013/bnp33.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/bnp33.html) удалить один лишний закрывающий тег `</b>`.

- **[2014/bnp01.html] убрать лишний `</b>`**  
В [`pages/LEGACY_BNP/2014/bnp01.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2014/bnp01.html) удалить лишний `</b>`.

- **[2014/bnp14.html] убрать лишний `</b>`**  
В [`pages/LEGACY_BNP/2014/bnp14.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2014/bnp14.html) удалить лишний `</b>`.

- **[2014/bnp19.html] закрыть незакрытый `<span>`**  
В [`pages/LEGACY_BNP/2014/bnp19.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2014/bnp19.html) добавить закрывающий `</span>` для незакрытого `<span>`.

- **[2014/bnp23.html] убрать лишний `</span>`**  
В [`pages/LEGACY_BNP/2014/bnp23.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2014/bnp23.html) удалить лишний закрывающий тег `</span>`.

- **[2015/bnp13.html] закрыть два незакрытых `<span>`**  
В [`pages/LEGACY_BNP/2015/bnp13.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2015/bnp13.html) добавить два недостающих `</span>`.

- **[2015/bnp16.html] закрыть все незакрытые `<span>`**  
В [`pages/LEGACY_BNP/2015/bnp16.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2015/bnp16.html) для всех указанных html-validate незакрытых `<span>` добавить соответствующие теги `</span>`.

- **[2016/bnp10.html] закрыть незакрытый `<span>`**  
В [`pages/LEGACY_BNP/2016/bnp10.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2016/bnp10.html) добавить недостающий `</span>`.

- **[2017/bnp04.html] удалить лишние `</span>`**  
В [`pages/LEGACY_BNP/2017/bnp04.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2017/bnp04.html) удалить три лишних закрывающих тега `</span>`.

- **[2018/bnp22.html] удалить лишний `</span>`**  
В [`pages/LEGACY_BNP/2018/bnp22.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2018/bnp22.html) удалить лишний `</span>`.

- **[2023/bnp11.html] удалить лишний `</b>`**  
В [`pages/LEGACY_BNP/2023/bnp11.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2023/bnp11.html) удалить лишний `</b>`.

- **[2025/bnp03.html] удалить лишний `</a>`**  
В [`pages/LEGACY_BNP/2025/bnp03.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2025/bnp03.html) удалить лишний закрывающий тег `</a>`.

- **[2025/bnp05.html] удалить лишние `</b>`**  
В [`pages/LEGACY_BNP/2025/bnp05.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2025/bnp05.html) удалить два лишних закрывающих тега `</b>`.

- **[2013/bnp26.html] исправить синтаксическую ошибку `<<span cla...`**  
В [`pages/LEGACY_BNP/2013/bnp26.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/bnp26.html) заменить ошибочный фрагмент `<<span cla...` на корректный `<span class="...">` (или аналогичную правильную конструкцию, согласно дизайну страницы).

### 1.2. Неэкранированные спецсимволы и char-ref

- **[2012/bnp10.html] заменить `&Chemical` на корректное экранирование**  
В [`pages/LEGACY_BNP/2012/bnp10.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/bnp10.html) заменить оба вхождения `&Chemical` на `&amp;Chemical` (или другую корректную комбинацию, если нужно).

- **[2012/bnp36.html] экранировать `&` и исправить `&C`**  
В [`pages/LEGACY_BNP/2012/bnp36.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/bnp36.html) заменить сырое `&` на `&amp;` и исправить `&C` на корректное представление (обычно `&amp;C`).

- **[2012/bnp37.html] экранировать `&` и исправить `&C`**  
Аналогично предыдущему, в [`pages/LEGACY_BNP/2012/bnp37.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/bnp37.html) заменить сырое `&` и `&C` на корректные сущности.

- **[2015/bnp16.html] экранировать `&C`**  
В [`pages/LEGACY_BNP/2015/bnp16.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2015/bnp16.html) заменить `&C` на `&amp;C` (и тем самым устранить `no-raw-characters`/`unrecognized-char-ref`).

- **[2017/bnp10.html] экранировать одинарные кавычки**  
В [`pages/LEGACY_BNP/2017/bnp10.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2017/bnp10.html) заменить сырые `'` в проблемных местах на `&apos;`.

- **[2019/bnp13.html] экранировать сырое `&`**  
В [`pages/LEGACY_BNP/2019/bnp13.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp13.html) заменить проблемный `&` на `&amp;`.

### 1.3. Неверное значение атрибута `href`

- **[2018/bnp06.html] поправить многострочный `href`**  
В [`pages/LEGACY_BNP/2018/bnp06.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2018/bnp06.html) привести значение `href` `"/BNP/2018/jpg06/Nanosist_11_4_2013\n/s4.jpg"` к однострочному корректному пути (без перевода строки), например `"/BNP/2018/jpg06/Nanosist_11_4_2013/s4.jpg"`.

### 1.4. Обязательные атрибуты `alt` и стиль void-элементов `img` (локальные серии 2019)

- **[2019/bnp01.html] добавить `alt` и привести `<img/>` к рекомендуемому стилю**  
В [`pages/LEGACY_BNP/2019/bnp01.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp01.html) для всех отмеченных `<img>` добавить осмысленные `alt` и заменить самозакрывающийся синтаксис `<img/>` на `<img>` без закрывающего слеша.

- **[2019/bnp02.html] то же для всех `<img>`**  
Аналогично предыдущему, в [`pages/LEGACY_BNP/2019/bnp02.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp02.html) добавить `alt` и поправить void-style для всех проблемных `<img>`.

- **[2019/bnp03.html] то же для всех `<img>`**  
В [`pages/LEGACY_BNP/2019/bnp03.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp03.html) добавить `alt` и убрать самозакрывающийся стиль `<img/>`.

- **[2019/bnp04.html] то же для всех `<img>`**  
В [`pages/LEGACY_BNP/2019/bnp04.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp04.html) добавить `alt` и поправить void-style `<img>`.

- **[2019/bnp05.html] то же для `<img>`**  
В [`pages/LEGACY_BNP/2019/bnp05.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp05.html) добавить `alt` и поправить void-style `<img>`.

- **[2019/bnp06.html] то же для `<img>`**  
В [`pages/LEGACY_BNP/2019/bnp06.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019/bnp06.html) добавить `alt` и поправить void-style `<img>`.

---

## Этап 2 — могут быть проблемы (изменение верстки/семантики, но ещё довольно механически)

### 2.1. Депрекейтнутые теги `<font>`, `<center>`, `<marquee>` и атрибуты выравнивания

Здесь правки могут заметно поменять отображение, поэтому их лучше делать сериями, сохраняя внешний вид за счёт CSS.

- **[2013/bnp02.html] удалить/заменить `<font>` и `<marquee>` с переводом стилей в CSS**  
В [`pages/LEGACY_BNP/2013/bnp02.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/bnp02.html) убрать `<font>` и `<marquee>`, привести `BEHAVIOR`/`DIRECTION` к строчным атрибутам или заменить их на более современный эквивалент (например, CSS-анимацию), при необходимости добавив CSS-классы.

- **[2013/bnp03.html] аналогичная чистка `<font>`/`<marquee>`**  
В [`pages/LEGACY_BNP/2013/bnp03.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/bnp03.html) выполнить те же действия.

- **[2013/bnp14.html] аналогичная чистка `<font>`/`<marquee>`**  
В [`pages/LEGACY_BNP/2013/bnp14.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/bnp14.html) выполнить те же действия.

- **[2021/bnp03.html] заменить `<font>` на CSS**  
В [`pages/LEGACY_BNP/2021/bnp03.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2021/bnp03.html) перенести стили из `<font>` в CSS-классы и удалить теги `<font>`.

- **[2021/bnp04.html] заменить `<font>` на CSS**  
Аналогично для [`pages/LEGACY_BNP/2021/bnp04.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2021/bnp04.html).

- **[2021/bnp09.html] заменить `<font>` на CSS (2 места)**  
В [`pages/LEGACY_BNP/2021/bnp09.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2021/bnp09.html) перенести оформление из `<font>` в классы и удалить теги.

### 2.2. Табличная шапка для индексов 2012/2013/2014/2016 и приведение кейса/атрибутов

- **[2012/index.html] привести шапку таблицы к валидному виду (tbody, строчные теги/атрибуты, alt)**  
В [`pages/LEGACY_BNP/2012/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/index.html) выполнить полный набор правок:
- Переписать верхнюю таблицу: `TABLE/TR/TD/IMG/FONT` → строчные теги (`table`, `tr`, `td`, `img`, `font` или CSS).  
- Добавить `tbody` вокруг `tr`.  
- Опустить deprecated-атрибуты (`width`, `align`, `valign`, `bgcolor` и т.п.) либо перенести их в CSS.  
- Добавить `alt` в `<img>`.  
- Удалить `<center>` или заменить его на CSS-классы.  
- Убедиться, что все теги корректно открыты/закрыты.

- **[2013/index.html] аналогичный рефакторинг шапки таблицы**  
В [`pages/LEGACY_BNP/2013/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2013/index.html) повторить схему из 2012: привести `TABLE/TR/TD/IMG/FONT`, `center`, `font`, deprecated-атрибуты и структуру `tbody` к единому валидному шаблону.

- **[2014/index.html] аналогичный рефакторинг шапки таблицы**  
В [`pages/LEGACY_BNP/2014/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2014/index.html) выполнить те же шаги по шапке таблицы (включая устранение nested `<b>` + `<h2>` и несоответствий `FONT`/`font`).

- **[2016/index.html] аналогичный рефакторинг шапки таблицы + casing end-тегов**  
В [`pages/LEGACY_BNP/2016/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2016/index.html) привести таблицу к тому же стандарту, а также выровнять регистр между `<font>` и `</FONT>` (start/end tag casing) и убрать лишние закрывающие `</FONT>`.

- **[2015/index.html] упрощённый рефакторинг шапки таблицы (уже строчные теги)**  
В [`pages/LEGACY_BNP/2015/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2015/index.html)
- Оставить строчные теги (`table`, `tr`, `td`, `img`).  
- Удалить deprecated-атрибуты (`width`, `align`, `valign`) или перенести их в CSS.  
- Убрать/минимизировать inline-style.  
- Перенести оформление `<font>`/`<center>` в CSS.

- **[2017/index.html] такой же рефакторинг шапки таблицы**  
В [`pages/LEGACY_BNP/2017/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2017/index.html)
- Удалить deprecated-атрибуты, перенести в CSS.  
- Заменить `<font>` и `<center>`.  
- Добавить `tbody` и привести `<img>` к корректному стилю.

- **[2018/index.html] привести к тому же шаблону, что 2017**  
В [`pages/LEGACY_BNP/2018/index.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2018/index.html) выполнить те же шаги, что и для 2017 (таблица, alt, void-style, `font`/`center`, inline-style).

### 2.3. Deprecated-атрибуты `border` на `<img>` (серия 2019)

- **[2019/bnp01–bnp06.html] убрать `border` и перенести оформление в CSS**  
Пройтись по файлам `bnp01.html`–`bnp06.html` в [`pages/LEGACY_BNP/2019/`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2019) и удалить `border` на `<img>`, при необходимости добавив CSS-класс для рамки.

### 2.4. Гигантская таблица `2012/jpg07/contents1.html`

- **[2012/jpg07/contents1.html] привести разметку таблицы к валидной (без смены дизайна)**  
В [`pages/LEGACY_BNP/2012/jpg07/contents1.html`](/Users/ikpopov/projects/chglib/pages/LEGACY_BNP/2012/jpg07/contents1.html) по шагам:
- Заменить deprecated-атрибуты (`width`, `cellspacing`, `cellpadding`, `bgcolor`, `align`, `valign`) на CSS, присвоив ячейкам и строкам классы.  
- Удалить `<font>` и перенести оформление в CSS.  
- Убедиться, что структура `table`/`tr`/`td` валидна и единообразна по всему файлу.

---

## Этап 3 — только ручное исправление (массовый рефакторинг legacy-верстки)

Здесь речь о том, чтобы **концептуально** пересобрать старую разметку под современный HTML+CSS, а не просто «заткнуть» ошибки валидатора. Это требует визуальной проверки, иногда консультаций с заказчиком и, возможно, промежуточного дизайна.

### 3.1. Полное избавление от `<font>`/`<center>`/deprecated-атрибутов по всему LEGACY_BNP

- **[Вся папка LEGACY_BNP] составить и задокументировать общий шаблон оформления таблиц и заголовков**  
Описать единый шаблон (или 2–3 варианта) для шапок таблиц, заголовков, цветовых схем и выравнивания, который затем можно будет применять ко всем годам/индексам и материалам, заменяя `<font>`/`<center>`/`align`/`valign`/`bgcolor` на классы.

- **[LEGACY_BNP/*] поэтапно применить шаблон ко всем страницам (кроме уже явно исправленных в Этапах 1–2)**  
По году или по подпапкам последовательно менять разметку: убирать `<font>`, `<center>`, deprecated-атрибуты, приводить `img`, `table`, `tr`, `td` к единой семантике, сверяя визуальный результат с текущим.

### 3.2. Уточнение содержимого `alt` и семантики заголовков

- **[Все файлы с добавленным `alt`] осмысленно заполнить текст альтернативы**  
После технического добавления `alt` (Этап 1–2) пройтись по страницам, чтобы заменить временные значения (`"image"`, `"photo"` и т.п.) на действительно описательный текст, согласованный с контентом.

- **[Индексы 2012/2013/2014/2015/2016/2017/2018] выровнять иерархию заголовков (`h1`–`h3`)**  
Ручной аудит заголовков: убрать ситуации, когда `h2` вложен внутрь `<b>` или других несемантических контейнеров, и выстроить логичную структуру `h1` → `h2` → `h3` по всем индексным страницам.

### 3.3. Повторно проверить `html-validate` и доработать оставшиеся edge-case'ы

- **[Проект] запуск `yarn html-validate:legacy-bnp` после каждого этапа и добивание остаточных ошибок**  
После выполнения Этапа 1 и Этапа 2 — перезапуск проверки, выявление новых/оставшихся edge-case'ов, добавление точечных задач (по аналогии с текущим планом) и их ручное исправление с визуальной проверкой.