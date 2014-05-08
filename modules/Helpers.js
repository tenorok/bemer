definer('Helpers', /** @exports Helpers */ function(object, string, object) {

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
                    }

                },
                this._getStringHelpers(),
                this._getObjectHelpers()
            );
        },

        /**
         * Получить функции-помощники для работы со строками.
         *
         * @private
         * @returns {object}
         */
        _getStringHelpers: function() {

            /**
             * Методы описаны в модуле `string`.
             */
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

        /**
         * Получить функции-помощники для работы с объектами.
         *
         * @private
         * @returns {object}
         */
        _getObjectHelpers: function() {

            /**
             * Методы описаны в модуле `object`.
             */
            return [
                'extend', 'deepExtend',
                'clone', 'deepClone'
            ].reduce(function(helpers, method) {
                    helpers[method] = function() {
                        return object[method].apply(this, arguments);
                    }.bind(object);
                    return helpers;
                }, {});
        }

    };

    return Helpers;

});
