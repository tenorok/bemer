definer('Helpers', /** @exports Helpers */ function(string, number, object, is) {

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
    Helpers.idSalt = new Date().getTime();

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
                    'escape', 'htmlEscape', 'unHtmlEscape',
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

});
