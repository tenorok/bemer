definer('object', /** @exports object */ function() {

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
     * @param {object} source Расширяющий объект
     * @returns {object}
     */
    object.extend = function(object, source) {
        return Object.keys(source).reduce(function(extended, key) {
            extended[key] = source[key];
            return extended;
        }, object);
    };

    /**
     * Проверить объект на наличие полей.
     *
     * @param {object} object Объект
     * @returns {boolean}
     */
    object.isEmpty = function(object) {
        return !Object.keys(object).length;
    };

    return object;

});
