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

    is.string = function() {
        return is._primitive(arguments, 'string');
    };

    is.number = function() {
        return is._primitive(arguments, 'number');
    };

    is.boolean = function() {
        return is._primitive(arguments, 'boolean');
    };

    is.array = function() {
        return is._every(arguments, function() {
            return Array.isArray(this);
        });
    };

    is.map = function() {};
    is.instance = function() {};

    is.null = function() {};
    is.undefined = function() {};

    is.arguments = function() {};
    is.function = function() {};
    is.date = function() {};
    is.nan = function() {};
    is.regexp = function() {};

    is.type = function() {};
    is.every = function() {};

    is._primitive = function(args, type) {
        return is._every(args, function() {
            return typeof this === type ||
                typeof this === 'object' && is.proto.object.toString.call(this) === is.class[type] || false;
        });
    };

    is._every = function(args, callback) {
        return Object.keys(args).every(function(arg) {
            return callback.call(args[arg]);
        });
    };

    return is;

});
