# Bemer — БЭМ-шаблонизатор
[![bower](https://img.shields.io/bower/v/bemer.svg)](http://bower.io/search/?q=bemer)
[![npm](https://img.shields.io/npm/v/bemer.svg)](https://www.npmjs.com/package/bemer)
[![Build Status](https://img.shields.io/travis/tenorok/bemer/master.svg)](https://travis-ci.org/tenorok/bemer)
[![Coverage Status](https://img.shields.io/coveralls/tenorok/bemer/master.svg)](https://coveralls.io/r/tenorok/bemer)

БЭМ — это методология эффективной разработки веб-приложений.
Большое количество информации размещено на официальном сайте [http://ru.bem.info](http://ru.bem.info).

Bemer — шаблонизатор, стремящийся идти по пути упрощения работы с БЭМ. Он должен быть очень удобным для разработки малых и средних проектов.

Исходный код шаблонизатора разделён на [подробно задокументированные модули](http://tenorok.github.io/bemer/jsdoc/module-bemer-bemer.html) с помощью [definer](https://github.com/tenorok/definer).

Рекомендуется использовать bemer совместно с [i-bem](http://tenorok.github.io/get-i-bem/).

## Установка

Bemer доступен в [Bower](http://bower.io).

    bower install bemer

Bemer доступен в [NPM](https://www.npmjs.org).

    npm install bemer

## Подключение

### В браузере

```html
<script src="bower_components/bemer/bemer.min.js"></script>
```

### В Node.js

```js
var bemer = require('bemer');
```

## Форматы данных

### Входящие данные

Общепринятым форматом входящих данных для БЭМ-шаблонизаторов является [BEMJSON](http://ru.bem.info/technology/bemjson/2.3.0/bemjson/#Синтаксис-BEMJSON).

### Выходящие данные

На выходе bemer возвращает простую HTML-строку, готовую для отображения в браузере.

## Получение результата

Единственная переменная, предоставляемая шаблонизатором — `bemer` и она является функцией, которая принимает на вход один параметр — объект в формате [BEMJSON](http://ru.bem.info/technology/bemjson/2.3.0/bemjson/#Синтаксис-BEMJSON).

### Один блок

```js
bemer({ block: 'page' });
```

Результат:

```html
<div class="page"></div>
```

### Блок с элементами

```js
bemer({
    block: 'item',
    content: [
        { elem: 'title', content: 'Фотоаппарат' },
        { elem: 'price', content: '14999' }
    ]
});
```

Результат:

```html
<div class="item">
    <div class="item__title">Фотоаппарат</div>
    <div class="item__price">14999</div>
</div>
```

## Оглавление

- [Методы](#Методы)
  - [Метод `match`](#Метод-match)
    - [Синтаксис селекторов](#Синтаксис-селекторов)
      - [Примеры селекторов](#Примеры-селекторов)
      - [Примеры селекторов со звёздочкой](#Примеры-селекторов-со-звёздочкой)
    - [Синтаксис полей шаблона](#Синтаксис-полей-шаблона)
      - [Стандартные поля шаблона](#Стандартные-поля-шаблона)
        - [Поле `construct`](#Поле-construct)
        - [Поле `tag`](#Поле-tag)
        - [Поле `single`](#Поле-single)
        - [Поле `attrs`](#Поле-attrs)
        - [Поле `js`](#Поле-js)
        - [Поле `bem`](#Поле-bem)
        - [Поле `cls`](#Поле-cls)
        - [Поле `mods`](#Поле-mods)
        - [Поле `elemMods`](#Поле-elemmods)
        - [Поле `mix`](#Поле-mix)
        - [Поле `content`](#Поле-content)
        - [Поле `options`](#Поле-options)
      - [Функция в значении стандартного поля шаблона](#Функция-в-значении-стандартного-поля-шаблона)
        - [Параметр функции стандартного поля шаблона](#Параметр-функции-стандартного-поля-шаблона)
        - [Объект `this.bemjson`](#Объект-thisbemjson)
      - [Приоритеты в стандартных полях шаблона](#Приоритеты-в-стандартных-полях-шаблона)
        - [Примитивные типы](#Примитивные-типы)
        - [Массивы и объекты](#Массивы-и-объекты)
        - [Функции](#Функции)
      - [Произвольные поля шаблона](#Произвольные-поля-шаблона)
      - [Наследование шаблонов](#Наследование-шаблонов)
        - [Получение предыдущего значения поля через `this.__base`](#Получение-предыдущего-значения-поля-через-this__base)
  - [Метод `config`](#Метод-config)
    - [Изменение настроек шаблонизации](#Изменение-настроек-шаблонизации)
    - [Сброс настроек шаблонизации до стандартных](#Сброс-настроек-шаблонизации-до-стандартных)
  - [Метод `clean`](#Метод-clean)
  - [Метод `modules`](#Метод-modules)
  - [Метод `helper`](#Метод-helper)
    - [Добавление помощника](#Добавление-помощника)
- [Функции-помощники](#Функции-помощники)
  - [Помощники для работы с деревом](#Помощники-для-работы-с-деревом)
    - [Помощник `isFirst`](#Помощник-isfirst)
    - [Помощник `isLast`](#Помощник-islast)
    - [Помощник `isBlock`](#Помощник-isblock)
    - [Помощник `isElem`](#Помощник-iselem)
    - [Помощник `id`](#Помощник-id)
  - [Помощники для работы со строками](#Помощники-для-работы-со-строками)
    - [Помощник `escape`](#Помощник-escape)
    - [Помощник `unEscape`](#Помощник-unescape)
    - [Помощник `htmlEscape`](#Помощник-htmlescape)
    - [Помощник `unHtmlEscape`](#Помощник-unhtmlescape)
    - [Помощник `collapse`](#Помощник-collapse)
    - [Помощник `stripTags`](#Помощник-striptags)
    - [Помощник `upper`](#Помощник-upper)
    - [Помощник `lower`](#Помощник-lower)
    - [Помощник `repeat`](#Помощник-repeat)
  - [Помощники для работы с числами](#Помощники-для-работы-с-числами)
    - [Помощник `random`](#Помощник-random)
  - [Помощники для работы с объектами](#Помощники-для-работы-с-объектами)
    - [Помощник `extend`](#Помощник-extend)
    - [Помощник `deepExtend`](#Помощник-deepextend)
    - [Помощник `clone`](#Помощник-clone)
    - [Помощник `deepClone`](#Помощник-deepclone)
  - [Помощники для работы с типами данных](#Помощники-для-работы-с-типами-данных)
    - [Помощники для проверки на определённый тип данных](#Помощники-для-проверки-на-определённый-тип-данных)
    - [Помощник `is.type`](#Помощник-istype)
    - [Помощники для проверки чисел](#Помощники-для-проверки-чисел)
    - [Помощник `is.primitive`](#Помощник-isprimitive)
    - [Помощник `is.every`](#Помощник-isevery)

## Методы

### Метод `match`

Предназначен для добавления шаблона на одну или несколько БЭМ-сущностей.

В качестве параметров принимает неограниченное количество селекторов на БЭМ-сущности и последним параметром простой объект с полями шаблона.

Возвращает: `{bemer}`

```js
bemer.match('block1', 'block2', 'blockN', {});
```

#### Синтаксис селекторов

По умолчанию для отделения блока от элемента используется двойное подчёркивание: `block__element`.
А для отделения модификаторов одиночное подчёркивание: `block_mod_val`.

##### Примеры селекторов

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

##### Примеры селекторов со звёздочкой

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

###### Поле `construct`

Тип: `{function}`

Поле `construct` устанавливает конструктор, который вызывается в начале шаблонизации БЭМ-сущности.

Конструктор принимает два параметра:
* `{object}` `bemjson` — BEMJSON БЭМ-сущности
* `{object}` `data` — данные о БЭМ-сущности в дереве
    * `{number}` `data.index` — индекс сущности среди сестринских элементов
    * `{number}` `data.length` — количество сестринских элементов, включая текущий
    * `{object}` `[data.context]` — информация о контексте родительского блока
        * `{string}` `[data.context.block]` — имя родительского блока
        * `{object}` `[data.context.mods]` — модификаторы родительского блока
        * `{string}` `[data.context.elem]` — имя родительского элемента
        * `{object}` `[data.context.elemMods]` — модификаторы родительского элемента

Получение данных о блоке `menu` из параметров конструктора:

```js
bemer.match('menu', { construct: function(bemjson, data) {
    console.log('bemjson:', bemjson);
    console.log('data:', data);
}});
bemer({ block: 'menu' });
```

Вывод:

```js
bemjson: { block: 'menu' }
data: { index: 0, length: 1 }
```

Кроме того, в `this` существуют поля `bemjson` и `data`, аналогичные параметрам конструктора.

Получение данных об элементе `item` с булевым модификатором `active` из полей контекста:

```js
bemer.match('menu__item_active', { construct: function(bemjson, data) {
    console.log('bemjson:', this.bemjson);
    console.log('data:', this.data);
}});

bemer({ block: 'menu', content: [
    { elem: 'item' },
    { elem: 'item', elemMods: { active: true }},
    { elem: 'item' }
] });
```

Вывод:
```js
bemjson: {
    block: 'menu',
    mods: {},
    elem: 'item',
    elemMods: { active: true }
}
data: {
    index: 1,
    length: 3,
    context: {
        block: 'menu',
        mods: {}
    }
}
```

###### Поле `tag`

Тип: `{string}` `{boolean}`

По умолчанию: `div`

Поле `tag` устанавливает имя тега.

Блок в представлении тега `span`:

```js
bemer.match('text', { tag: 'span' });
bemer({ block: 'text' });
```

```html
<span class="text"></span>
```

Для указания стандартного тега `div` может быть использовано значение `true`.

Для отмены строкового представления тега используется значение `false`.
При этом вместо текущего тега будет представлено его содержимое:

```js
bemer.match('anonymous', { tag: false });
bemer({ block: 'anonymous', content: { block: 'inner' }});
```

```html
<div class="inner"></div>
```

###### Поле `single`

Тип: `{boolean}`

По умолчанию: `true` для [стандартных одиночных тегов](http://tenorok.github.io/bemer/jsdoc/module-Tag-Tag.html#singleTags)
и `false` для всех остальных

Поле `single` устанавливает одиночный или парный вид тега.

Блок в представлении частного одиночного тега `mytag`:

```js
bemer.match('my', { tag: 'mytag', single: true });
bemer({ block: 'my' });
```

```html
<mytag class="my">
```

###### Поле `attrs`

Тип: `{object}`

По умолчанию: `{}`

Поле `attrs` задаёт атрибуты тега.

Блок текстового поля:

```js
bemer.match('input', { tag: 'input', attrs: { type: 'text' }});
bemer({ block: 'input' });
```

```html
<input class="input" type="text">
```

Атрибуты в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('input', { tag: 'input', attrs: { type: 'text' }});
bemer({ block: 'input', attrs: { placeholder: 'login' }});
```

```html
<input class="input" type="text" placeholder="login">
```

**Особый атрибут `style`**

Помимо обычной строки, атрибут `style` способен принять список CSS-стилей в виде объекта.

Составные имена CSS-свойств допускается указывать как через минус (`text-align`),
так и в верблюжьей нотации (`textAlign`).
Если в значении свойства указано число (кроме нуля), ему добавляется единица измерения пикселя (`px`).

Список CSS-свойств в виде объекта:

```js
bemer.match('text', { attrs: { style: {
    width: 100,
    height: 0,
    'text-align': 'center',
    verticalAlign: 'top'
}}});
bemer({ block: 'text' });
```

```html
<div class="text" style="width:100px;height:0;text-align:center;vertical-align:top;"></div>
```

###### Поле `js`

Тип: `{boolean}` `{object}`

По умолчанию: `false`

Поле `js` указывает на наличие клиентского JavaScript у блока или элемента.
При этом в результирующий HTML-тег добавляется:
* дополнительный CSS-класс, по умолчанию: `i-bem`
* атрибут с параметрами инициализации, по умолчанию: `data-bem`

Блок с JS-реализацией:

```js
bemer.match('menu', { js: true });
bemer({ block: 'menu' });
```

```html
<div class="menu i-bem" data-bem="{&quot;menu&quot;:{}}"></div>
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

Тип: `{boolean}`

По умолчанию: `true`

Поле `bem` указывает на необходимость добавления сформированных CSS-классов для БЭМ-сущности.

Тег `html` без БЭМ-классов:

```js
bemer.match('page', { tag: 'html', bem: false });
bemer({ block: 'page' });
```

```html
<html></html>
```

###### Поле `cls`

Тип: `{string}`

По умолчанию: `''`

Поле `cls` позволяет определить произвольную строку, добавляемую в значение атрибута `class` помимо автоматически генерируемых классов.

Добавление CSS-классов `custom1` и `custom2`:

```js
bemer.match('untypical', { cls: 'custom1 custom2' });
bemer({ block: 'untypical' });
```

```html
<div class="custom1 custom2 untypical"></div>
```

###### Поле `mods`

Тип: `{object}`

По умолчанию: `{}`

Поле `mods` задаёт модификаторы блока.

Блок `header` с модификатором `theme` в значении `red`:

```js
bemer.match('header', { mods: { theme: 'red' }});
bemer({ block: 'header' });
```

```html
<div class="header header_theme_red"></div>
```

Модификаторы в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('header', { mods: { theme: 'red' }});
bemer({ block: 'header', mods: { adaptive: true }});
```

```html
<div class="header header_theme_red header_adaptive"></div>
```

Элемент `logo` блока `header` с модификатором `theme` в значении `blue`:

```js
bemer.match('header__logo', { mods: { theme: 'blue' }});
bemer({ block: 'header', elem: 'logo' });
```

```html
<div class="header__logo header_theme_blue__logo"></div>
```

**Особые значения модификаторов**

Помимо строк значением модификатора может быть `null`, `true` или число.
Значения `undefined` и `false` отменяют установку модификатора.

Пример различных типов значений модификаторов:
```js
bemer.match('example', { mods: {
    string: 'text',
    nil: null,
    yes: true,
    zero: 0,
    number: 5,
    undef: undefined,
    no: false
}});
bemer({ block: 'example' });
```

```html
<div class="example example_string_text example_nil_null example_yes example_zero_0 example_number_5"></div>
```

**Изменение списка модификаторов в шаблоне**

При изменении списка модификаторов автоматически накладываются подходящие шаблоны:
```js
bemer
  .match('button', { mods: { theme: 'normal' }})
  .match('button_theme_normal', { tag: 'span' });
bemer({ block: 'button' });
```

```html
<span class="button button_theme_normal"></span>
```

###### Поле `elemMods`

Тип: `{object}`

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

При изменении списка модификаторов автоматически накладываются подходящие шаблоны:
```js
bemer
  .match('button__label', { elemMods: { size: 'm' }})
  .match('button__label_size_m', { tag: 'label' });
bemer({ block: 'button', elem: 'label' });
```

```html
<label class="button__label button__label_size_m"></label>
```

###### Поле `mix`

Тип: `{array}`

По умолчанию: `[]`

Поле `mix` задаёт список БЭМ-сущностей, которые необходимо примешать к текущей сущности.
В результате примешивания добавляются CSS-классы и JS-параметры.

Примешивание блока `clearfix` к блоку `header`:

```js
bemer.match('header', { mix: [{ block: 'clearfix' }] });
bemer({ block: 'header' });
```

```html
<div class="header clearfix"></div>
```

Примешивание элемента `menu` с JS-параметрами:

```js
bemer.match('header', { mix: [{ elem: 'menu', js: { length: 10 }}] });
bemer({ block: 'header' });
```

```html
<div class="header i-bem header__menu" data-bem="{&quot;header__menu&quot;:{&quot;length&quot;:10}}"></div>
```

Примешиваемые сущности в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('header', { mix: [{ block: 'clearfix' }] });
bemer({ block: 'header', mix: [{ block: 'menu', elem: 'wrap' }] });
```

```html
<div class="header menu__wrap clearfix"></div>
```

###### Поле `content`

Тип: `{*}`

Поле `content` задаёт содержимое HTML-элемента.
Значением может быть произвольный тип данных, в том числе BEMJSON любого уровня вложенности.

Простая строка в содержимом блока `page`:

```js
bemer.match('page', { content: 'Hello world!' });
bemer({ block: 'page' });
```

```html
<div class="page">Hello world!</div>
```

Добавление блока `header` и элемента `footer` в содержимое блока `page`:

```js
bemer.match('page', { content: [
    { block: 'header' },
    { elem: 'footer' }
] });
bemer({ block: 'page' });
```

```html
<div class="page">
    <div class="header"></div>
    <div class="page__footer"></div>
</div>
```

###### Поле `options`

Тип: `{object}`

Поле `options` устанавливает опции выполнения шаблона,
с помощью которых можно переопределить [глобальные настройки](#Метод-config)
только для заданных сущностей.

Принимаемые параметры:

* `{boolean|object}` `[escape]` — флаг экранирования спецсимволов
  * `{boolean}` `[escape.content]` — флаг экранирования содержимого
  * `{boolean}` `[escape.attrs]` — флаг экранирования значений атрибутов

##### Функция в значении стандартного поля шаблона

В значении поля шаблона можно записывать функцию.

###### Параметр функции стандартного поля шаблона

Функция, указанная в значении стандартного поля шаблона принимает параметром значение одноимённого поля из BEMJSON и должна возвращать свой корректный тип данных.

Функция поля `tag` должна возвращать строку:

```js
bemer.match('bold', { tag: function(bemjsonTag) {
    if(bemjsonTag === 'span') {
        return 'b';
    }
}});
var any = bemer({ block: 'bold', tag: 'span' });
```

В результате у блока `bold` будет тег `b`:
```html
<b class="bold"></b>
```

###### Объект `this.bemjson`

Кроме параметра функции в стандартных полях шаблона, для получения значений из BEMJSON можно использовать объект `this.bemjson`.

Функция поля `content` может возвращать произвольный тип данных:

```js
bemer.match('header', { content: function() {
    return this.bemjson.content || 'Hello world!';
}});
bemer({ block: 'header' });
```

В содержимое блока `header` было установлено значение по умолчанию, так как в BEMJSON оно не было указано:

```html
<div class="header">Hello world!</div>
```

##### Приоритеты в стандартных полях шаблона

###### Примитивные типы

При одновременном указании примитивного типа в значении стандартного поля шаблона и в BEMJSON, приоритет отдаётся значению из BEMJSON.

Одновременное указание строки в значении поля BEMJSON и шаблона:

```js
bemer.match('text', { tag: 'span' });
bemer({ block: 'text', tag: 'b' });
```

Приоритет у BEMJSON, поэтому блоку `text` будет присвоен тег `b`:

```html
<b class="text"></b>
```

###### Массивы и объекты

При одновременном указании массива или объекта в значении стандартного поля шаблона и BEMJSON, значения будут складываться с приоритетом у BEMJSON.

Одновременное указание объекта атрибутов в значении поля BEMJSON и шаблона:

```js
bemer.match('input', { attrs: {
    type: 'text',
    name: 'age'
}});
var header = bemer({ block: 'input', attrs: { type: 'number' }});
```

Приоритет у BEMJSON, поэтому атрибуту `type` блока `input` будет присвоено значение `number`:

```html
<div class="input" type="number" name="age"></div>
```

###### Функции

В качестве значения стандартному полю шаблона можно указать функцию.
При этом вероятно, что значение возвращается на основе нелинейной логики, и возможно с использованием значения из BEMJSON.
Таким образом, у значения, возвращаемого функцией приоритет по отношению к BEMJSON.

Указание тега в функции шаблона и в BEMJSON одновременно:

```js
bemer.match('text', { tag: function() { return 'span'; }});
bemer({ block: 'text', tag: 'b' });
```

Приоритет у функции, поэтому блоку `text` будет присвоен тег `span`:

```html
<span class="text"></span>
```

##### Произвольные поля шаблона

Кроме стандартных полей можно задавать произвольные поля шаблона.
Они будут доступны в `this`.

Произвольное поле `sum` складывает два числа:

```js
bemer.match('sum', {
    content: function() {
        return this.sum(this.bemjson.a, this.bemjson.b);
    },
    sum: function(a, b) {
        return a + b;
    }
});
bemer({ block: 'sum', a: 3, b: 7 });
```

Сумма устанавливается в содержимое:

```html
<div class="sum">10</div>
```

##### Наследование шаблонов

По мере декларации поступающие шаблоны могут быть унаследованы от добавленных ранее.
Шаблонизатор делает это самостоятельно.

Декларация нескольких шаблонов на блок `input`:

```js
bemer
    .match('input', { js: true, tag: 'input' })
    .match('input', { attrs: { type: 'text' }})
    .match('input_inactive', { js: false });

bemer({ block: 'input', mods: { inactive: true }});
```

Результат совмещает в себе все указанные правила:

```html
<input class="input input_inactive" type="text">
```

Наследование производится только от шаблонов с более общими селекторами.
Например, шаблон на блок с модификатором будет унаследован от шаблона на одноимённый блок, но не наоборот.
Аналогичные правила от общего к частному действуют для шаблонов со звёздочками в селекторах.

Декларация элементов блока `header`:

```js
bemer
    .match('header__*', { tag: 'span' })
    .match('header__logo', { attrs: { title: 'logo' }})
    .match('header__logo_theme_*', { mix: [{ block: 'coloring' }] })
    .match('header__logo_theme_red', { content: '#fff' });

bemer({ block: 'header', elem: 'logo', elemMods: { theme: 'red' }});
```

Все шаблоны задекларированы в порядке от общего к частному, поэтому результат совмещает в себе все указанные правила:

```html
<span class="header__logo header__logo_theme_red coloring" title="logo">#fff</span>
```

###### Получение предыдущего значения поля через `this.__base`

При наследовании шаблонов есть возможность получить
предыдущее значение поля.

Блок `text` формирует своё содержимое по цепочке шаблонов:

```js
bemer
    .match('text', { content: 'Hello' })
    .match('text', { content: function() { return this.__base() + ' world'; }})
    .match('text', { content: function() { return this.__base() + '!'; }});

bemer({ block: 'text' });
```

В результате выполнения цепочки вызовов в содержимое устанавливается строка «Hello world!»:

```html
<div class="text">Hello world!</div>
```

### Метод `config`

Устанавливает настройки шаблонизации в соответствии с переданными параметрами или сбрасывает настройки до стандартных при вызове без параметров.

Метод принимает один необязательный параметр:

* `{object}` `[config]` — конфигурационные параметры
  * `{object}` `[config.delimiters]` — разделители имён
    * `{string}` `[config.delimiters.mod=_]` — разделитель блока и модификатора, элемента и модификатора, модификатора и значения
    * `{string}` `[config.delimiters.elem=__]` — разделитель блока и элемента
  * `{boolean|object}` `[config.xhtml=false]` — флаг формирования тегов в формате XHTML
    * `{boolean}` `[config.xhtml.repeatBooleanAttr=false]` — флаг автоповтора булева атрибута
    * `{boolean}` `[config.xhtml.closeSingleTag=false]` — флаг закрытия одиночного тега
  * `{boolean|object}` `[config.escape=true]` — флаг экранирования спецсимволов
    * `{boolean}` `[config.escape.content=true]` — флаг экранирования содержимого
    * `{boolean}` `[config.escape.attrs=true]` — флаг экранирования значений атрибутов
  * `{string}` `[config.tag=div]` — стандартное имя тега
  * `{string}` `[config.bemClass=i-bem]` — имя класса для js-инициализации
  * `{string}` `[config.bemAttr=data-bem]` — имя атрибута для хранения параметров инициализации
  * `{string}` `[config.idPrefix=i]` — префикс идентификаторов, формируемых помощником [id](#Помощник-id)

Возвращает: `{bemer}`

#### Изменение настроек шаблонизации

Изменение разделителей и стандартного имени тега:

```js
bemer
    .config({
        delimiters: {
            mod: '=',
            elem: '--'
        },
        tag: 'span'
    })
    .match('header--logo=size=s', { content: 'logo' });

bemer({ block: 'header', elem: 'logo', elemMods: { size: 's' }});
```

Результат работы шаблонизатора с изменёнными настройками:

```html
<span class="header--logo header--logo=size=s">logo</span>
```

#### Сброс настроек шаблонизации до стандартных

В продолжение предыдущего примера, если вызвать метод `config` без параметров, то все настройки сбросятся до стандартных и селекторы последующих шаблонов нужно будет записывать со стандартными разделителями:

```js
bemer
    .config()
    .match('header__logo_size_s', { attrs: { title: 'logo' }});

bemer({ block: 'header', elem: 'logo', elemMods: { size: 's' }});
```

Результат работы шаблонизатора со сброшенными до стандартных настройками:

```html
<span class="header__logo header__logo_size_s" title="logo">logo</span>
```

### Метод `clean`

Удаляет все задекларированные шаблоны и сбрасывает порядковый номер для формирования идентификаторов помощником [id](#Помощник-id).

Возвращает: `{bemer}`

Удаление шаблона на блок `name`:

```js
bemer
    .match('name', { tag: 'span' })
    .clean();

bemer({ block: 'name' })
```

Блоку `name` будет установлен тег `div`, потому что шаблон был удалён:

```html
<div class="name"></div>
```

### Метод `modules`

Шаблонизатор bemer состоит из самостоятельных модулей,
каждый из которых предназначен для выполнения собственных целей.

Имеющиеся модули достаточно абстрактные, благодаря чему могут быть использованы за пределами bemer:

* [`Tag`](http://tenorok.github.io/bemer/jsdoc/module-Tag-Tag.html) — работа с тегом
* [`Selector`](http://tenorok.github.io/bemer/jsdoc/module-Selector-Selector.html) — работа с БЭМ-селектором
* [`Node`](http://tenorok.github.io/bemer/jsdoc/module-Node-Node.html) — работа с БЭМ-узлом
* [`Match`](http://tenorok.github.io/bemer/jsdoc/module-Match-Match.html) — проверка БЭМ-узла на соответствие шаблону

Для получения вышеперечисленных модулей предназначен метод `modules`, который принимает один необязательный параметр:

* `{string}` `[name]` — имя модуля

Возвращает: `{object|*}` — все модули или один заданный модуль

Использование модуля `Selector`:

```js
var Selector = bemer.modules('Selector');

var header = new Selector('header_theme')
    .modVal('dark')
    .elem('logo')
    .elemMod('size', 's');

console.log(header.toString());
```

В консоль будет выведена строка:
```
header_theme_dark__logo_size_s
```

### Метод `helper`

В bemer существуют функции-помощники.
Это такие функции, которые доступны в `this` из всех шаблонов.
Помимо [стандартных помощников](#Функции-помощники) можно добавлять свои собственные с помощью метода `helper`.

Метод принимает два обязательных параметра:

* `{string}` `name` — имя помощника
* `{function}` `callback` — тело функции помощника

Возвращает: `{bemer}`

#### Добавление помощника

Добавление и использование помощника `multi`, который умножает два числа:

```js
bemer
    .helper('multi', function(a, b) {
        return a * b;
    })
    .match('header', {
        content: function(content) {
            return this.multi(content[0], content[1]);
        }
    });

bemer({ block: 'header', content: [4, 9] })
```

Произведение устанавливается в содержимое:

```html
<div class="header">36</div>
```

## Функции-помощники

Функции-помощники доступны в `this` из всех шаблонов.

Помимо стандартных помощников можно добавлять свои собственные с помощью [метода helper](#Метод-helper).

### Помощники для работы с деревом

#### Помощник `isFirst`

Проверяет на первый элемент среди сестринских.

Возвращает: `{boolean}`

#### Помощник `isLast`

Проверяет на последний элемент среди сестринских.

Возвращает: `{boolean}`

#### Помощник `isBlock`

Проверяет БЭМ-сущность на блок.

Возвращает: `{boolean}`

#### Помощник `isElem`

Проверяет БЭМ-сущность на элемент.

Возвращает: `{boolean}`

#### Помощник `id`

Формирует уникальное значение для HTML-атрибута `id`.

Результат состоит из префикса, соли в виде случайного четырёхзначного числа и итерируемого числа начиная с нуля: `i` + `6140` + `0`.

Соль необходима для сохранения уникальности идентификаторов при шаблонизации одновременно на клиенте и сервере.

Для абсолютной гарантии уникальности рекомендуется изменить префикс на клиенте или сервере.

Изменить префикс глобально можно с помощью [метода config](#Метод-config).

Изменить префикс для конкретного формируемого идентификатора можно через параметр помощника.

Параметры:

* `{string}` `[prefix=i]` — префикс для формируемого идентификатора, по умолчанию `i`

Возвращает: `{string}`

### Помощники для работы со строками

#### Помощник `escape`

Экранирует строку текста.

Предваряет дополнительным слешем: слеш, кавычки, символы перевода строки, каретки и табуляции.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `unEscape`

Деэкранирует строку текста.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `htmlEscape`

Экранирует HTML-строку.

Заменяет на HTML-сущности: амперсанд, угловые скобки и кавычки.

Содержимое экранируется автоматически для любой БЭМ-сущности.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `unHtmlEscape`

Деэкранирование HTML-строки.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `collapse`

Удаляет повторяющиеся пробелы.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `stripTags`

Вырезает HTML-теги.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `upper`

Переводит всю строку, заданный символ или промежуток символов в верхний регистр.

Параметры:

* `{string}` `string` — строка
* `{number}` `[indexA]` — порядковый номер символа
* `{number}` `[indexB]` — порядковый номер символа для указания промежутка

Возвращает: `{string}`

#### Помощник `lower`

Переводит всю строку, заданный символ или промежуток символов в нижний регистр.

Параметры:

* `{string}` `string` — строка
* `{number}` `[indexA]` — порядковый номер символа
* `{number}` `[indexB]` — порядковый номер символа для указания промежутка

Возвращает: `{string}`

#### Помощник `repeat`

Повторяет строку заданное количество раз с указанным разделителем

Параметры:

* `{string}` `string` — строка
* `{number}` `n` — количество повторений
* `{string}` `[separator]` — разделитель, по умолчанию отсутствует

Возвращает: `{string}`

### Помощники для работы с числами

#### Помощник `random`

Возвращает случайное число.

При вызове без аргументов возвращает случайное дробное число от 0 до 1.

При вызове с указанием минимума и максимума возвращает дробное число из этого промежутка.

При вызове со всеми тремя аргументами возвращает число из заданного промежутка, делящееся без остатка на указанный шаг.

Параметры:

* `{number}` `[min]` — минимум
* `{number}` `[max]` — максимум
* `{number}` `[step]` — шаг

Возвращает: `{number}`

### Помощники для работы с объектами

#### Помощник `extend`

Расширяет объект.

Параметры:

* `{object}` `object` — расширяемый объект
* `{...object}` `source` — расширяющие объекты в любом количестве

Возвращает: `{object}`

#### Помощник `deepExtend`

Расширяет объект рекурсивно.

Параметры:

* `{object}` `object` — расширяемый объект
* `{...object}` `source` — расширяющие объекты в любом количестве

Возвращает: `{object}`

#### Помощник `clone`

Клонирует объект.

Параметры:

* `{object}` `object` — клонируемый объект

Возвращает: `{object}`

#### Помощник `deepClone`

Клонирует объект рекурсивно.

Параметры:

* `{object}` `object` — клонируемый объект

Возвращает: `{object}`

### Помощники для работы с типами данных

Каждый из этих помощников принимает неограниченное количество параметров.

#### Помощники для проверки на определённый тип данных

Если все переданные параметры принадлежат типу данных, на который осуществляется проверка, помощники возвращают `true`, иначе `false`.

Параметры:

* `{...*}` `subject` — параметры

Возвращают: `{boolean}`

Список помощников для проверки на определённый тип данных:

* `is.string` — строка
* `is.number` — число
* `is.nan` — NaN
* `is.boolean` — логический тип
* `is.null` — null
* `is.undefined` — undefined
* `is.date` — дата
* `is.regexp` — регулярное выражение
* `is.array` — массив
* `is.map` — простой объект (хэш, карта)
* `is.argument` — аргументы функции
* `is.function` — функция
* `is.native` — системная функция

#### Помощник `is.type`

Определяет тип переданных параметров.

Возвращает строку, соответствующую имени одного из помощников для проверки на определённый тип данных, которые перечислены выше.

Возвращает `mixed`, если были переданы параметры разных типов данных.

Параметры:

* `{...*}` `subject` — параметры

Возвращает: `{string}`

#### Помощники для проверки чисел

Проверяют параметры на число определённого вида.

Параметры:

* `{...*}` `subject` — параметры

Возвращают: `{boolean}`

Список помощников для проверки чисел:

* `is.integer` — целое число
* `is.float` — дробное число

#### Помощник `is.primitive`

Проверяет параметры на примитивные типы данных.

В примитивные типы входят: string, number, NaN, boolean, null, undefined.

Параметры:

* `{...*}` `subject` — параметры

Возвращает: `{boolean}`

#### Помощник `is.every`

Проверяет параметры на единый тип данных.

Возвращает `true`, если все переданные параметры относятся к одному типу данных, иначе `false`.

Параметры:

* `{...*}` `subject` — параметры

Возвращает: `{boolean}`
