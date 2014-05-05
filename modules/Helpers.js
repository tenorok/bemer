definer('Helpers', /** @exports Helpers */ function(object, string) {

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
         * @param {Function} callback Тело функции
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
                __constructor: function(bemjson, data) {
                    this.bemjson = bemjson;
                    this.data = data;
                    this.construct.apply(this, arguments);
                },
                construct: function() {}
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
                isFirst: function() {},
                isLast: function() {}
            }, this._getStringHelpers());
        },

        /**
         * Получить функции-помощники для работы со строками.
         *
         * @private
         * @returns {object}
         */
        _getStringHelpers: function() {
            return [
                'escape', 'htmlEscape', 'unHtmlEscape',
                'trim', 'ltrim', 'rtrim',
                'collapse', 'stripTags',
                'upper', 'lower', 'repeat'
            ].reduce(function(helpers, method) {
                    helpers[method] = function() {
                        return string[method].apply(this, arguments);
                    }.bind(string);
                    return helpers;
                }, {});
        },

    };

    return Helpers;

});
