# Bemer — БЭМ-шаблонизатор

БЭМ — это методология эффективной разработки веб-приложений.
Большое количество информации размещено на официальном сайте [http://ru.bem.info](http://ru.bem.info).

Bemer — шаблонизатор, стремящийся идти по пути упрощения работы с БЭМ. Он должен быть очень удобным для разработки малых и средних проектов.

Исходный код шаблонизатора разделён на [подробно задокументированные модули](JSDOC) с помощью [definer](https://github.com/tenorok/definer).

**TODO: ссылка на jsdoc**

## Установка

	npm install bemer

**TODO: bower?**

## Подключение

### В браузере

```html
<script src="node_modules/bemer/release/bemer.min.js"></script>
```

### В Node.js

```js
var bemer = require('bemer');
```

## Форматы данных

### Входящие данные

Общепринятым форматом входящих данных для БЭМ-шаблонизаторов является [BEMJSON](http://ru.bem.info/libs/bem-core/2.2.0/templating/bemjson/#синтаксис-bemjson).

### Выходящие данные

На выходе bemer возвращает простую HTML-строку, готовую для отображения в браузере.

## Получение результата

Единственная переменная, которую предоставляет шаблонизатор — `bemer` и она является функцией, которая принимает на вход один параметр — объект в формате [BEMJSON](http://ru.bem.info/libs/bem-core/2.2.0/templating/bemjson/#синтаксис-bemjson).

```js
bemer({ block: 'page' });
```

В результате выполнения будет получена HTML-строка.

```html
<div class="page i-bem" data-bem="{&quot;page&quot;:{}}"></div>
```

## Методы

### Метод `match`

Предназначен для добавления шаблона на одну или несколько БЭМ-сущностей.

В качестве параметров принимает неограниченное количество селекторов на БЭМ-сущности и последним параметром простой объект с полями шаблона.

Возвращает `bemer`, что позволяет записывать цепочки вызовов.

```js
bemer.match('block1', 'block2', 'blockN', {});
```

#### Синтаксис селекторов

По умолчанию для отделения блока от элемента используется двойное подчёркивание: `block__element`.
А для отделения модификаторов одиночное подчёркивание: `block_mod_val`.

##### Примеры

Блок `header`:

	header

Элемент `logo` блока `header`:

	header__logo

Блок `header` с булевым модификатором `adaptive`:

	header_adaptive

Блок `header` с модификатором `theme` в значении `red`:

	header_theme_red

Элемент `logo` блока `header` с модификатором `theme` в значении `blue`:

	header_theme_blue__logo

Элемент `logo` с модификатором `size` в значении `s`:

	header__logo_size_s

Модификатор у блока и у элемента одновременно:

	header_adaptive__logo_size_m

На месте любой части селектора можно записать `*`, что будет означать произвольное значение.

##### Примеры со звёздочкой

Любой блок:

	*

Любой элемент блока `footer`:

	footer__*

Любое значение модификатора `theme` блока `footer`:

	footer_theme_*

Любое значение модификатора `size` любого элемента блока `footer`:

	footer__*_size_*

#### Синтаксис полей шаблона

Поля шаблона содержат информацию по шаблонизации.
В основе технической реализации лежит помощник создания классов [inherit](https://github.com/dfilatov/inherit).
Шаблон может иметь произвольный набор полей.

##### Стандартные поля шаблона

###### Поле `tag`

Тип: `string`

По умолчанию: `div`

Поле `tag` устанавливает имя тега.

Блок в представлении тега `span`:

```js
bemer.match('text', { tag: 'span' });
bemer({ block: 'text' });
```

```html
<span class="text i-bem" data-bem="{&quot;text&quot;:{}}"></span>
```

###### Поле `attrs`

Тип: `object`

По умолчанию: `{}`

Поле `attrs` задаёт атрибуты тега.

Блок текстового поля:

```js
bemer.match('input', { tag: 'input', attrs: { type: 'text' }});
bemer({ block: 'input' });
```

```html
<input class="input i-bem" type="text" data-bem="{&quot;input&quot;:{}}"/>
```

Атрибуты в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('input', { tag: 'input', attrs: { type: 'text' }});
bemer({ block: 'input', attrs: { placeholder: 'login' }});
```

```html
<input class="input i-bem" type="text" placeholder="login" data-bem="{&quot;input&quot;:{}}"/>
```

###### Поле `js`

Тип: `boolean` `object`

По умолчанию: для блока `true`, для элемента `false`

Поле `js` указывает на наличие клиентского JavaScript у блока или элемента.
При этом в результирующий HTML-тег добавляется:
* дополнительный CSS-класс, по умолчанию: `i-bem`
* атрибут с параметрами инициализации, по умолчанию: `data-bem`

Блок без JS-реализации:

```js
bemer.match('menu', { js: false });
bemer({ block: 'menu' });
```

```html
<div class="menu"></div>
```

Элемент с JS-реализацией:

```js
bemer.match('menu__item', { js: true });
bemer({ block: 'menu', elem: 'item' });
```

```html
<div class="menu__item i-bem" data-bem="{&quot;menu__item&quot;:{}}"></div>
```

Для передачи инициализационных параметров значением может быть простой объект.

Блок с параметрами инициализации:

```js
bemer.match('man', { js: { name: 'Steve', year: 1955 }});
bemer({ block: 'man' });
```

```html
<div class="man i-bem" data-bem="{&quot;man&quot;:{&quot;name&quot;:&quot;Steve&quot;,&quot;year&quot;:1955}}"></div>
```

###### Поле `bem`

Тип: `boolean`

По умолчанию: `true`

Поле `bem` указывает на необходимость добавления сформированных CSS-классов для БЭМ-сущности.

Тег `html` без JS-параметров и без БЭМ-классов:

```js
bemer.match('page', { tag: 'html', js: false, bem: false });
bemer({ block: 'page' });
```

```html
<html></html>
```

###### Поле `cls`

Тип: `string`

По умолчанию: `''`

Поле `cls` позволяет определить произвольную строку, добавляемую в значение атрибута `class` помимо автоматически генерируемых классов.

Добавление CSS-классов `custom1` и `custom2`:

```js
bemer.match('untypical', { cls: 'custom1 custom2' });
bemer({ block: 'untypical' });
```

```html
<div class="custom1 custom2 untypical i-bem" data-bem="{&quot;untypical&quot;:{}}"></div>
```

###### Поле `mods`

Тип: `object`

По умолчанию: `{}`

Поле `mods` задаёт модификаторы блока.

Блок `header` с модификатором `theme` в значении `red`:

```js
bemer.match('header', { mods: { theme: 'red' }});
bemer({ block: 'header' });
```

```html
<div class="header i-bem header_theme_red" data-bem="{&quot;header&quot;:{}}"></div>
```

Модификаторы в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('header', { mods: { theme: 'red' }});
bemer({ block: 'header', mods: { adaptive: true }});
```

```html
<div class="header i-bem header_theme_red header_adaptive" data-bem="{&quot;header&quot;:{}}"></div>
```

Элемент `logo` блока `header` с модификатором `theme` в значении `blue`:

```js
bemer.match('header__logo', { mods: { theme: 'blue' }});
bemer({ block: 'header', elem: 'logo' });
```

```html
<div class="header_theme_blue__logo"></div>
```

###### Поле `elemMods`

Тип: `object`

По умолчанию: `{}`

Поле `elemMods` задаёт модификаторы элемента.
Модификаторы в шаблоне и входящем BEMJSON складываются.

Элемент `logo` с модификатором `size` в значении `s`:

```js
bemer.match('header__logo', { elemMods: { size: 's' }});
bemer({ block: 'header', elem: 'logo' });
```

```html
<div class="header__logo header__logo_size_s"></div>
```
