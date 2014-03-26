definer('object', /** @exports object */ function(is) {

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
     * Расширить объект рекурсивно.
     *
     * @param {object} object Расширяемый объект
     * @param {object} source Расширяющий объект
     * @returns {object}
     */
    object.deepExtend = function(object, source) {
        return Object.keys(source).reduce(function(extended, key) {

            extended[key] = is.map(extended[key], source[key])
                ? this.deepExtend(extended[key], source[key])
                : source[key];

            return extended;
        }.bind(this), object);
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

    /**
     * Клонировать объект.
     *
     * @param {object} obj Объект
     * @returns {object}
     */
    object.clone = function(obj) {
        return object.extend({}, obj);
    };

    return object;

});
