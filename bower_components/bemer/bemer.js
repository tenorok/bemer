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
 * @version 0.8.7
 * @date 8 March 2016
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

            var keys = Object.keys(this),
                last = keys[keys.length - 1];

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
        var firstType,
            types = ['string', 'number', 'nan', 'boolean', 'null', 'undefined', 'array',
                'argument', 'native', 'function', 'map', 'date', 'regexp'];

        for(var i = 0, len = types.length; i < len; i++) {
            var type = types[i];
            if(is[type](arguments[0])) {
                firstType = type;
                break;
            }
        }

        return is._every(arguments, function(that) {
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
        for(var i = 0, len = args.length; i < len; i++) {
            var a = args[i];
            if(!callback.call(a, a)) {
                return false;
            }
        }
        return true;
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
     * Разэкранировать строку текста.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.unEscape = function(string) {
        var stringEscapes = {
            '\\\\': '\\',
            '\\"': '"',
            '\\\'': '\'',
            '\\n': '\n',
            '\\r': '\r',
            '\\t': '\t',
            '\\u2028': '\u2028',
            '\\u2029': '\u2029'
        };

        return string.replace(/\\"|\\'|\\n|\\r|\\t|\\u2028|\\u2029|\\\\/g, function(match) {
            return stringEscapes[match];
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
     * @param {number} [indexA] Порядковый номер символа
     * @param {number} [indexB] Порядковый номер символа для указания промежутка
     * @returns {string}
     */
    string.upper = function(string, indexA, indexB) {
        return this._changeCase('toUpperCase', string, indexA, indexB);
    };

    /**
     * Перевести строку или заданный символ в нижний регистр.
     *
     * @param {string} string Строка
     * @param {number} [indexA] Порядковый номер символа
     * @param {number} [indexB] Порядковый номер символа для указания промежутка
     * @returns {string}
     */
    string.lower = function(string, indexA, indexB) {
        return this._changeCase('toLowerCase', string, indexA, indexB);
    };

    /**
     * Перевести строку или заданный символ в указанный регистр.
     *
     * @private
     * @param {string} method Имя метода для смены регистра
     * @param {string} string Строка
     * @param {number} [indexA] Порядковый номер символа
     * @param {number} [indexB] Порядковый номер символа для указания промежутка
     * @returns {string}
     */
    string._changeCase = function(method, string, indexA, indexB) {
        if(is.undefined(indexA)) {
            return string[method]();
        }

        if(is.undefined(indexB)) {
            return string.slice(0, indexA) +
                string.charAt(indexA)[method]() +
                string.substring(indexA + 1);
        }

        return string.slice(0, indexA) +
            string.substring(indexA, indexB)[method]() +
            string.substring(indexB);
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
     * Проверить необходимость использования hasOwnProperty
     * при переборе свойств объекта.
     *
     * @param {object} obj Объект для проверки
     * @returns {boolean}
     */
    object.isNeedHasOwnProperty = function(obj) {
        for(key in {}) return true;
        for(var key in Object.getPrototypeOf(obj)) return true;
        return false;
    };

    /**
     * Расширить объект.
     *
     * @param {object} original Расширяемый объект
     * @param {...object} source Расширяющие объекты
     * @returns {object}
     */
    object.extend = function(original, source) {
        for(var s = 1, sLen = arguments.length; s < sLen; s++) {
            var sourceObj = arguments[s],
                key;

            if(this.isNeedHasOwnProperty(sourceObj)) {
                for(key in sourceObj) if(this.hasOwnProperty(sourceObj, key)) original[key] = sourceObj[key];
            } else {
                for(key in sourceObj) original[key] = sourceObj[key];
            }
        }
        return original;
    };

    /**
     * Расширить объект рекурсивно.
     *
     * @param {object} original Расширяемый объект
     * @param {...object} source Расширяющие объекты
     * @returns {object}
     */
    object.deepExtend = function(original, source) {
        for(var s = 1, sLen = arguments.length; s < sLen; s++) {
            this.each(arguments[s], function(key, sourceVal) {
                var objVal = original[key],
                    isMapSourceItem = is.map(sourceVal);

                if(is.map(objVal) && isMapSourceItem) {
                    original[key] = this.deepExtend(objVal, sourceVal);
                } else if(isMapSourceItem) {
                    original[key] = this.deepClone(sourceVal);
                } else {
                    original[key] = sourceVal;
                }
            }, this);
        }
        return original;
    };

    /**
     * Проверить объект на наличие полей.
     *
     * @param {object} obj Объект для проверки
     * @returns {boolean}
     */
    object.isEmpty = function(obj) {
        obj = obj || {};
        var needHasOwnProperty = this.isNeedHasOwnProperty(obj);
        for(var key in obj) {
            if(needHasOwnProperty && !obj.hasOwnProperty(key)) continue;
            return false;
        }
        return true;
    };

    /**
     * Проверить объекты на идентичность.
     *
     * @param {...object} obj Объекты для проверки
     * @returns {boolean}
     */
    object.isEqual = function(obj) {
        var compareObjects = [].slice.call(arguments, 1),
            objLen = this.size(obj);

        for(var i = 0; i < compareObjects.length; i++) {
            if(objLen !== this.size(compareObjects[i])) return false;
            if(this.each(obj, function(key, val) {
                if(val !== compareObjects[i][key]) return true;
            })) return false;
        }
        return true;
    };

    /**
     * Проверить объекты на идентичность рекурсивно.
     *
     * @param {...object} obj Объекты для проверки
     * @returns {boolean}
     */
    object.isDeepEqual = function(obj) {
        var compareObjects = [].slice.call(arguments, 1);

        for(var i = 0; i < compareObjects.length; i++) {
            var compareObj = compareObjects[i];
            if(is.map(obj, compareObj)) {
                if(this.size(obj) !== this.size(compareObj)) return false;
                if(this.each(obj, function(key, val) {
                    if(!this.isDeepEqual(val, compareObj[key])) return true;
                }, this)) return false;
            } else if(is.array(obj, compareObj)) {
                if(obj.length !== compareObj.length) return false;
                for(var j = 0; j < obj.length; j++) {
                    if(!this.isDeepEqual(obj[j], compareObj[j])) return false;
                }
            } else if(obj !== compareObj) return false;
        }
        return true;
    };

    /**
     * Получить количество собственных полей объекта.
     *
     * @param {object} obj Объект
     * @returns {number}
     */
    object.size = function(obj) {
        var size = 0;
        object.each(obj, function() {
            size++;
        });
        return size;
    };

    /**
     * Клонировать объект.
     *
     * @param {object} obj Объект
     * @returns {object}
     */
    object.clone = function(obj) {
        return this.extend({}, obj);
    };

    /**
     * Клонировать объект рекурсивно.
     *
     * @param {object} obj Объект
     * @returns {object}
     */
    object.deepClone = function(obj) {
        return this.deepExtend({}, obj);
    };

    /**
     * Проверить принадлежность свойства
     * объекту с помощью hasOwnProperty.
     *
     * @param {object} obj Объект для проверки
     * @param {string} property Свойство
     * @returns {boolean}
     */
    object.hasOwnProperty = function(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    };

    /**
     * Колбек вызывается для каждого ключа объекта
     * при переборе методами `each` и `deepEach`.
     *
     * @callback object~eachCallback
     * @param {string} key Ключ
     * @param {*} val Значение
     * @param {object} Перебираемый объект
     * @returns {undefined|*} При возвращении любого значения, кроме `undefined`,
     * перебор останавливается и метод `each` возвращает это значение
     */

    /**
     * Проитерироваться по ключам объекта.
     *
     * @param {object} obj Объект
     * @param {object~eachCallback} callback Колбек
     * @param {object} [context=obj] Контекст вызова колбека (По умолчанию: итерируемый объект)
     * @returns {*}
     */
    object.each = function(obj, callback, context) {
        var key,
            result;

        if(this.isNeedHasOwnProperty(obj)) {
            for(key in obj) if(this.hasOwnProperty(obj, key)) {
                result = callback.call(context || obj, key, obj[key], obj);
                if(result !== undefined) return result;
            }
        } else {
            for(key in obj) {
                result = callback.call(context || obj, key, obj[key], obj);
                if(result !== undefined) return result;
            }
        }
    };

    /**
     * Проитерироваться по ключам объекта рекурсивно.
     *
     * @param {object} obj Объект
     * @param {object~eachCallback} callback Колбек
     * @param {object} [context=obj] Контекст вызова колбека (По умолчанию: итерируемый объект)
     * @returns {*}
     */
    object.deepEach = function(obj, callback, context) {
        var key,
            val,
            result,
            deepResult,
            needHasOwnProperty = this.isNeedHasOwnProperty(obj);

        for(key in obj) {
            if(needHasOwnProperty && !obj.hasOwnProperty(key)) continue;
            val = obj[key];
            if(is.map(val)) {
                deepResult = this.deepEach(val, callback, context);
                if(deepResult !== undefined) return deepResult;
                continue;
            }
            result = callback.call(context || obj, key, val, obj);
            if(result !== undefined) return result;
        }
    };

    /**
     * Колбек вызывается для каждого ключа объекта
     * при переборе методами `map` и `deepMap`.
     *
     * @callback object~mapCallback
     * @param {string} key Ключ
     * @param {*} val Значение
     * @param {object} obj Перебираемый объект
     * @returns {*} Значение поля
     */

    /**
     * Модифицировать значения каждого ключа заданного объекта.
     *
     * @param {object} obj Объект
     * @param {object~mapCallback} callback Колбек
     * @param {object} [context=obj] Контекст вызова колбека (По умолчанию: итерируемый объект)
     * @returns {object} Модифицированный объект
     */
    object.map = function(obj, callback, context) {
        this.each(obj, function(key) {
            obj[key] = callback.apply(this, arguments);
        }, context);
        return obj;
    };

    /**
     * Модифицировать значения каждого ключа заданного объекта рекурсивно.
     *
     * @param {object} obj Объект
     * @param {object~mapCallback} callback Колбек
     * @param {object} [context=obj] Контекст вызова колбека (По умолчанию: итерируемый объект)
     * @returns {object} Модифицированный объект
     */
    object.deepMap = function(obj, callback, context) {
        this.deepEach(obj, function(key, val, curObj) {
            curObj[key] = callback.apply(this, arguments);
        }, context);
        return obj;
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
                 * @param {object} [data.context] Информация о контексте родительского блока
                 * @param {object} [data.context.block] Имя родительского блока
                 * @param {object} [data.context.mods] Модификаторы родительского блока
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
                construct: function(bemjson, data) { /* jshint unused: false */ }
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
                    'escape', 'unEscape', 'htmlEscape', 'unHtmlEscape',
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
Selector = (function (is) {

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
            return !!this._block && !this.isElem();
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
         * @param {string|boolean} [val] Значение модификатора
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
         * @param {string|boolean} [val] Значение модификатора
         * @returns {string|Selector}
         */
        modVal: function(val) {
            return this._getSet('_modVal', val, true);
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
         * @param {string|boolean} [val] Значение модификатора
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
         * @param {string|boolean} [val] Значение модификатора
         * @returns {string|Selector}
         */
        elemModVal: function(val) {
            return this._getSet('_elemModVal', val, true);
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
         * @returns {string[]}
         */
        _getMod: function(name, val) {
            var mod = [];

            name = this[name];
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
         * @param {string|boolean} [val] Значение
         * @param {boolean} [isCanBeBoolean] Значение поля может быть логическим
         * @returns {*|Selector}
         */
        _getSet: function(name, val, isCanBeBoolean) {
            if(val === undefined) return this[name];

            this[name] = isCanBeBoolean === true && is.boolean(val) ? val : String(val);
            return this;
        }

    };

    return Selector;

}).call(global, is),
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
         * Получить/установить шаблон.
         *
         * @param {string} [pattern] Шаблон
         * @returns {Selector|Match}
         */
        pattern: function(pattern) {
            if(pattern === undefined) {
                return this._pattern;
            }

            this._pattern = new Selector(pattern);
            return this;
        },

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
            if(!this._pattern.modName() && !this._pattern.modVal()) {
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

            if(elem && !pattern) {
                return false;
            }

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
            if(!patternName && (!mods || object.isEmpty(mods))) {
                return true;
            }

            if(!mods) {
                return false;
            }

            return Object.keys(mods).some(function(name) {
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
Tag = (function (string, object, is) {

    /**
     * Модуль работы с тегом.
     *
     * @constructor
     * @param {string|boolean} [name=div] Имя тега или флаг отмены его строкового представления
     */
    function Tag(name) {

        /**
         * Имя тега.
         *
         * @private
         * @type {string|boolean}
         */
        this._name = is.string(name) || name === false ? name : true;

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
     * Флаг автоповтора булева атрибута.
     *
     * @type {boolean}
     */
    Tag.repeatBooleanAttr = false;

    /**
     * Флаг закрытия одиночного тега.
     *
     * @type {boolean}
     */
    Tag.closeSingleTag = false;

    /**
     * Флаг экранирования содержимого тега.
     *
     * @type {boolean}
     */
    Tag.escapeContent = true;

    /**
     * Флаг экранирования значений атрибутов.
     *
     * @type {boolean}
     */
    Tag.escapeAttr = true;

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
         * Получить/установить имя тега,
         * `true` — установить имя тега по умолчанию,
         * `false` — отменить строковое представление тега.
         *
         * @param {string|boolean} [name] Имя тега
         * @returns {string|boolean|Tag}
         */
        name: function(name) {
            if(name === undefined) return this._name === true ? Tag.defaultName : this._name;

            this._name = is.string(name) || name === false ? name : true;
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
         * @param {boolean|string} [state] Флаг одиночного тега или имя тега для проверки
         * @returns {boolean|Tag}
         */
        single: function(state) {
            if(state === undefined || is.string(state)) {
                return this._single !== undefined
                    ? this._single
                    : !!~Tag.singleTags.indexOf(state || this._name);
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
         * Атрибут `style` преобразуется в строку при получении объекта в качестве значения.
         * Числу (кроме нуля), указанному в качестве значения CSS-свойства добавляются пиксели.
         * CSS-свойства можно записывать в верблюжьей нотации.
         *
         * @param {string|object} [name] Имя атрибута или список атрибутов
         * @param {*} [val] Значение атрибута
         * @returns {*|object|Tag}
         */
        attr: function(name, val) {
            if(!arguments.length) return this._attr;

            if(is.map(name)) {
                object.each(name, function(key, val) {
                    this.attr(key, val);
                }, this);
                return this;
            } else if(val === undefined) {
                return this._attr[name];
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
            this._content = this._content.concat(content);
            return this;
        },

        /**
         * Получить строковое представление тега.
         *
         * @param {object} [options] Опции
         * @param {string} [options.defaultName=div] Имя тега по умолчанию
         * @param {string} [options.repeatBooleanAttr=false] Флаг автоповтора булева атрибута
         * @param {string} [options.closeSingleTag=false] Флаг закрытия одиночного тега
         * @param {string} [options.escapeContent=true] Флаг экранирования содержимого тега
         * @param {string} [options.escapeAttr=true] Флаг экранирования значений атрибутов
         * @returns {string}
         */
        toString: function(options) {
            if(this.name() === false) return this.content().join('');

            options = object.extend({
                defaultName: Tag.defaultName,
                repeatBooleanAttr: Tag.repeatBooleanAttr,
                closeSingleTag: Tag.closeSingleTag,
                escapeContent: Tag.escapeContent,
                escapeAttr: Tag.escapeAttr
            }, options || {});

            var name = this._name === true ? options.defaultName : this._name,
                tag = ['<' + name],
                classes = this.getClass(),
                attrs = this.attr();

            if(classes.length) {
                tag.push(' class="' + classes.join(' ') + '"');
            }

            object.each(attrs, function(key, val) {
                if(val === true) {
                    tag.push(' ' + key + (options.repeatBooleanAttr ? '="' + key + '"' : ''));
                    return;
                }

                var isValMap = is.map(val);
                if(isValMap && key === 'style') {
                    var style = [];
                    object.each(val, function(prop, propVal) {
                        if(is.number(propVal) && propVal !== 0) {
                            propVal = propVal + 'px';
                        }
                        prop = prop.replace(/([A-Z])/g, function(all, letter) {
                            return '-' + letter.toLowerCase();
                        });
                        style.push(prop + ':' + propVal + ';');
                    });
                    val = style.join('');
                } else if(is.array(val) || isValMap) {
                    val = string.htmlEscape(JSON.stringify(val));
                } else if(options.escapeAttr && is.string(val)) {
                    val = string.htmlEscape(val);
                }

                tag.push(' ' + key + '="' + val + '"');
            });

            if(this.single(name)) {
                tag.push(options.closeSingleTag ? '/>' : '>');
            } else {
                tag.push('>');
                tag = tag.concat(options.escapeContent
                    ? this.content().map(function(chunk) {
                        return is.string(chunk) ? string.htmlEscape(chunk) : chunk;
                    })
                    : this.content());
                tag.push('</' + name + '>');
            }

            return tag.join('');
        }

    };

    return Tag;

}).call(global, string, object, is),
Node = (function (Tag, Selector, object) {

    /**
     * Модуль работы с БЭМ-узлом.
     *
     * @constructor
     * @param {object} bemjson BEMJSON узла
     */
    function Node(bemjson) {

        /**
         * BEMJSON узла.
         *
         * @private
         * @type {object}
         */
        this._bemjson = bemjson;

        this._setInfo(bemjson);
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
         * Получить/установить BEMJSON узла.
         *
         * @param {object} [bemjson] BEMJSON
         * @returns {object|Node}
         */
        bemjson: function(bemjson) {
            if(bemjson === undefined) {
                return this._bemjson;
            }

            this._bemjson = bemjson;
            this._setInfo(bemjson);
            return this;
        },

        /**
         * Проверить узел на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !!this._bemjson.block && !this.isElem();
        },

        /**
         * Проверить узел на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._bemjson.elem;
        },

        /**
         * Получить экземпляр имени базовой БЭМ-сущности.
         *
         * Это может быть блок или элемент блока.
         *
         * @returns {Selector}
         */
        getName: function() {

            var name = new Selector(this._bemjson.block);

            if(this.isElem()) {
                name.elem(this._bemjson.elem);
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

            if(this._bemjson.js) {
                params[this._name.toString()] = this._bemjson.js === true ? {} : this._bemjson.js;
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
            if(!this._bemjson.mix) return [];

            return this._bemjson.mix.reduce(function(mix, mixNode) {
                if(!mixNode) return mix;

                var node = new Node(mixNode);

                if(node.isElem() && !node.bemjson().block) {
                    var nodeBemjson = node.bemjson();
                    nodeBemjson.block = this._bemjson.block;
                    node.bemjson(nodeBemjson);
                }

                mix.push({
                    name: node.getName().toString(),
                    params: node.getParams(),
                    classes: node.getClass()
                });
                return mix;
            }.bind(this), []);
        },

        /**
         * Получить список классов узла.
         *
         * @returns {string[]}
         */
        getClass: function() {
            var node = this._bemjson;

            if(node.cls) {
                this._tag.addClass(node.cls.split(' ').filter(function(cls) { return cls; }));
            }

            if(node.bem === false) return this._tag.getClass();

            if(this.isBlock() || this.isElem()) {
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
            if(content === undefined) return this._bemjson.content || '';

            this._bemjson.content = content;
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

            if(this._bemjson.content) {
                this._tag.addContent(this._bemjson.content);
            }

            var escape = Node.resolveOptionEscape(this._options.escape);

            return this._tag.toString({
                escapeContent: escape.content,
                escapeAttr: escape.attrs
            });
        },

        /**
         * Сохранить информацию об узле.
         *
         * @private
         * @param {object} bemjson BEMJSON узла
         */
        _setInfo: function(bemjson) {

            /**
             * Экземпляр тега.
             *
             * @private
             * @type {Tag}
             */
            this._tag = new Tag(bemjson.tag).attr(bemjson.attrs || {});

            if(bemjson.single !== undefined) {
                this._tag.single(bemjson.single);
            }

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

            /**
             * Опции преобразования узла.
             *
             * @private
             * @type {object}
             */
            this._options = bemjson.options || {};
        },

        /**
         * Получить список классов модификаторов узла.
         *
         * @private
         * @param {string} method Имя метода для установки модификаторов
         * @returns {string[]}
         */
        _getModsClasses: function(method) {
            var mods = this._bemjson[method + 's'];
            return Object.keys(mods).reduce(function(classes, key) {
                if(mods[key] !== false && mods[key] !== undefined) {
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
            this._name.modVal(false);
            var list = this._getModsClasses('elemMod');

            if(!object.isEmpty(this._bemjson.mods)) {
                list = list.concat(Object.keys(this._bemjson.mods).reduce(function(classes, key) {
                    this._name.mod(key, this._bemjson.mods[key]);
                    return classes.concat(this._getModsClasses('elemMod'));
                }.bind(this), []));
            }

            return list;
        }

    };

    /**
     * Получить/установить опции экранирования.
     *
     * @param {boolean|object} escape Флаг экранирования спецсимволов
     * @param {boolean} [escape.content] Флаг экранирования содержимого
     * @param {boolean} [escape.attrs] Флаг экранирования значений атрибутов
     * @returns {object}
     */
    Node.resolveOptionEscape = function(escape) {
        var content = Tag.escapeContent,
            attrs = Tag.escapeAttr;

        if(escape !== undefined) {
            if(is.boolean(escape)) {
                content = escape;
                attrs = escape;
            } else {
                if(is.boolean(escape.content)) {
                    content = escape.content;
                }
                if(is.boolean(escape.attrs)) {
                    attrs = escape.attrs;
                }
            }
        }

        return {
            content: content,
            attrs: attrs
        };
    };

    return Node;

}).call(global, Tag, Selector, object),
array = (function (is, object) {

    /**
     * Модуль работы с массивами.
     *
     * @class
     */
    function array() {}

    /**
     * Добавить элементы в массив без повтора.
     * Дополненный аналог стандартного метода `Array.prototype.push`.
     *
     * @param {array} arr Массив
     * @param {...*} element Элементы для добавления
     * @returns {number} Количество элементов в массиве
     */
    array.pushOnce = function(arr, element) {
        var elements = Array.prototype.slice.call(arguments, 1);
        for(var i = 0; i < elements.length; i++) {
            if(!~arr.indexOf(elements[i])) {
                arr.push(elements[i]);
            }
        }
        return arr.length;
    };

    /**
     * Добавить отдельные элементы и элементы других массивов в массив без повтора.
     * Дополненный аналог стандартного метода `Array.prototype.concat`.
     *
     * @param {array} arr Массив
     * @param {...*} element Элементы для добавления
     * @returns {array} Новый массив
     */
    array.concatOnce = function(arr, element) {
        var elements = Array.prototype.slice.call(arguments, 1),
            newArr = arr.slice();

        for(var i = 0; i < elements.length; i++) {
            if(is.array(elements[i])) {
                for(var j = 0; j < elements[i].length; j++) {
                    this.pushOnce(newArr, elements[i][j]);
                }
            } else {
                this.pushOnce(newArr, elements[i]);
            }
        }

        return newArr;
    };

    /**
     * Клонировать массив.
     *
     * @param {array} arr Массив
     * @returns {array} Новый массив
     */
    array.clone = function(arr) {
        return arr.slice();
    };

    /**
     * Клонировать массив рекурсивно.
     *
     * @param {array} arr Массив
     * @returns {array} Новый массив
     */
    array.deepClone = function(arr) {
        var clone = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            var elem = arr[i];

            if(is.array(elem)) {
                elem = array.deepClone(elem);
            } else if(is.map(elem)) {
                elem = object.deepClone(elem);
            }

            clone.push(elem);
        }
        return clone;
    };

    return array;

}).call(global, is, object),
Pool = (function (array, object) {

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
        add: function(template) { /* jshint unused: false */
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
         * Найти и применить шаблон для BEMJSON.
         *
         * @param {object} bemjson BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|null} Экземпляр БЭМ-узла или null при отсутствии подходящего шаблона
         */
        find: function(bemjson, data) {
            var node = null,
                nextNode = null,
                currentBemjson = bemjson,

                /**
                 * Обработанные шаблоны.
                 *
                 * @type {Template[]}
                 */
                processedTemplates = [],

                /**
                 * Установленные из шаблонов моды.
                 *
                 * @type {object}
                 * @property {object} * Имя моды
                 * @property {number} *.weight Вес шаблона
                 * @property {number} *.index Порядковый номер шаблона в общем списке
                 */
                modesFromTemplates = {};

            for(var index = this.pool.length - 1; index >= 0; index--) {
                if(~processedTemplates.indexOf(this.pool[index])) continue;

                if(node) {
                    currentBemjson = node.bemjson();
                }

                nextNode = this.pool[index].match(
                    currentBemjson,
                    data,
                    bemjson,
                    modesFromTemplates,
                    index
                );

                if(nextNode) {
                    node = nextNode;
                    processedTemplates.push(this.pool[index]);

                    // Если изменился набор модификаторов, шаблоны нужно прогонять заново.
                    if(!object.isEqual(currentBemjson.mods || {}, node.bemjson().mods) ||
                        !object.isEqual(currentBemjson.elemMods || {}, node.bemjson().elemMods)) {
                        index = this.pool.length;
                    }
                }
            }

            return node;
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

}).call(global, array, object),
classify = (function (inherit) {
    return inherit;
}).call(global, inherit),
Template = (function ( /* jshint maxparams: false */
    Match, classify, Node, Selector, Helpers, object, array, string, is
) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) { /* jshint unused: false */

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
         * @type {object}
         */
        this.modes = [].slice.call(arguments, -1)[0];

        /**
         * Имена мод шаблона.
         *
         * @private
         * @type {string[]}
         */
        this._modesNames = Object.keys(this.modes);

        /**
         * Вес шаблона.
         *
         * Рассчитать вес шаблона возможно при наличии только одного селектора.
         * При наличии в шаблоне нескольких селекторов его вес устанавливается как `null`.
         *
         * @type {?number}
         */
        this.weight = this._patterns.length === 1
            ? new Selector(this._patterns[0]).weight()
            : null;

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
        this._matches = Object.keys(this._patterns).map(function(key) {
            return new Match(this._patterns[key]);
        }, this);

        /**
         * Класс по модам.
         *
         * @private
         * @type {Function}
         */
        this.Modes = this._classifyModes();
    }

    /**
     * Получить БЭМ-узел на основе BEMJSON по базовому шаблону.
     *
     * @param {object} bemjson Входящий BEMJSON
     * @param {object} [data] Данные по сущности в дереве
     * @returns {Node}
     */
    Template.base = function(bemjson, data) {
        return Template.baseTemplate.transform(bemjson, data);
    };

    Template.prototype = {

        /**
         * Применить BEMJSON к шаблону.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @param {object} [baseBemjson] Базовый BEMJSON из входящих данных
         * @param {string[]} [modesFromAnotherTemplates] Список полей, которые были установлены из других шаблонов
         * @param {number} [index] Порядковый номер шаблона в общем списке
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson, data, baseBemjson, modesFromAnotherTemplates, index) {
            for(var i = 0; i < this._matches.length; i++) {
                if(this._matches[i].is(bemjson)) {
                    return this.transform(object.clone(bemjson), data, baseBemjson, modesFromAnotherTemplates, index);
                }
            }
            return null;
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @param {object} [baseBemjson=bemjson] Базовый BEMJSON из входящих данных
         * @param {string[]} [modesFromAnotherTemplates={}] Список полей, которые были установлены из других шаблонов
         * @param {number} [index=0] Порядковый номер шаблона в общем списке
         * @returns {Node}
         */
        transform: function(bemjson, data, baseBemjson, modesFromAnotherTemplates, index) {
            var modes = new this.Modes(bemjson, data);

            for(var i = 0, len = Template._defaultModesNames.length; i < len; i++) {
                var modeName = Template._defaultModesNames[i],
                    modeInfo = this._getMode(
                        modes,
                        bemjson,
                        modeName,
                        baseBemjson || bemjson,
                        modesFromAnotherTemplates || {},
                        index || 0
                    );

                if(modeName === 'content' && modeInfo.value && modeInfo.priority === this._valuePriorities.THIS) {
                    /**
                     * Имя блока текущего узла.
                     *
                     * Необходимо для корректной установки контекстуального блока
                     * элементам, которые добавляются в содержимое в текущем шаблоне.
                     *
                     * @private
                     * @type {string}
                     */
                    modeInfo.value.__templateBlock__ = bemjson.block;
                }

                bemjson[modeName] = modeInfo.value;
            }

            return new Node(bemjson);
        },

        /**
         * Наследовать шаблон.
         *
         * @param {Template} template Базовый шаблон
         * @returns {Template}
         */
        extend: function(template) {
            template.Modes = classify(this.Modes, template.modes);
            return template;
        },

        /**
         * Разбить шаблон на шаблоны с единичными селекторами.
         *
         * @returns {Template[]}
         */
        split: function() {
            return Object.keys(this._patterns).map(function(key) {
                return new Template(this._patterns[key], this.modes).helper(this._helpers.get());
            }, this);
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
                object.each(nameOrList, function(name, callback) {
                    this._helpers.add(name, callback);
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
            return classify(classify(this._getBaseModes()), this._functionifyModes(this.modes));
        },

        /**
         * Получить базовые поля для класса.
         *
         * @private
         * @returns {object}
         */
        _getBaseModes: function() {
            return object.extend(this._functionifyModes(this._getDefaultModes()), this._helpers.get());
        },

        /**
         * Обернуть все поля в функции.
         *
         * Все поля должны являться функциями для
         * возможности вызова `__base` в любой ситуации.
         *
         * Поля, не являющиеся функциями, оборачиваются
         * в анонимную функцию со свойством `__wrapped__`.
         *
         * @private
         * @param {object} modes Поля
         * @returns {object}
         */
        _functionifyModes: function(modes) {
            object.each(modes, function(name, val) {
                if(!is.function(val)) {
                    modes[name] = function() {
                        if(is.array(val)) return array.deepClone(val);
                        if(is.map(val)) return object.deepClone(val);
                        return val;
                    };
                    modes[name].__wrapped__ = true;
                }
            }, this);
            return modes;
        },

        /**
         * Получить стандартные моды.
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
                tag: true,
                single: undefined,
                cls: '',
                content: '',
                options: {}
            };
        },

        /**
         * Словарь для идентификации места установления значения моды.
         *
         * @private
         * @readonly
         * @typedef ValuePriorities
         * @enum {string}
         * @prop {string} THIS Текущий шаблон
         * @prop {string} ANOTHER Другой шаблон
         * @prop {string} BEMJSON Входящие данные
         */
        _valuePriorities: {
            THIS: 'this',
            ANOTHER: 'another',
            BEMJSON: 'bemjson'
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
         * @param {object} baseBemjson Базовый BEMJSON из входящих данных
         * @param {string[]} modesFromAnotherTemplates Список полей, которые были установлены из других шаблонов
         * @param {number} index Порядковый номер шаблона в общем списке
         * @returns {{value: *, priority: ValuePriorities}}
         */
        _getMode: function(modes, bemjson, name, baseBemjson, modesFromAnotherTemplates, index) {
            var isValFunc = !modes[name].__wrapped__,
                bemjsonVal = bemjson[name],
                baseBemjsonVal = baseBemjson[name],
                val = modes[name].call(modes, bemjsonVal),
                priorityVal = this._getPriorityValue(
                    name,
                    val,
                    bemjsonVal,
                    baseBemjsonVal,
                    isValFunc,
                    modesFromAnotherTemplates,
                    { weight: this.weight, index: index }
                );

            if(!isValFunc) {
                if(is.array(val, bemjsonVal)) {
                    priorityVal.value = bemjsonVal.concat(val);
                } else if(is.map(val, bemjsonVal)) {
                    priorityVal.value = this._isThisTemplatePriority(index, modesFromAnotherTemplates[name], isValFunc)
                        ? object.extend(object.clone(bemjsonVal), val)
                        : object.extend(object.clone(val), bemjsonVal);
                }
            }

            return priorityVal;
        },

        /**
         * Получить приоритетное значение моды.
         *
         * Если значение моды в шаблоне задано функцией,
         * то оно является приоритетным.
         *
         * @private
         * @param {string} name Имя требуемой моды
         * @param {*} val Значение моды в шаблоне
         * @param {*} bemjsonVal Значение моды в BEMJSON
         * @param {*} baseBemjsonVal Значение моды базового BEMJSON из входящих данных
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @param {string[]} modesFromAnotherTemplates Список полей, которые были установлены из других шаблонов
         * @param {object} info Информация для добавления в список полей, установленных из шаблонов
         * @returns {{value: *, priority: ValuePriorities}}
         */
        _getPriorityValue: function(name, val, bemjsonVal, baseBemjsonVal, isValFunc, modesFromAnotherTemplates, info) {
            var isOwn = !!~this._modesNames.indexOf(name),
                isThisTemplatePriority = this._isThisTemplatePriority(
                    info.index,
                    modesFromAnotherTemplates[name],
                    isValFunc
                );

            if(isThisTemplatePriority && isOwn) {
                modesFromAnotherTemplates[name] = info;
                return {
                    value: val,
                    priority: this._valuePriorities.THIS
                };
            }

            if(!modesFromAnotherTemplates[name] && !is.undefined(baseBemjsonVal)) {
                return {
                    value: baseBemjsonVal,
                    priority: this._valuePriorities.BEMJSON
                };
            }

            if(is.undefined(val) || modesFromAnotherTemplates[name] && (!isOwn || !isThisTemplatePriority)) {
                return {
                    value: bemjsonVal,
                    priority: this._valuePriorities.ANOTHER
                };
            }

            if(isOwn) {
                modesFromAnotherTemplates[name] = info;
            }

            return {
                value: val,
                priority: this._valuePriorities.THIS
            };
        },

        /**
         * Проверить приоритет моды текущего шаблона.
         *
         * @private
         * @param {number} index Порядковый номер текущего шаблона в общем списке
         * @param {object} modeFromAnotherTemplate Информация об установке моды из другого шаблона
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @returns {boolean}
         */
        _isThisTemplatePriority: function(index, modeFromAnotherTemplate, isValFunc) {
            // Мода не была установлена в другом шаблоне, значит приоритет имеет BEMJSON или функция шаблона.
            if(!modeFromAnotherTemplate) return isValFunc;

            if(modeFromAnotherTemplate.weight > this.weight) return false;
            if(modeFromAnotherTemplate.weight === this.weight) {
                return modeFromAnotherTemplate.index <= index;
            }

            return true;
        }

    };

    /**
     * Базовый шаблон.
     *
     * @type {Template}
     */
    Template.baseTemplate = new Template('', {});

    /**
     * Стандартные моды базового шаблона.
     *
     * @private
     * @type {object}
     */
    Template._defaultModes = Template.baseTemplate._getDefaultModes();

    /**
     * Список имён стандартных мод.
     *
     * @private
     * @type {array}
     */
    Template._defaultModesNames = Object.keys(Template._defaultModes);

    return Template;

}).call(global, Match, classify, Node, Selector, Helpers, object, array, string, is),
Tree = (function (Template, is, object) {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @constructor
     * @param {object} tree BEMJSON-дерево
     * @param {Pool} pool Список шаблонов
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
         * Получить список узлов и примитивов
         * на основе массива контента.
         *
         * @private
         * @param {array} bemjson Массив
         * @param {object} data Данные по сущности в дереве
         * @param {object} [data.context] Информация о родительском контексте
         * @param {string} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @param {string} [data.context.elem] Имя родительского элемента
         * @param {object} [data.context.elemMods] Модификаторы родительского элемента
         * @param {object} [context] Информация о контекстуальном блоке
         * @param {string} [context.block] Имя контекстуального блока
         * @param {object} [context.mods] Модификаторы контекстуального блока
         * @returns {array}
         */
        _getContentList: function(bemjson, data, context) {
            var list = [];
            for(var index = 0, len = bemjson.length; index < len; index++) {
                var item = bemjson[index],
                    elemData = {
                        index: index,
                        length: bemjson.length
                    };

                if(item) {
                    elemData.context = data.context;

                    if(bemjson.__templateBlock__) {
                        item.__templateBlock__ = bemjson.__templateBlock__;
                    }
                }

                var node = is.array(item)
                    ? this._getContentList(item, data, context)
                    : this._getNode(item, elemData, context);

                list = list.concat(node);
            }

            delete bemjson.__templateBlock__;

            return list;
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
         * @param {object} [data.context] Информация о родительском контексте
         * @param {string} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @param {string} [data.context.elem] Имя родительского элемента
         * @param {object} [data.context.elemMods] Модификаторы родительского элемента
         * @param {object} [context] Информация о контекстуальном блоке
         * @param {string} [context.block] Имя контекстуального блока
         * @param {object} [context.mods] Модификаторы контекстуального блока
         * @returns {Node|*}
         */
        _getNode: function(bemjson, data, context) {
            if(!is.map(bemjson)) return bemjson === undefined ? '' : bemjson;

            data = data || {};
            context = context || {};

            if(!bemjson.block && bemjson.elem) {

                if(bemjson.__templateBlock__) {
                    context.block = bemjson.__templateBlock__;
                    delete bemjson.__templateBlock__;
                }

                bemjson.block = context.block;
                bemjson.mods = object.extend(object.clone(context.mods), bemjson.mods || {});
            }

            var node = this._pool.find(bemjson, data) || Template.base(bemjson, data),
                nodeBemjson = node.bemjson();

            if(nodeBemjson.block) {
                data.context = {
                    block: nodeBemjson.block,
                    mods: object.clone(nodeBemjson.mods)
                };

                if(node.isBlock()) {
                    context = {
                        block: data.context.block,
                        mods: data.context.mods
                    };
                } else {
                    data.context.elem = nodeBemjson.elem;
                    data.context.elemMods = nodeBemjson.elemMods;
                }
            }

            return node.content(this[
                is.array(nodeBemjson.content) ? '_getContentList' : '_getNode'
            ](nodeBemjson.content, data, context));
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
modules = (function (Tag, Selector, Node, Match) {

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

}).call(global, Tag, Selector, Node, Match),
bemer = definer.export("bemer", (function ( /* jshint maxparams: false */
    Tag, Tree, Template, Pool, Selector, Node, Helpers, functions, object, is, modules
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
    bemer.match = function(pattern, modes) { /* jshint unused: false */
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
        xhtml: {
            repeatBooleanAttr: Tag.repeatBooleanAttr,
            closeSingleTag: Tag.closeSingleTag
        },
        escape: {
            content: Tag.escapeContent,
            attr: Tag.escapeAttr
        },
        tag: Tag.defaultName,
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
     * @param {boolean|object} [config.xhtml=false] Флаг формирования тегов в формате XHTML
     * @param {boolean} [config.xhtml.repeatBooleanAttr=false] Флаг автоповтора булева атрибута
     * @param {boolean} [config.xhtml.closeSingleTag=false] Флаг закрытия одиночного тега
     *
     * @param {boolean|object} [config.escape=true] Флаг экранирования спецсимволов
     * @param {boolean} [config.escape.content=true] Флаг экранирования содержимого
     * @param {boolean} [config.escape.attr=true] Флаг экранирования значений атрибутов
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

        if(config.xhtml !== undefined) {
            if(is.boolean(config.xhtml)) {
                Tag.repeatBooleanAttr = config.xhtml;
                Tag.closeSingleTag = config.xhtml;
            } else {
                if(is.boolean(config.xhtml.repeatBooleanAttr)) {
                    Tag.repeatBooleanAttr = config.xhtml.repeatBooleanAttr;
                }
                if(is.boolean(config.xhtml.closeSingleTag)) {
                    Tag.closeSingleTag = config.xhtml.closeSingleTag;
                }
            }
        }

        var escape = Node.resolveOptionEscape(config.escape);
        Tag.escapeContent = escape.content;
        Tag.escapeAttr = escape.attrs;

        if(config.tag) {
            Tag.defaultName = config.tag;
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

}).call(global, Tag, Tree, Template, Pool, Selector, Node, Helpers, functions, object, is, modules)),
molotok = definer.export("molotok", (function (
        is, string, number, array, object, functions
    ) {

    return {
        is: is,
        string: string,
        number: number,
        array: array,
        object: object,
        functions: functions
    };

}).call(global, is, string, number, array, object, functions));
["inherit"].forEach(function(g) { delete global[g]; });
})(this);