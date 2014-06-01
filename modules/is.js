definer('is', /** @exports is */ function() {

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

});
