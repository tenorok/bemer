definer('is', /** @exports is */ function() {

    /**
     * Модуль работы с типами данных.
     *
     * @class
     */
    function is() {}

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

    is.toString = Object.prototype.toString;

    is.reNative = RegExp('^' +
        String(is.toString)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    is.string = function() {
        return is._primitive(arguments, 'string');
    };

    is.number = function() {
        return !is.nan.apply(this, arguments) && is._primitive(arguments, 'number');
    };

    is.nan = function() {
        return is._every(arguments, function(n) {
            return typeof n === 'number' && isNaN(n) && !is.undefined(n);
        });
    };

    is.boolean = function() {
        return is._primitive(arguments, 'boolean');
    };

    is.null = function() {
        return is._every(arguments, function(n) {
            return n === null;
        });
    };

    is.undefined = function() {
        return is._every(arguments, function(u) {
            return typeof u === 'undefined';
        });
    };

    is.array = function() {
        return is._every(arguments, function() {
            return Array.isArray(this);
        });
    };

    is.argument = function() {
        return is._every(arguments, function() {
            return typeof this === 'object' && typeof this.length === 'number' &&
                is._isToString(this, 'arguments') || false;
        });
    };

    is.function = function() {
        return is._every(arguments, function() {
            return typeof this === 'function';
        });
    };

    is.native = function() {
        return is._every(arguments, function() {
            return is.function(this) && is.reNative.test(this);
        });
    };

    is.map = function() {
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

    is.date = function() {
        return is._every(arguments, function() {
            return typeof this === 'object' && is._isToString(this, 'date') || false;
        });
    };

    is.regexp = function() {
        return is._every(arguments, function() {
            return (is.function(this) || typeof this === 'object') && is._isToString(this, 'regexp') || false;
        });
    };

    is.type = function() {
        var args = arguments,
            firstType;

        ['string', 'number', 'nan', 'boolean', 'null', 'undefined', 'array',
         'argument', 'function', 'map', 'date', 'regexp'].some(function(type) {
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

    is.every = function() {
        return is.type.apply(this, arguments) !== 'mixed';
    };

    is._primitive = function(args, type) {
        return is._every(args, function() {
            return typeof this === type || typeof this === 'object' && is._isToString(this, type) || false;
        });
    };

    is._every = function(args, callback) {
        return Object.keys(args).every(function(arg) {
            return callback.call(args[arg], args[arg]);
        });
    };

    is._isToString = function(object, type) {
        return is.toString.call(object) === is.class[type];
    };

    return is;

});
