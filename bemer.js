(function(undefined) {
var exports = undefined, modules = undefined, define = undefined;
/**
 * @module inherit
 * @version 2.1.0
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

(function(global) {

var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
    emptyBase = function() {},
    hasOwnProperty = Object.prototype.hasOwnProperty,
    objCreate = Object.create || function(ptp) {
        var inheritance = function() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
    objKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            hasOwnProperty.call(obj, i) && res.push(i);
        }
        return res;
    },
    extend = function(o1, o2) {
        for(var i in o2) {
            hasOwnProperty.call(o2, i) && (o1[i] = o2[i]);
        }

        return o1;
    },
    toStr = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === '[object Array]';
    },
    isFunction = function(obj) {
        return toStr.call(obj) === '[object Function]';
    },
    noOp = function() {},
    needCheckProps = true,
    testPropObj = { toString : '' };

for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
    testPropObj.hasOwnProperty(i) && (needCheckProps = false);
}

var specProps = needCheckProps? ['toString', 'valueOf'] : null;

function getPropList(obj) {
    var res = objKeys(obj);
    if(needCheckProps) {
        var specProp, i = 0;
        while(specProp = specProps[i++]) {
            obj.hasOwnProperty(specProp) && res.push(specProp);
        }
    }

    return res;
}

function override(base, res, add) {
    var addList = getPropList(add),
        j = 0, len = addList.length,
        name, prop;
    while(j < len) {
        if((name = addList[j++]) === '__self') {
            continue;
        }
        prop = add[name];
        if(isFunction(prop) &&
                (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
            res[name] = (function(name, prop) {
                var baseMethod = base[name] || noOp;
                return function() {
                    var baseSaved = this.__base;
                    this.__base = baseMethod;
                    var res = prop.apply(this, arguments);
                    this.__base = baseSaved;
                    return res;
                };
            })(name, prop);
        } else {
            res[name] = prop;
        }
    }
}

function applyMixins(mixins, res) {
    var i = 1, mixin;
    while(mixin = mixins[i++]) {
        res?
            isFunction(mixin)?
                inherit.self(res, mixin.prototype, mixin) :
                inherit.self(res, mixin) :
            res = isFunction(mixin)?
                inherit(mixins[0], mixin.prototype, mixin) :
                inherit(mixins[0], mixin);
    }
    return res || mixins[0];
}

function inherit() {
    var args = arguments,
        withMixins = isArray(args[0]),
        hasBase = withMixins || isFunction(args[0]),
        base = hasBase? withMixins? applyMixins(args[0]) : args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        res = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } :
            function() {};

    if(!hasBase) {
        res.prototype = props;
        res.prototype.__self = res.prototype.constructor = res;
        return extend(res, staticProps);
    }

    extend(res, base);

    var basePtp = base.prototype,
        resPtp = res.prototype = objCreate(basePtp);

    resPtp.__self = resPtp.constructor = res;

    props && override(basePtp, resPtp, props);
    staticProps && override(base, res, staticProps);

    return res;
}

inherit.self = function() {
    var args = arguments,
        withMixins = isArray(args[0]),
        base = withMixins? applyMixins(args[0], args[0][0]) : args[0],
        props = args[1],
        staticProps = args[2],
        basePtp = base.prototype;

    props && override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;
};

var defineAsGlobal = true;
if(typeof exports === 'object') {
    module.exports = inherit;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('inherit', function(provide) {
        provide(inherit);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = inherit;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.inherit = inherit);

})(this);
}).call(this);
/*!
 * @file Template engine. BEMJSON to HTML processor.
 * @copyright 2014 Artem Kurbatov, tenorok.ru
 * @license MIT license
 * @version 0.4.3
 * @date 24 August 2014
 */
(function(global, undefined) {
var definer = {
export: function(key, value) { return typeof exports === "object" ? module.exports[key] = value : global[key] = value; }
};
var inherit = global.inherit,
is = (function () {

    /**
     * Модуль работы с типами данных.
     *
     * @class
     */
    function is() {}

    /**
     * Строковое представление классов типов данных.
     *
     * @type {object}
     */
    is.class = {
        string: '[object String]',
        number: '[object Number]',
        boolean: '[object Boolean]',
        array: '[object Array]',
        object: '[object Object]',
        func: '[object Function]',
        date: '[object Date]',
        regexp: '[object RegExp]',
        arguments: '[object Arguments]',
        error: '[object Error]'
    };

    /**
     * Нативный метод приведения к строковому представлению.
     *
     * @type {function}
     */
    is.toString = Object.prototype.toString;

    /**
     * Регулярное выражение для проверки функции на нативную.
     *
     * @type {regexp}
     */
    is.reNative = RegExp('^' +
        String(is.toString)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /**
     * Проверить параметры на строку.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.string = function(subject) {
        return is._primitive(arguments, 'string');
    };

    /**
     * Проверить параметры на число.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.number = function(subject) {
        return !is.nan.apply(this, arguments) && is._primitive(arguments, 'number');
    };

    /**
     * Проверить параметры на целое число.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.integer = function(subject) {
        return is.number.apply(this, arguments) && is._every(arguments, function() {
            return this % 1 === 0;
        });
    };

    /**
     * Проверить параметры на дробное число.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.float = function(subject) {
        return is.number.apply(this, arguments) && is._every(arguments, function() {
            return this % 1 !== 0;
        });
    };

    /**
     * Проверить параметры на NaN.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.nan = function(subject) {
        return is._every(arguments, function(n) {
            return typeof n === 'number' && isNaN(n) && !is.undefined(n);
        });
    };

    /**
     * Проверить параметры на логический тип.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.boolean = function(subject) {
        return is._primitive(arguments, 'boolean');
    };

    /**
     * Проверить параметры на null.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.null = function(subject) {
        return is._every(arguments, function(n) {
            return n === null;
        });
    };

    /**
     * Проверить параметры на undefined.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.undefined = function(subject) {
        return is._every(arguments, function(u) {
            return typeof u === 'undefined';
        });
    };

    /**
     * Проверить параметры на примитив.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.primitive = function(subject) {
        return is._every(arguments, function(p) {
            return is.string(p) || is.number(p) || is.nan(p) || is.boolean(p) || is.null(p) || is.undefined(p);
        });
    };

    /**
     * Проверить параметры на массив.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.array = function(subject) {
        return is._every(arguments, function() {
            return Array.isArray(this);
        });
    };

    /**
     * Проверить параметры на аргументы.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.argument = function(subject) {
        return is._every(arguments, function() {
            return typeof this === 'object' && typeof this.length === 'number' &&
                is._isToString(this, 'arguments') || false;
        });
    };

    /**
     * Проверить параметры на функцию.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.function = function(subject) {
        return is._every(arguments, function() {
            return typeof this === 'function';
        });
    };

    /**
     * Проверить параметры на нативную функцию.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.native = function(subject) {
        return is._every(arguments, function() {
            return is.function(this) && is.reNative.test(this);
        });
    };

    /**
     * Проверить параметры на простой объект (хэш/карту).
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.map = function(subject) {
        return is._every(arguments, function() {
            if(!is._isToString(this, 'object') || is.argument(this)) {
                return false;
            }

            if(is.native(this.valueOf)) {
                var protoOfValueOf = Object.getPrototypeOf(this.valueOf);
                if(protoOfValueOf) {
                    var protoOfprotoOfValueOf = Object.getPrototypeOf(protoOfValueOf);
                    if(protoOfprotoOfValueOf) {
                        return this === protoOfprotoOfValueOf || Object.getPrototypeOf(this) === protoOfprotoOfValueOf;
                    }
                }
            }

            var last;
            for(var i in this) { last = i; }
            return is.undefined(last) || this.hasOwnProperty(last);
        });
    };

    /**
     * Проверить параметры на дату.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.date = function(subject) {
        return is._every(arguments, function() {
            return typeof this === 'object' && is._isToString(this, 'date') || false;
        });
    };

    /**
     * Проверить параметры на регулярное выражение.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.regexp = function(subject) {
        return is._every(arguments, function() {
            return (is.function(this) || typeof this === 'object') && is._isToString(this, 'regexp') || false;
        });
    };

    /**
     * Узнать тип параметров.
     *
     * Для параметров различных типов данных
     * будет возвращён `mixed`.
     *
     * @param {...*} subject Параметры
     * @returns {string}
     */
    is.type = function(subject) {
        var args = arguments,
            firstType;

        ['string', 'number', 'nan', 'boolean', 'null', 'undefined', 'array',
         'argument', 'native', 'function', 'map', 'date', 'regexp'].some(function(type) {
            if(is[type](args[0])) {
                firstType = type;
                return true;
            } else {
                return false;
            }
        });

        return is._every(args, function(that) {
            return is[firstType](that);
        }) ? firstType : 'mixed';
    };

    /**
     * Проверить параметры на единый тип данных.
     *
     * @param {...*} subject Параметры
     * @returns {boolean}
     */
    is.every = function(subject) {
        return is.type.apply(this, arguments) !== 'mixed';
    };

    /**
     * Проверить параметры на указанный примитивный тип данных.
     *
     * @private
     * @param {arguments} args Аргументы базового метода
     * @param {string} type Тип данных для проверки
     * @returns {boolean}
     */
    is._primitive = function(args, type) {
        return is._every(args, function() {
            return typeof this === type || typeof this === 'object' && is._isToString(this, type) || false;
        });
    };

    /**
     * Запустить цикл `every` по аргументам функции.
     *
     * @private
     * @param {arguments} args Аргументы
     * @param {is~everyCallback} callback Колбек
     * @returns {boolean}
     */
    is._every = function(args, callback) {
        return Object.keys(args).every(function(arg) {
            return callback.call(args[arg], args[arg]);
        });
    };

    /**
     * Колбек вызывается для каждого аргумента функции
     * в переборе через `every` методом `is._every`.
     *
     * Колбек должен вернуть логическое значение
     * для прерывания или продолжения выполнения цикла.
     *
     * @callback is~everyCallback
     * @this {*} subject Аргумент
     * @param {*} subject Аргумент
     * @returns {boolean}
     */

    /**
     * Проверить строковое представление объекта
     * на заданный класс типа данных.
     *
     * @private
     * @param {subject} subject Объект
     * @param {string} type Имя класса типа данных
     * @returns {boolean}
     */
    is._isToString = function(subject, type) {
        return is.toString.call(subject) === is.class[type];
    };

    return is;

}).call(global),
string = (function (is) {

    /**
     * Модуль работы со строками.
     *
     * @class
     */
    function string() {}

    /**
     * Заэкранировать строку текста.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.escape = function(string) {
        var stringEscapes = {
            '\\': '\\',
            '"': '"',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        return string.replace(/["'\n\r\t\u2028\u2029\\]/g, function(match) {
            return '\\' + stringEscapes[match];
        });
    };

    /**
     * Заэкранировать html-строку.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.htmlEscape = function(string) {
        var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
        };

        return string.replace(/[&<>"']/g, function(match) {
            return htmlEscapes[match];
        });
    };

    /**
     * Деэкранировать html-строку.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.unHtmlEscape = function(string) {
        var htmlEscapes = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': '\''
        };

        return string.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function(match) {
            return htmlEscapes[match];
        });
    };

    /**
     * Удалить повторяющиеся пробелы.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.collapse = function(string) {
        return string.replace(/\s+/g, ' ');
    };

    /**
     * Удалить HTML-теги.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.stripTags = function(string) {
        return string.replace(/<\/?[^>]+>/gi, '');
    };

    /**
     * Перевести строку или заданный символ в верхний регистр.
     *
     * @param {string} string Строка
     * @param {number} [index] Порядковый номер символа
     * @returns {string}
     */
    string.upper = function(string, index) {
        return this._changeCase('toUpperCase', string, index);
    };

    /**
     * Перевести строку или заданный символ в нижний регистр.
     *
     * @param {string} string Строка
     * @param {number} [index] Порядковый номер символа
     * @returns {string}
     */
    string.lower = function(string, index) {
        return this._changeCase('toLowerCase', string, index);
    };

    /**
     * Перевести строку или заданный символ в указанный регистр.
     *
     * @private
     * @param {string} method Имя метода для смены регистра
     * @param {string} string Строка
     * @param {number} [index] Порядковый номер символа
     * @returns {string}
     */
    string._changeCase = function(method, string, index) {
        if(is.undefined(index)) {
            return string[method]();
        }
        return string.slice(0, index) +
            string.charAt(index)[method]() +
            string.slice(index + 1);
    };

    /**
     * Повторить строку заданное количество раз с указанным разделителем.
     *
     *
     * @param {string} string Строка
     * @param {number} n Количество повторений
     * @param {string} [separator] Разделитель
     * @returns {string}
     */
    string.repeat = function(string, n, separator) {
        separator = separator || '';
        return new Array(n + 1).join(separator + string).slice(separator.length);
    };

    return string;

}).call(global, is),
number = (function (is) {

    /**
     * Модуль работы с числами.
     *
     * @class
     */
    function number() {}

    /**
     * Получить случайное число.
     *
     * При вызове без аргументов возвращает
     * случайное дробное число от 0 до 1.
     *
     * При вызове с указанием минимума и максимума
     * возвращает дробное число из этого промежутка.
     *
     * При вызове со всеми тремя аргументами возвращает
     * дробное число из заданного промежутка,
     * делящееся без остатка на указанный шаг.
     *
     * @param {number} [min] Минимум
     * @param {number} [max] Максимум
     * @param {number} [step] Шаг
     * @returns {number}
     */
    number.random = function(min, max, step) {

        if(is.undefined(min) && is.undefined(max)) {
            return Math.random();
        }

        if(is.undefined(step)) {
            return Math.random() * (max - min) + min;
        }

        return (Math.floor(Math.random() * (max - min) / step) * step) + min;
    };

    return number;

}).call(global, is),
object = (function (is) {

    /**
     * Модуль работы с объектами.
     *
     * @class
     */
    function object() {}

    /**
     * Расширить объект.
     *
     * @param {object} object Расширяемый объект
     * @param {...object} source Расширяющие объекты
     * @returns {object}
     */
    object.extend = function(object, source) {
        return [].slice.call(arguments, 1).reduce(function(object, source) {
            return Object.keys(source).reduce(function(extended, key) {
                extended[key] = source[key];
                return extended;
            }, object);
        }, object);
    };

    /**
     * Расширить объект рекурсивно.
     *
     * @param {object} obj Расширяемый объект
     * @param {...object} source Расширяющие объекты
     * @returns {object}
     */
    object.deepExtend = function(obj, source) {
        return [].slice.call(arguments, 1).reduce(function(object, source) {
            return Object.keys(source).reduce(function(extended, key) {
                var extendedItem = extended[key],
                    sourceItem = source[key],
                    isMapSourceItem = is.map(sourceItem);

                if(is.map(extendedItem) && isMapSourceItem) {
                    extended[key] = this.deepExtend(extendedItem, sourceItem);
                } else if(isMapSourceItem) {
                    extended[key] = object.clone(sourceItem);
                } else {
                    extended[key] = sourceItem;
                }

                return extended;
            }.bind(this), obj);
        }.bind(this), object);
    };

    /**
     * Проверить объект на наличие полей.
     *
     * @param {object} object Объект
     * @returns {boolean}
     */
    object.isEmpty = function(object) {
        return !Object.keys(object || {}).length;
    };

    /**
     * Клонировать объект.
     *
     * @param {object} obj Объект
     * @returns {object}
     */
    object.clone = function(obj) {
        return object.extend({}, obj);
    };

    /**
     * Клонировать объект рекурсивно.
     *
     * @param {object} obj Объект
     * @returns {object}
     */
    object.deepClone = function(obj) {
        return object.deepExtend({}, obj);
    };

    return object;

}).call(global, is),
Helpers = (function (string, number, object, is) {

    /**
     * Модуль функций-помощников.
     *
     * @constructor
     */
    function Helpers() {

        /**
         * Пользовательские функции-помощники.
         *
         * @private
         * @type {object}
         */
        this._custom = {};
    }

    /**
     * Префикс для формируемых идентификаторов.
     *
     * @type {string}
     */
    Helpers.idPrefix = 'i';

    /**
     * Соль для формируемых идентификаторов.
     *
     * Формируется один раз для экземпляра `bemer`.
     * Актуально при шаблонизации на клиенте и сервере одновременно.
     *
     * @type {number}
     */
    Helpers.idSalt = number.random(1000, 9999, 1);

    /**
     * Порядковый номер для формирования идентификаторов.
     *
     * @private
     * @type {number}
     */
    Helpers._id = 0;

    /**
     * Сбросить порядковый номер для формирования идентификаторов.
     *
     * @returns {Helpers}
     */
    Helpers.resetId = function() {
        Helpers._id = 0;
        return Helpers;
    };

    Helpers.prototype = {

        /**
         * Получить все функции-помощники.
         *
         * @returns {object}
         */
        get: function() {
            return object.extend(this._getConstructor(), this._getHelpers(), this._custom);
        },

        /**
         * Добавить пользовательскую функцию-помощник.
         *
         * @param {string} name Имя функции
         * @param {function} callback Тело функции
         * @returns {Helpers}
         */
        add: function(name, callback) {
            this._custom[name] = callback;
            return this;
        },

        /**
         * Получить внутренний и внешний конструкторы.
         *
         * @private
         * @returns {object}
         */
        _getConstructor: function() {
            return {

                /**
                 * Внутренний конструктор.
                 *
                 * @private
                 * @param {object} bemjson BEMJSON заматченной сущности
                 * @param {object} [data] Данные по сущности в дереве
                 * @param {number} [data.index=0] Индекс сущности среди сестринских элементов
                 * @param {number} [data.length=1] Количество сестринских элементов, включая текущий
                 */
                __constructor: function(bemjson, data) {
                    this.bemjson = bemjson;
                    this.data = object.extend({
                        index: 0,
                        length: 1
                    }, data || {});
                    this.construct.call(this, bemjson, this.data);
                },

                /**
                 * Внешний конструктор.
                 *
                 * @param {object} bemjson BEMJSON заматченной сущности
                 * @param {object} [data] Данные по сущности в дереве
                 */
                construct: function(bemjson, data) {}
            };
        },

        /**
         * Получить базовые функции-помощники.
         *
         * @private
         * @returns {object}
         */
        _getHelpers: function() {
            return object.extend({

                    /**
                     * Проверить на первый элемент среди сестринских.
                     *
                     * @returns {boolean}
                     */
                    isFirst: function() {
                        return this.data.index === 0;
                    },

                    /**
                     * Проверить на последний элемент среди сестринских.
                     *
                     * @returns {boolean}
                     */
                    isLast: function() {
                        return this.data.index + 1 === this.data.length;
                    },

                    /**
                     * Проверить узел на элемент.
                     *
                     * @returns {boolean}
                     */
                    isElem: function() {
                        return !!this.bemjson.elem;
                    },

                    /**
                     * Проверить узел на блок.
                     *
                     * @returns {boolean}
                     */
                    isBlock: function() {
                        return !this.isElem();
                    },

                    /**
                     * Сформировать идентификатор.
                     *
                     * @param {string} [prefix=i] Префикс для идентификатора
                     * @returns {string}
                     */
                    id: function(prefix) {
                        return (prefix || Helpers.idPrefix) + Helpers.idSalt + Helpers._id++;
                    }

                },
                this._getHelpersFromModule(string, [
                    'escape', 'htmlEscape', 'unHtmlEscape',
                    'collapse', 'stripTags',
                    'upper', 'lower', 'repeat'
                ]),
                this._getHelpersFromModule(number, [
                    'random'
                ]),
                this._getHelpersFromModule(object, [
                    'extend', 'deepExtend',
                    'clone', 'deepClone'
                ]),
                {
                    is: this._getHelpersFromModule(is, [
                        'string', 'boolean',
                        'number', 'integer', 'float', 'nan',
                        'null', 'undefined', 'primitive',
                        'array', 'argument', 'function', 'native',
                        'map', 'date', 'regexp',
                        'type', 'every'
                    ])
                }
            );
        },

        /**
         * Получить набор функций-помощников из модуля.
         *
         * @private
         * @param {function} context Класс содержащий помощников
         * @param {string[]} names Список имён помощников
         * @returns {object}
         */
        _getHelpersFromModule: function(context, names) {
            return names.reduce(function(helpers, method) {
                helpers[method] = function() {
                    return context[method].apply(this, arguments);
                }.bind(context);
                return helpers;
            }, {});
        }

    };

    return Helpers;

}).call(global, string, number, object, is),
Selector = (function () {

    /**
     * Модуль работы с БЭМ-селектором.
     *
     * @constructor
     * @param {string} [selector] БЭМ-селектор
     */
    function Selector(selector) {

        /**
         * БЭМ-селектор.
         *
         * @private
         * @type {string}
         */
        this._selector = selector || '';

        /**
         * Имя блока.
         *
         * @private
         * @type {string}
         */
        this._block = '';

        /**
         * Имя модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modName = '';

        /**
         * Значение модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modVal = '';

        /**
         * Имя элемента.
         *
         * @private
         * @type {string}
         */
        this._elem = '';

        /**
         * Имя модификатора элемента.
         *
         * @private
         * @type {string}
         */
        this._elemModName = '';

        /**
         * Значение модификатора элемента.
         *
         * @private
         * @type {string}
         */
        this._elemModVal = '';

        /**
         * Вес селектора.
         *
         * @private
         * @type {number}
         */
        this._weight = 0;

        this.info();
    }

    /**
     * Разделители имён.
     *
     * @type {{mod: string, elem: string}}
     * @property {string} mod Разделитель блока и модификатора, элемента и модификатора, модификатора и значения
     * @property {string} elem Разделитель блока и элемента
     */
    Selector.delimiters = {
        mod: '_',
        elem: '__'
    };

    /**
     * Символ любого значения.
     *
     * @type {string}
     */
    Selector.any = '*';

    Selector.prototype = {

        /**
         * Получить информацию по БЭМ-сущности.
         *
         * @returns {object}
         */
        info: function() {
            var blockAndElem = this._getBlockAndElem(),
                block = this._getObjectAndMods(blockAndElem.block),
                elem = this._getObjectAndMods(blockAndElem.elem);

            return {
                block: this._block || (this._block = block.object),
                modName: this._modName || (this._modName = block.modName),
                modVal: this._modVal || (this._modVal = block.modVal),
                elem: this._elem || (this._elem = elem.object),
                elemModName: this._elemModName || (this._elemModName = elem.modName),
                elemModVal: this._elemModVal || (this._elemModVal = elem.modVal)
            };
        },

        /**
         * Проверить сущность на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !this.isElem();
        },

        /**
         * Проверить сущность на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._elem;
        },

        /**
         * Получить/установить имя блока.
         *
         * @param {string} [name] Имя блока
         * @returns {string|Selector}
         */
        block: function(name) {
            return this._getSet('_block', name);
        },

        /**
         * Получить/установить модификатор блока.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Selector}
         */
        mod: function(name, val) {
            if(name === undefined && val === undefined) return {
                name: this.modName(),
                val: this.modVal()
            };

            this.modName(name);
            this.modVal(val);
            return this;
        },

        /**
         * Получить/установить имя модификатора блока.
         *
         * @param {string} [name] Имя модификатора
         * @returns {string|Selector}
         */
        modName: function(name) {
            return this._getSet('_modName', name);
        },

        /**
         * Получить/установить значение модификатора блока.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Selector}
         */
        modVal: function(val) {
            return this._getSet('_modVal', val);
        },

        /**
         * Получить/установить элемент.
         *
         * @param {string} [name] Имя элемента
         * @returns {string|Selector}
         */
        elem: function(name) {
            return this._getSet('_elem', name);
        },

        /**
         * Получить/установить модификатор элемента.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Selector}
         */
        elemMod: function(name, val) {
            if(name === undefined && val === undefined) return {
                name: this.elemModName(),
                val: this.elemModVal()
            };

            this.elemModName(name);
            this.elemModVal(val);
            return this;
        },

        /**
         * Получить/установить имя модификатора элемента.
         *
         * @param {string} [name] Имя модификатора
         * @returns {string|Selector}
         */
        elemModName: function(name) {
            return this._getSet('_elemModName', name);
        },

        /**
         * Получить/установить значение модификатора элемента.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Selector}
         */
        elemModVal: function(val) {
            return this._getSet('_elemModVal', val);
        },

        /**
         * Получить строковое представление БЭМ-сущности.
         *
         * @returns {string}
         */
        toString: function() {
            var name = [this._block].concat(this._getMod('_modName', '_modVal'));

            if(this._elem) {
                name = name.concat(
                    Selector.delimiters.elem, this._elem,
                    this._getMod('_elemModName', '_elemModVal')
                );
            }

            return name.join('');
        },

        /**
         * Получить/установить вес селектора.
         *
         * @param {number} [weight] Вес селектора
         * @returns {number|Selector}
         */
        weight: function(weight) {
            if(weight) {
                this._weight = weight;
                return this;
            }

            if(this._weight) {
                return this._weight;
            }

            var weights = {
                block: 2,
                modName: 2,
                modVal: 2,
                elem: 10,
                elemModName: 6,
                elemModVal: 6
            };

            return [
                'block', 'modName', 'modVal',
                'elem', 'elemModName', 'elemModVal'
            ].reduce(function(weight, partName) {
                    var part = this[partName]();
                    if(part) {
                        weight += part === Selector.any ? weights[partName] / 2 : weights[partName];
                    }
                    return weight;
                }.bind(this), 0);
        },

        /**
         * Получить строковую информацию о блоке и его элементе.
         *
         * @private
         * @returns {{block: string, elem: string}}
         */
        _getBlockAndElem: function() {
            var blockAndElem = this._selector.split(Selector.delimiters.elem);
            return {
                block: blockAndElem[0] || '',
                elem: blockAndElem[1] || ''
            };
        },

        /**
         * Получить информацию об объекте (блоке или элементе) и его модификаторе.
         *
         * @private
         * @param {string} object Строковая информация об объекте
         * @returns {{object: string, modName: string, modVal: string}}
         */
        _getObjectAndMods: function(object) {
            var blockAndMod = object.split(Selector.delimiters.mod);
            return {
                object: blockAndMod[0],
                modName: blockAndMod[1] || '',
                modVal: blockAndMod[2] || ''
            };
        },

        /**
         * Получить модификатор.
         *
         * @private
         * @param {string} name Имя поля имени модификатора
         * @param {string} val Имя поля значения модификатора
         * @returns {array}
         */
        _getMod: function(name, val) {
            var mod = [],
                name = this[name],
                val = this[val];

            if(name && val !== false) {
                mod.push(Selector.delimiters.mod, name);

                if(val && val !== true) {
                    mod.push(Selector.delimiters.mod, val);
                }
            }

            return mod;
        },

        /**
         * Получить/установить значение полю.
         *
         * @private
         * @param {string} name Имя поля
         * @param {*} [val] Значение
         * @returns {*|Selector}
         */
        _getSet: function(name, val) {
            if(val === undefined) return this[name];

            this[name] = val;
            return this;
        }

    };

    return Selector;

}).call(global),
Match = (function (Selector, object, is) {

    /**
     * Модуль проверки БЭМ-узла на соответствие шаблону.
     *
     * @constructor
     * @param {string} pattern Шаблон
     */
    function Match(pattern) {

        /**
         * Экземпляр шаблона.
         *
         * @private
         * @type {Selector}
         */
        this._pattern = new Selector(pattern);
    }

    Match.prototype = {

        /**
         * Проверить узел или имя на соответствие шаблону.
         *
         * @param {object|string} test Узел или имя БЭМ-сущности
         * @returns {boolean}
         */
        is: function(test) {
            return this[is.string(test) ? '_isName' : '_isNode'](test);
        },

        /**
         * Проверить узел или имя на точное соответствие (эквивалент) шаблону.
         *
         * @param {object|string} test Узел или имя БЭМ-сущности
         * @returns {boolean}
         */
        equal: function(test) {
            return this[is.string(test) ? '_equalName' : '_equalNode'](test);
        },

        /**
         * Проверить имя на неточное или точное соответствие шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @param {string} method Имя метода для проверки узла: `_isNode` или `_equalNode`
         * @returns {boolean}
         */
        _name: function(name, method) {
            name = new Selector(name);

            var mods = {};
            mods[name.modName()] = name.modVal();

            var elemMods = {};
            elemMods[name.elemModName()] = name.elemModVal();

            return this[method]({
                block: name.block(),
                mods: mods,
                elem: name.elem(),
                elemMods: elemMods
            });
        },

        /**
         * Проверить имя на соответствие шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @returns {boolean}
         */
        _isName: function(name) {
            return this._name(name, '_isNode');
        },

        /**
         * Проверить узел на соответствие шаблону.
         *
         * @private
         * @param {object} node Узел
         * @returns {boolean}
         */
        _isNode: function(node) {
            return (
                this._block(node.block) &&
                this._blockMod(node.mods) &&
                this._elem(node.elem) &&
                this._elemMod(node.elemMods)
            );
        },

        /**
         * Проверить имя на точное соответствие (эквивалент) шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @returns {boolean}
         */
        _equalName: function(name) {
            return this._name(name, '_equalNode');
        },

        /**
         * Проверить узел на точное соответствие (эквивалент) шаблону.
         *
         * @private
         * @param {object} node Узел
         * @returns {boolean}
         */
        _equalNode: function(node) {
            return (
                this._block(node.block) &&
                this._equalBlockMod(node.mods) &&
                this._elem(node.elem) &&
                this._equalElemMod(node.elemMods)
            );
        },

        /**
         * Проверить блок на соответствие шаблону.
         *
         * @private
         * @param {string} block Имя блока узла
         * @returns {boolean}
         */
        _block: function(block) {
            var pattern = this._pattern.block();
            return pattern === Selector.any || block === Selector.any || pattern === block;
        },

        /**
         * Проверить модификаторы блока на соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы блока узла
         * @returns {boolean}
         */
        _blockMod: function(mods) {
            if(this._pattern.isBlock() && !this._pattern.modName() && !this._pattern.modVal()) {
                return true;
            }

            return this._equalBlockMod(mods);
        },

        /**
         * Проверить модификаторы блока на точное соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы блока узла
         * @returns {boolean}
         */
        _equalBlockMod: function(mods) {
            return this._anyMod(this._pattern.modName(), this._pattern.modVal(), mods);
        },

        /**
         * Проверить элемент на соответствие шаблону.
         *
         * @private
         * @param {string} elem Имя элемента узла
         * @returns {boolean}
         */
        _elem: function(elem) {
            var pattern = this._pattern.elem();

            if(!elem) {
                return !pattern;
            }

            return pattern === Selector.any || elem === Selector.any || pattern === elem;
        },

        /**
         * Проверить модификаторы элемента на соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _elemMod: function(mods) {
            if(this._pattern.isElem() && !this._pattern.elemModName() && !this._pattern.elemModVal()) {
                return true;
            }

            return this._equalElemMod(mods);
        },

        /**
         * Проверить модификаторы элемента на точное соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _equalElemMod: function(mods) {
            return this._anyMod(this._pattern.elemModName(), this._pattern.elemModVal(), mods);
        },

        /**
         * Проверить модификаторы блока или элемента на соответствие шаблону.
         *
         * @private
         * @param {string} patternName Шаблон имени модификатора
         * @param {string} patternVal Шаблон значения модификатора
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _anyMod: function(patternName, patternVal, mods) {
            if(!patternName && !mods) {
                return true;
            }

            if(!mods) {
                return false;
            }

            return object.isEmpty(mods) || Object.keys(mods).some(function(name) {
                return this._mod(patternName, patternVal, name, mods[name]);
            }, this);
        },

        /**
         * Проверить модификатор на соответствие шаблону.
         *
         * @private
         * @param {string} patternName Шаблон имени модификатора
         * @param {string} patternVal Шаблон значения модификатора
         * @param {string} name Имя проверяемого модификатора
         * @param {string} val Значение проверяемого модификатора
         * @returns {boolean}
         */
        _mod: function(patternName, patternVal, name, val) {
            var any = Selector.any;

            if(patternName === any && patternVal === any || name === any && val === any) {
                return true;
            }

            if(patternName === any) {
                return val === any || patternVal === val;
            }

            if(name === any) {
                return patternVal === any || patternVal === val;
            }

            // Вторая проверка на булев модификатор
            if(patternVal === any || !patternVal && val === true) {
                return name === any || patternName === name;
            }

            if(val === any) {
                return patternName === any || patternName === name;
            }

            return patternName === name && patternVal === val;
        }

    };

    return Match;

}).call(global, Selector, object, is),
Tag = (function (string, is) {

    /**
     * Модуль работы с тегом.
     *
     * @constructor
     * @param {string} [name=div] Имя тега
     */
    function Tag(name) {

        /**
         * Имя тега.
         *
         * @private
         * @type {string}
         */
        this._name = name || Tag.defaultName;

        /**
         * Список классов тега.
         *
         * @private
         * @type {string[]}
         */
        this._class = [];

        /**
         * Список атрибутов.
         *
         * @private
         * @type {object}
         */
        this._attr = {};

        /**
         * Флаг принудительного указания одиночного тега.
         *
         * @private
         * @type {boolean}
         */
        this._single;

        /**
         * Содержимое тега.
         *
         * @private
         * @type {string[]}
         */
        this._content = [];
    }

    /**
     * Имя тега по умолчанию.
     *
     * @type {string}
     */
    Tag.defaultName = 'div';

    /**
     * Список одиночных HTML-тегов.
     *
     * @type {String[]}
     */
    Tag.singleTags = [
        'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
        'input', 'keygen', 'link', 'meta', 'param', 'source', 'wbr'
    ];

    Tag.prototype = {

        /**
         * Получить/установить имя тега.
         *
         * @param {string} [name] Имя тега
         * @returns {string|Tag}
         */
        name: function(name) {
            if(!name) return this._name;

            this._name = name;
            return this;
        },

        /**
         * Добавить тегу класс.
         *
         * @param {string|string[]} cls Имя класса или список имён
         * @returns {Tag}
         */
        addClass: function(cls) {
            var names = is.array(cls) ? cls : [cls];
            names.forEach(function(name) {
                if(!this.hasClass(name)) {
                    this._class.push(name);
                }
            }, this);
            return this;
        },

        /**
         * Проверить наличие класса у тега.
         *
         * @param {string} name Имя класса
         * @returns {boolean}
         */
        hasClass: function(name) {
            return !!~this._class.indexOf(name);
        },

        /**
         * Удалить класс тега.
         *
         * @param {string} name Имя класса
         * @returns {Tag}
         */
        delClass: function(name) {
            var index = this._class.indexOf(name);
            if(~index) {
                this._class.splice(index, 1);
            }
            return this;
        },

        /**
         * Получить список классов тега.
         *
         * @returns {string[]}
         */
        getClass: function() {
            return this._class;
        },

        /**
         * Проверить/установить одиночный тег.
         *
         * @param {boolean} [state] Флаг одиночного тега
         * @returns {boolean|Tag}
         */
        single: function(state) {
            if(state === undefined) {
                return this._single !== undefined
                    ? this._single
                    : !!~Tag.singleTags.indexOf(this._name);
            }

            this._single = state;
            return this;
        },

        /**
         * Получить/установить/удалить атрибут.
         * Установить список атрибутов.
         * Получить список атрибутов.
         *
         * При указании значения `false` атрибут будет удалён.
         * При указании значения `true` будет установлен булев атрибут без значения.
         *
         * В качестве значения атрибуту можно передавать массив или объект,
         * они будут установлены в заэкранированном виде.
         *
         * @param {string|object} [name] Имя атрибута или список атрибутов
         * @param {*} [val] Значение атрибута
         * @returns {*|object|Tag}
         */
        attr: function(name, val) {
            if(!arguments.length) return this._attr;

            if(is.map(name)) {
                Object.keys(name).forEach(function(attr) {
                    this.attr(attr, name[attr]);
                }, this);
                return this;
            } else if(val === undefined) {
                return this._attr[name];
            }

            if(is.array(val) || is.map(val)) {
                val = string.htmlEscape(JSON.stringify(val));
            }

            if(val === false) {
                this.delAttr(name);
            } else {
                this._attr[name] = val;
            }

            return this;
        },

        /**
         * Удалить атрибут.
         *
         * @param {string} name Имя атрибута
         * @returns {Tag}
         */
        delAttr: function(name) {
            delete this._attr[name];
            return this;
        },

        /**
         * Получить/установить содержимое тега.
         *
         * @param {string|string[]} [content] Содержимое
         * @returns {string[]|Tag}
         */
        content: function(content) {
            if(content === undefined) return this._content;

            this._content = [];
            this.addContent(content);
            return this;
        },

        /**
         * Добавить содержимое тега.
         *
         * @param {string|string[]} content Содержимое
         * @returns {Tag}
         */
        addContent: function(content) {
            if(is.array(content)) {
                this._content = this._content.concat(content);
            } else {
                this._content.push(content);
            }
            return this;
        },

        /**
         * Получить строковое представление тега.
         *
         * @returns {string}
         */
        toString: function() {
            var tag = ['<' + this.name()],
                classes = this.getClass(),
                attrs = this.attr();

            if(classes.length) {
                tag.push(' class="' + classes.join(' ') + '"');
            }

            Object.keys(attrs).forEach(function(attr) {
                attrs[attr] === true
                    ? tag.push(' ' + attr)
                    : tag.push(' ' + attr + '="' + attrs[attr] + '"');
            }, this);

            if(this.single()) {
                tag.push('/>')
            } else {
                tag.push('>');
                tag = tag.concat(this.content());
                tag.push('</' + this.name() + '>');
            }

            return tag.join('');
        }

    };

    return Tag;

}).call(global, string, is),
Node = (function (Tag, Selector, object) {

    /**
     * Модуль работы с БЭМ-узлом.
     *
     * @constructor
     * @param {Object} node БЭМ-узел
     */
    function Node(node) {

        /**
         * БЭМ-узел.
         *
         * @private
         * @type {object}
         */
        this._node = node;

        /**
         * Экземпляр тега.
         *
         * @private
         * @type {Tag}
         */
        this._tag = new Tag(node.tag).attr(node.attrs || {});

        /**
         * Экземпляр имени БЭМ-сущности.
         *
         * @private
         * @type {Selector}
         */
        this._name = this.getName();

        /**
         * Список информационных объектов о примиксованных сущностях.
         *
         * @private
         * @type {array}
         */
        this._mix = this.getMix();

        /**
         * Параметры узла.
         *
         * @private
         * @type {object}
         */
        this._params = this.getParams();
    }

    /**
     * Имя класса для js-инициализации.
     *
     * @type {string}
     */
    Node.bemClass = 'i-bem';

    /**
     * Имя атрибута для хранения параметров инициализации.
     *
     * @type {string}
     */
    Node.bemAttr = 'data-bem';

    Node.prototype = {

        /**
         * Проверить узел на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !this.isElem();
        },

        /**
         * Проверить узел на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._node.elem;
        },

        /**
         * Получить экземпляр имени базовой БЭМ-сущности.
         *
         * Это может быть блок или элемент блока.
         *
         * @returns {Selector}
         */
        getName: function() {

            var name = new Selector(this._node.block);

            if(this.isElem()) {
                name.elem(this._node.elem);
            }

            return name;
        },

        /**
         * Получить параметры узла.
         *
         * @returns {object}
         */
        getParams: function() {
            var params = {};

            if(this._node.js) {
                params[this._name.toString()] = this._node.js === true ? {} : this._node.js;
            }

            return this._mix.reduce(function(params, mixNode) {
                return object.extend(params, mixNode.params);
            }, params);
        },

        /**
         * Получить информацию о примиксованных сущностях.
         *
         * @returns {array}
         */
        getMix: function() {
            if(!this._node.mix) return [];

            return this._node.mix.reduce(function(mix, mixNode) {
                if(!mixNode) return mix;

                var node = new Node(mixNode);
                mix.push({
                    name: node.getName().toString(),
                    params: node.getParams(),
                    classes: node.getClass()
                });
                return mix;
            }, []);
        },

        /**
         * Получить список классов узла.
         *
         * @returns {string[]}
         */
        getClass: function() {
            var node = this._node;

            if(node.cls) {
                this._tag.addClass(node.cls.split(' ').filter(function(cls) { return cls; }));
            }

            if(node.bem === false) return this._tag.getClass();

            if(this.isBlock() || this.isElem() && object.isEmpty(node.mods)) {
                this._tag.addClass(this._name.toString());
            }

            if(!object.isEmpty(this._params)) {
                this._tag.addClass(Node.bemClass);
            }

            if(!object.isEmpty(node.mods)) {
                var mods = this._getModsClasses('mod');
                this._tag.addClass(mods.length ? mods : this._name.toString());
            }

            if(this.isElem() && !object.isEmpty(node.elemMods)) {
                this._tag.addClass(this._getElemModsClasses());
            }

            this._tag.addClass(this._mix.reduce(function(mixClasses, mixNode) {
                return mixClasses.concat(mixNode.classes);
            }, []));

            return this._tag.getClass();
        },

        /**
         * Получить/установить содержимое узла.
         *
         * @param {*} [content] Содержимое
         * @returns {*|Node}
         */
        content: function(content) {
            if(content === undefined) return this._node.content || '';

            this._node.content = content;
            return this;
        },

        /**
         * Получить строковое представление узла.
         *
         * @returns {string}
         */
        toString: function() {
            this.getClass();

            if(!object.isEmpty(this._params)) {
                this._tag.attr(Node.bemAttr, this._params);
            }

            if(this._node.content) {
                this._tag.addContent(this._node.content);
            }

            return this._tag.toString();
        },

        /**
         * Получить список классов модификаторов узла.
         *
         * @private
         * @param {string} method Имя метода для установки модификаторов
         * @returns {string[]}
         */
        _getModsClasses: function(method) {
            var mods = this._node[method + 's'];
            return Object.keys(mods).reduce(function(classes, key) {
                if(mods[key]) {
                    classes.push(this._name[method](key, mods[key]).toString());
                }
                return classes;
            }.bind(this), []);
        },

        /**
         * Получить список классов модификаторов элемента.
         *
         * @private
         * @returns {string[]}
         */
        _getElemModsClasses: function() {
            if(!object.isEmpty(this._node.mods)) {
                return Object.keys(this._node.mods).reduce(function(classes, key) {
                    this._name.mod(key, this._node.mods[key]);
                    return classes.concat(this._getModsClasses('elemMod'));
                }.bind(this), []);
            }

            return this._getModsClasses('elemMod');
        }

    };

    return Node;

}).call(global, Tag, Selector, object),
Pool = (function () {

    /**
     * Модуль хранения списка шаблонов.
     *
     * @constructor
     */
    function Pool() {

        /**
         * Список шаблонов.
         *
         * @type {Template[]}
         */
        this.pool = [];
    }

    Pool.prototype = {

        /**
         * Добавить шаблон или несколько шаблонов.
         *
         * @param {...Template} template Шаблон к добавлению
         * @returns {Pool}
         */
        add: function(template) {
            var args = arguments,
                templates = Object.keys(args).reduce(function(templates, key) {
                    return templates.concat(args[key].split());
                }, []);

            templates.forEach(function(template) {
                var indexes = this.is(template);

                // Так как шаблоны разбиты по единичным селекторам,
                // результатом поиска может быть только один индекс или null.
                this.pool.push(indexes ? this.pool[indexes[0]].extend(template) : template);

            }, this);

            return this;
        },

        /**
         * Найти индексы подходящих для наследования шаблонов
         * для каждого селектора указанного шаблона.
         *
         * Результатом всегда возвращается массив индексов
         * или `null`, если подходящие шаблоны не были найдены.
         *
         * @param {Template} template Шаблон для поиска
         * @returns {number[]|null}
         */
        is: function(template) {
            var indexes = [];

            template.split().forEach(function(currentTemplate) {
                for(var index = this.pool.length - 1; index >= 0; index--) {
                    if(this.pool[index].is(currentTemplate)) {
                        indexes.push(index);
                        break;
                    }
                }
            }, this);

            return indexes.length ? indexes : null;
        },

        /**
         * Найти шаблон для BEMJSON.
         *
         * @param {object} bemjson BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|null} Экземпляр БЭМ-узла или null при отсутствии подходящего шаблона
         */
        find: function(bemjson, data) {
            for(var index = this.pool.length - 1; index >= 0; index--) {
                var node = this.pool[index].match(bemjson, data);
                if(node) {
                    return node;
                }
            }
            return null;
        },

        /**
         * Удалить все шаблоны.
         *
         * @returns {Pool}
         */
        clean: function() {
            this.pool = [];
            return this;
        }

    };

    return Pool;

}).call(global),
classify = (function (inherit) {
    return inherit;
}).call(global, inherit),
Template = (function (Match, classify, Node, Selector, Helpers, object, string, is) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) {

        /**
         * Шаблоны для матчинга.
         *
         * @private
         * @type {string[]}
         */
        this._patterns = [].slice.call(arguments, 0, -1);

        /**
         * Моды для преобразования узла.
         *
         * @private
         * @type {object}
         */
        this._modes = [].slice.call(arguments, -1)[0];

        /**
         * Функции-помощники.
         *
         * @private
         * @type {Helpers}
         */
        this._helpers = new Helpers();

        /**
         * Экземпляры матчера.
         *
         * @private
         * @type {Match[]}
         */
        this._matches = Object.keys(this._patterns).reduce(function(matches, key) {
            matches.push(new Match(this._patterns[key]));
            return matches;
        }.bind(this), []);

        /**
         * Класс по модам.
         *
         * @private
         * @type {Function}
         */
        this.Modes = this._classifyModes();
    }

    /**
     * Стандартное значение моды `tag`.
     *
     * @type {string}
     */
    Template.tag = 'div';

    /**
     * Получить БЭМ-узел на основе BEMJSON по базому шаблону.
     *
     * @param {object} bemjson Входящий BEMJSON
     * @param {object} [data] Данные по сущности в дереве
     * @returns {Node}
     */
    Template.base = function(bemjson, data) {
        return new Template(
            new Node(bemjson).isBlock() ? '*' : '*' + Selector.delimiters.elem + '*', {}
        ).transform(bemjson, data);
    };

    Template.prototype = {

        /**
         * Применить BEMJSON к шаблону.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson, data) {

            for(var i = 0; i < this._matches.length; i++) {
                if(this._matches[i].is(bemjson)) {
                    return this.transform(bemjson, data);
                }
            }

            return null;
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node}
         */
        transform: function(bemjson, data) {
            var modes = new this.Modes(bemjson, data);

            Object.keys(this._getDefaultModes()).forEach(function(mode) {
                bemjson[mode] = this._getMode(modes, bemjson, mode);
            }, this);

            return new Node(bemjson);
        },

        /**
         * Наследовать шаблон.
         *
         * @param {Template} template Базовый шаблон
         * @returns {Template}
         */
        extend: function(template) {
            template.Modes = classify(this.Modes, template._modes);
            return template;
        },

        /**
         * Разбить шаблон на шаблоны с единичными селекторами.
         *
         * @returns {Template[]}
         */
        split: function() {
            return Object.keys(this._patterns).reduce(function(templates, key) {
                templates.push(new Template(this._patterns[key], this._modes).helper(this._helpers.get()));
                return templates;
            }.bind(this), []);
        },

        /**
         * Проверить шаблон на соответствие.
         *
         * Вернёт `true`, если хотя бы один селектор
         * текущего шаблона и проверяемого пройдёт неточную проверку.
         *
         * @param {Template} template Шаблон
         * @returns {boolean}
         */
        is: function(template) {
            return this._matches.some(function(match) {
                return Object.keys(template._patterns).some(function(key) {
                    return match.is(template._patterns[key]);
                });
            });
        },

        /**
         * Добавить одну или несколько
         * пользовательских функций-помощников.
         *
         * @param {string|object} nameOrList Имя функции или карта помощников
         * @param {function} [callback] Тело функции
         * @returns {Template}
         */
        helper: function(nameOrList, callback) {

            if(is.string(nameOrList)) {
                this._helpers.add(nameOrList, callback);
            } else {
                Object.keys(nameOrList).forEach(function(name) {
                    this._helpers.add(name, nameOrList[name]);
                }, this);
            }

            this.Modes = this._classifyModes();
            return this;
        },

        /**
         * Сформировать класс на основе базовых полей.
         *
         * @private
         * @returns {Function}
         */
        _classifyModes: function() {
            return classify(classify(this._getBaseProps()), this._modes);
        },

        /**
         * Получить базовые поля для класса.
         *
         * @private
         * @returns {object}
         */
        _getBaseProps: function() {
            return object.extend(this._getDefaultModes(), this._helpers.get());
        },

        /**
         * Получить стандартные моды.
         *
         * Если среди селекторов шаблона присутствует хотя бы
         * один блок, то будут отданы стандартные моды для блоков.
         *
         * @private
         * @returns {object}
         */
        _getDefaultModes: function() {
            return {
                js: false,
                bem: true,
                mods: {},
                elemMods: {},
                attrs: {},
                mix: [],
                tag: Template.tag,
                cls: '',
                content: ''
            };
        },

        /**
         * Получить значение моды.
         *
         * Если значение в шаблоне скалярное, то массивы конкатенируются,
         * а объекты (карты) наследуются с приоритетом у BEMJSON.
         *
         * @private
         * @param {Object} modes Экземпляр класса по модам
         * @param {object} bemjson Входящий BEMJSON
         * @param {string} name Имя требуемой моды
         * @returns {*}
         */
        _getMode: function(modes, bemjson, name) {
            var isValFunc = is.function(modes[name]),
                bemjsonVal = bemjson[name],
                val = isValFunc ? modes[name].call(modes, bemjsonVal) : modes[name],
                priorityVal = this._getPriorityValue(isValFunc, val, bemjsonVal);

            if(!isValFunc) {
                if(is.array(val, bemjsonVal)) {
                    priorityVal = bemjsonVal.concat(val);
                } else if(is.map(val, bemjsonVal)) {
                    priorityVal = object.extend(object.clone(val), bemjsonVal);
                }
            }

            if(name === 'content') {
                return this._escapeContent(priorityVal);
            }

            return priorityVal;
        },

        /**
         * Заэкранировать содержимое узла.
         *
         * @private
         * @param {*} content Содержимое
         * @returns {*}
         */
        _escapeContent: function(content) {

            if(is.string(content)) {
                return string.htmlEscape(content);
            }

            if(is.array(content)) {
                return content.map(function(item) {
                    return this._escapeContent(item);
                }, this);
            }

            return content;
        },

        /**
         * Получить приоритетное значение моды.
         *
         * Если значение моды в шаблоне задано функцией,
         * то оно является приоритетным.
         *
         * @private
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @param {*} val Значение моды в шаблоне
         * @param {*} bemjsonVal Значение моды в BEMJSON
         * @returns {*}
         */
        _getPriorityValue: function(isValFunc, val, bemjsonVal) {
            if(isValFunc) return val;
            return is.undefined(bemjsonVal) ? val : bemjsonVal;
        }

    };

    return Template;

}).call(global, Match, classify, Node, Selector, Helpers, object, string, is),
Tree = (function (Template, is, object) {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @constructor
     */
    function Tree(tree, pool) {

        /**
         * Дерево.
         *
         * @private
         * @type {object}
         */
        this._tree = tree;

        /**
         * Список шаблонов.
         *
         * @private
         * @type {Pool}
         */
        this._pool = pool;

        /**
         * Контекст блока в дереве.
         *
         * @private
         * @type {string}
         */
        this._block = tree.block || '';
    }

    Tree.prototype = {

        /**
         * Развернуть дерево в набор экземпляров БЭМ-узлов.
         *
         * @param {object} bemjson BEMJSON
         * @returns {Node}
         */
        expand: function(bemjson) {
            return this._getNode(bemjson);
        },

        /**
         * Получить строковое представление дерева.
         *
         * @returns {string}
         */
        toString: function() {
            return this.expand(this._tree).toString();
        },

        /**
         * Получить узел или примитив
         * или список узлов и примитивов
         * на основе контента.
         *
         * @private
         * @param {*} bemjson BEMJSON, массив или примитив
         * @param {object} data Данные по сущности в дереве
         * @param {object} [data.context] Информация о родительском контексте (если родитель — блок)
         * @param {object} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @returns {*}
         */
        _getContent: function(bemjson, data) {

            if(is.array(bemjson)) {
                return bemjson.reduce(function(list, elem, index) {
                    var elemData = {
                        index: index,
                        length: bemjson.length
                    };

                    if(elem && elem.elem) {
                        elemData.context = data.context;
                    }

                    var node = is.array(elem)
                        ? this._getContent(elem, data)
                        : this._getNode(elem, elemData);

                    if(is.array(node)) {
                        list = list.concat(node);
                    } else {
                        list.push(node);
                    }

                    return list;
                }.bind(this), []);
            }

            return this._getNode(bemjson, data);
        },

        /**
         * Рекурсивно получить БЭМ-узел с его контентом на основе BEMJSON
         * или просто вернуть полученный примитив.
         *
         * @private
         * @param {*} bemjson BEMJSON или примитив
         * @param {object} [data] Данные по сущности в дереве
         * @param {object} [data.index] Порядковый индекс сущности
         * @param {object} [data.length] Количество сущностей у родителя
         * @param {object} [data.context] Информация о родительском контексте (только для элементов)
         * @param {object} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @returns {Node|*}
         */
        _getNode: function(bemjson, data) {

            if(is.map(bemjson)) {

                if(bemjson.elem && !bemjson.block && data.context.block) {
                    bemjson.block = data.context.block;
                    if(data.context.mods) {
                        bemjson.mods = object.extend(bemjson.mods || {}, data.context.mods);
                    }
                }

                var node = this._pool.find(bemjson, data) || Template.base(bemjson, data),
                    data = {};

                if(bemjson.block) {
                    data.context = { block: bemjson.block };
                    if(bemjson.mods) {
                        data.context.mods = bemjson.mods;
                    }
                }

                node.content(this._getContent(bemjson.content, data));
                return node;
            }

            return bemjson;
        }

    };

    return Tree;

}).call(global, Template, is, object),
functions = (function () {

    /**
     * Модуль работы с функциями.
     *
     * @class
     */
    function functions() {}

    /**
     * Создать экземпляр класса с помощью apply.
     *
     * @param {Function} constructor Класс
     * @param {array} args Массив аргументов
     * @returns {Object} Экземпляр класса
     */
    functions.apply = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    };

    return functions;

}).call(global),
modules = (function (number, string, object, functions, is, Tag, Selector, Node, Match) {

    /**
     * Модуль для экспорта других внутренних модулей.
     *
     * @class
     */
    function modules() {}

    /**
     * Список предоставляемых модулей.
     *
     * @private
     * @type {object}
     */
    modules._list = {
        number: number,
        string: string,
        object: object,
        functions: functions,
        is: is,
        Tag: Tag,
        Selector: Selector,
        Node: Node,
        Match: Match
    };

    /**
     * Получить заданный модуль или все модули.
     *
     * @param {string} [name] Имя модуля
     * @returns {object|*}
     */
    modules.get = function(name) {
        return name ? modules._list[name] : modules._list;
    };

    return modules;

}).call(global, number, string, object, functions, is, Tag, Selector, Node, Match),
bemer = definer.export("bemer", (function (
    Tree, Template, Pool, functions, Selector, Node, object, Helpers, modules
) {

    /**
     * Экземпляр для хранения списка шаблонов.
     *
     * @private
     * @type {Pool}
     */
    var pool = new Pool(),

        /**
         * Функции-помощники.
         *
         * @private
         * @type {object}
         */
        helpers = {};

    /**
     * Модуль обвязки для удобной работы с шаблонизатором.
     * Экспортируется в глобальный контекст.
     *
     * Шаблонизировать BEMJSON на основе имеющихся шаблонов.
     *
     * @class
     * @param {object} bemjson BEMJSON
     * @returns {string}
     */
    function bemer(bemjson) {
        return new Tree(bemjson, pool).toString();
    }

    /**
     * Добавить шаблон.
     *
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     * @returns {bemer}
     */
    bemer.match = function(pattern, modes) {
        pool.add(functions.apply(Template, arguments).helper(helpers));
        return this;
    };

    /**
     * Удалить все шаблоны и
     * сбросить порядковый номер для формирования идентификаторов.
     *
     * @returns {bemer}
     */
    bemer.clean = function() {
        pool.clean();
        Helpers.resetId();
        return this;
    };

    /**
     * Добавить пользовательскую функцию-помощник.
     *
     * @param {string} name Имя функции
     * @param {function} callback Тело функции
     * @returns {bemer}
     */
    bemer.helper = function(name, callback) {
        helpers[name] = callback;
        return this;
    };

    /**
     * Стандартные настройки шаблонизации.
     *
     * @private
     * @type {object}
     */
    var defaultConfig = {
        delimiters: {
            mod: Selector.delimiters.mod,
            elem: Selector.delimiters.elem
        },
        tag: Template.tag,
        bemClass: Node.bemClass,
        bemAttr: Node.bemAttr,
        idPrefix: Helpers.idPrefix
    };

    /**
     * Установить/сбросить настройки шаблонизации.
     * При вызове без параметра настройки сбрасываются до стандартных.
     *
     * @param {object} [config] Настройки
     *
     * @param {object} [config.delimiters] Разделители имён
     * @param {string} [config.delimiters.mod=_] Разделитель блока и модификатора,
     * элемента и модификатора, модификатора и значения
     * @param {string} [config.delimiters.elem=__] Разделитель блока и элемента
     *
     * @param {string} [config.tag=div] Стандартное имя тега
     * @param {string} [config.bemClass=i-bem] Имя класса для js-инициализации
     * @param {string} [config.bemAttr=data-bem] Имя атрибута для хранения параметров инициализации
     * @param {string} [config.idPrefix=i] Префикс для формируемых идентификаторов
     *
     * @returns {bemer}
     */
    bemer.config = function(config) {

        config = config || defaultConfig;

        if(config.delimiters) {
            object.extend(Selector.delimiters, config.delimiters);
        }

        if(config.tag) {
            Template.tag = config.tag;
        }

        if(config.bemClass) {
            Node.bemClass = config.bemClass;
        }

        if(config.bemAttr) {
            Node.bemAttr = config.bemAttr;
        }

        if(config.idPrefix) {
            Helpers.idPrefix = config.idPrefix;
        }

        return this;
    };

    /**
     * Получить заданный внутренний модуль или все модули.
     *
     * @param {string} [name] Имя модуля
     * @returns {object|*}
     */
    bemer.modules = function(name) {
        return modules.get(name);
    };

    return bemer;

}).call(global, Tree, Template, Pool, functions, Selector, Node, object, Helpers, modules));
["inherit"].forEach(function(g) { delete global[g]; });
})(this);