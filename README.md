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

Единственная переменная, предоставляемая шаблонизатором — `bemer` и она является функцией, которая принимает на вход один параметр — объект в формате [BEMJSON](http://ru.bem.info/libs/bem-core/2.2.0/templating/bemjson/#синтаксис-bemjson).

### Один блок

```js
bemer({ block: 'page' });
```

Результат:

```html
<div class="page i-bem" data-bem="{&quot;page&quot;:{}}"></div>
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
<div class="item i-bem" data-bem="{&quot;item&quot;:{}}">
    <div class="item__title">Фотоаппарат</div>
    <div class="item__price">14999</div>
</div>
```

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
    * `{object}` `data.context` — контекст блока доступен только в элементах
        * `{string}` `data.context.block` — имя блока, которому принадлежит элемент
        * `{object}` `data.context.mods` — модификаторы блока, которому принадлежит элемент

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

Тип: `{string}`

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

Тип: `{object}`

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

Тип: `{boolean}` `{object}`

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

Тип: `{boolean}`

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

Тип: `{string}`

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

Тип: `{object}`

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
<div class="header i-bem clearfix" data-bem="{&quot;header&quot;:{}}"></div>
```

Примешивание блока `menu` с JS-параметрами:

```js
bemer.match('header', { mix: [{ block: 'menu', js: { length: 10 }}] });
bemer({ block: 'header' });
```

```html
<div class="header i-bem menu" data-bem="{&quot;header&quot;:{},&quot;menu&quot;:{&quot;length&quot;:10}}"></div>
```

Примешиваемые сущности в шаблоне и входящем BEMJSON складываются:

```js
bemer.match('header', { mix: [{ block: 'clearfix' }] });
bemer({ block: 'header', mix: [{ block: 'menu', elem: 'wrap' }] });
```

```html
<div class="header i-bem menu__wrap clearfix" data-bem="{&quot;header&quot;:{}}"></div>
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
<div class="page i-bem" data-bem="{&quot;page&quot;:{}}">Hello world!</div>
```

Добавление блоков `header` и `footer` в содержимое блока `page`:

```js
bemer.match('page', { content: [
    { block: 'header' },
    { block: 'footer' }
] });
bemer({ block: 'page' });
```

```html
<div class="page i-bem" data-bem="{&quot;page&quot;:{}}">
    <div class="header i-bem" data-bem="{&quot;header&quot;:{}}"></div>
    <div class="footer i-bem" data-bem="{&quot;footer&quot;:{}}"></div>
</div>
```

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
<b class="bold i-bem" data-bem="{&quot;bold&quot;:{}}"></b>
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
<div class="header i-bem" data-bem="{&quot;header&quot;:{}}">Hello world!</div>
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
<b class="text i-bem" data-bem="{&quot;text&quot;:{}}"></b>
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
<div class="input i-bem" type="number" name="age" data-bem="{&quot;input&quot;:{}}"></div>
```

###### Функции

В качестве значения стандартному полю шаблона можно указать функцию.
При этом вероятно, что значение возвращается на основе нелинейной логики, и возможно с использованием значения из BEMJSON.
Таким образом, у значения, возвращаемого функцией приоритет по отношению к BEMJSON.

Массивы и объекты так же складываются с приоритетом функции.

Указание тега в функции шаблона и в BEMJSON одновременно:

```js
bemer.match('text', { tag: function() { return 'span'; }});
bemer({ block: 'text', tag: 'b' });
```

Приоритет у функции, поэтому блоку `text` будет присвоен тег `span`:

```html
<span class="text i-bem" data-bem="{&quot;text&quot;:{}}"></span>
```

##### Произвольные поля шаблона

Кроме стандартных полей можно задавать произволные поля шаблона.
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
<div class="sum i-bem" data-bem="{&quot;sum&quot;:{}}">10</div>
```

##### Наследование шаблонов

По мере декларации поступающие шаблоны могут быть унаследованы от добавленных ранее.
Шаблонизатор делает это самостоятельно.

Декларация нескольких шаблонов на блок `input`:

```js
bemer
    .match('input', { tag: 'input' })
    .match('input', { attrs: { type: 'text' }})
    .match('input_inactive', { js: false });

bemer({ block: 'input', mods: { inactive: true }});
```

Результат совмещает в себе все указанные правила:

```html
<input class="input input_inactive" type="text"/>
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

###### Обращение к родительскому методу через `this.__base`

При декларации функций на одно поле в нескольких шаблонах становится доступен вызов базовой реализации метода.

Блок `text` формирует своё содержимое по цепочке шаблонов:

```js
bemer
    .match('text', { content: function() { return 'Hello'; }})
    .match('text', { content: function() { return this.__base() + ' world'; }})
    .match('text', { content: function() { return this.__base() + '!'; }});

bemer({ block: 'text' });
```

В результате выполнения цепочки вызовов в содержимое устанавливается строка «Hello world!»:

```html
<div class="text i-bem" data-bem="{&quot;text&quot;:{}}">Hello world!</div>
```

### Метод `config`

Устанавливает настройки шаблонизации в соответствии с переданными параметрами или сбрасывает настройки до стандартных при вызове без параметров.

Метод принимает один необязательный параметр:

* `{object}` `[config]` — конфигурационные параметры
  * `{object}` `[config.delimiters]` — разделители имён
    * `{string}` `[config.delimiters.mod=_]` — разделитель блока и модификатора, элемента и модификатора, модификатора и значения
    * `{string}` `[config.delimiters.elem=__]` — разделитель блока и элемента
  * `{string}` `[config.tag=div]` — стандартное имя тега
  * `{string}` `[config.bemClass=i-bem]` — имя класса для js-инициализации
  * `{string}` `[config.bemAttr=data-bem]` — имя атрибута для хранения параметров инициализации
  * `{string}` `[config.idPrefix=i]` — префикс идентификаторов, формируемых помощником [id]()

**TODO: ссылка на хелпер id**

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

Удаляет все задекларированные шаблоны и сбрасывает порядковый номер для формирования идентификаторов помощником [id]().

**TODO: ссылка на хелпер id**

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
<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>
```

### Метод `helper`

В bemer существуют функции-помощники.
Это такие функции, которые доступны в `this` из всех шаблонов.
Помимо [стандартных помощников]() можно добавлять свои собственные с помощью метода `helper`.

**TODO: добавить ссылку на помощников**

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
<div class="header i-bem" data-bem="{&quot;header&quot;:{}}">36</div>
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
Результат состоит из префикса и итерируемого числа начиная с нуля.

Примеры идентификаторов: `i0`, `i1` ... `iN`

Изменить префикс глобально можно с помощью [метода config](#Метод-config).

Изменить префикс для конкретного формируемого идентификатора можно через параметр помощника.

Параметры:

* `{string}` `[prefix=i]` — префикс для формируемого идентификатора, по умолчанию `i`

Возвращает: `{string}`

### Помощники для работы со строками

#### Помощник `escape`

Экранирует строку текста.

Предваряет дополнительным слешом: слеш, кавычки, символы перевода строки, каретки и табуляции.

Параметры:

* `{string}` `string` — строка

Возвращает: `{string}`

#### Помощник `htmlEscape`

Экранирует HTML-строку.

Заменяет на HTML-сущности: амперсанд, угловые скобки и кавычки.

Содержимое, представленное в виде простой строки, экранируется автоматически для любой БЭМ-сущности.

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

Переводит всю строку или заданный символ в верхний регистр.

Параметры:

* `{string}` `string` — строка
* `{number}` `[index]` — порядковый номер символа

Возвращает: `{string}`

#### Помощник `lower`

Переводит всю строку или заданный символ в нижний регистр.

Параметры:

* `{string}` `string` — строка
* `{number}` `[index]` — порядковый номер символа

Возвращает: `{string}`

#### Помощник `repeat`

Повторяет строку заданное количество раз с указанным разделителем

Параметры:

* `{string}` `string` — строка
* `{number}` `n` — количество повторений
* `{string}` `[separator]` — разделитель, по умолчанию отсутствует

Возвращает: `{string}`

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

* `{...subject}` `subject` — параметры

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

Возвращает строку, соответствущую имени одного из помощников для проверки на определённый тип данных, которые перечислены выше.

Возвращает `mixed`, если были переданы параметры разных типов данных.

Параметры:

* `{...subject}` `subject` — параметры

Возвращает: `{string}`


#### Помощник `is.primitive`

Проверяет параметры на примитивные типы данных.

В примитивные типы входят: string, number, NaN, boolean, null, undefined.

Параметры:

* `{...subject}` `subject` — параметры

Возвращает: `{boolean}`

#### Помощник `is.every`

Проверяет параметры на единый тип данных.

Возвращает `true`, если все переданные параметры относятся к одному типу данных, иначе `false`.

Параметры:

* `{...subject}` `subject` — параметры

Возвращает: `{boolean}`
