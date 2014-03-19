definer('is', /** @exports is */ function() {

    /**
     * Модуль работы с типами данных.
     *
     * @class
     */
    function is() {}

    is.constructor = {
        string: String,
        number: Number,
        boolean: Boolean,
        array: Array,
        object: Object,
        func: Function,
        date: Date,
        regexp: RegExp
    };

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

    is.proto = {
        array: Array.prototype,
        error: Error.prototype,
        object: Object.prototype,
        string: String.prototype
    };

    is.reNative = RegExp('^' +
        String(is.proto.object.toString)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    is.string = function() {
        return is._primitive(arguments, 'string');
    };

    is.number = function() {
        return is._primitive(arguments, 'number');
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
            return typeof this === 'object' && typeof this.length == 'number' &&
                is.proto.object.toString.call(this) === is.class.arguments || false;
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
            if(!(is.proto.object.toString.call(this) === is.class.object) || is.argument(this)) {
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
            return typeof this === 'object' && is.proto.object.toString.call(this) === is.class.date || false;
        });
    };

    is.nan = function() {
        return is._every(arguments, function() {
            return is.number(this) && this != +this;
        });
    };

    is.regexp = function() {
        return is._every(arguments, function() {
            return (is.function(this) || typeof this === 'object') &&
                is.proto.object.toString.call(this) === is.class.regexp || false;
        });
    };

    is.type = function() {
        var args = arguments,
            firstType;

        ['string', 'nan', 'number', 'boolean', 'null', 'undefined', 'array',
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

    is.every = function() {};

    is._primitive = function(args, type) {
        return is._every(args, function() {
            return typeof this === type ||
                typeof this === 'object' && is.proto.object.toString.call(this) === is.class[type] || false;
        });
    };

    is._every = function(args, callback) {
        return Object.keys(args).every(function(arg) {
            return callback.call(args[arg], args[arg]);
        });
    };

    return is;

});
