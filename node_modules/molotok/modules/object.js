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

});
