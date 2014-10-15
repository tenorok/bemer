definer('Template', /** @exports Template */ function( /* jshint maxparams: false */
    Match, classify, Node, Selector, Helpers, object, string, is
) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) { /* jshint unused: false */

        /**
         * Шаблоны для матчинга.
         *
         * @private
         * @type {string[]}
         */
        this._patterns = [].slice.call(arguments, 0, -1);

        /**
         * Моды для преобразования узла.
         *
         * @private
         * @type {object}
         */
        this._modes = [].slice.call(arguments, -1)[0];

        /**
         * Функции-помощники.
         *
         * @private
         * @type {Helpers}
         */
        this._helpers = new Helpers();

        /**
         * Экземпляры матчера.
         *
         * @private
         * @type {Match[]}
         */
        this._matches = Object.keys(this._patterns).reduce(function(matches, key) {
            matches.push(new Match(this._patterns[key]));
            return matches;
        }.bind(this), []);

        /**
         * Класс по модам.
         *
         * @private
         * @type {Function}
         */
        this.Modes = this._classifyModes();
    }

    /**
     * Получить БЭМ-узел на основе BEMJSON по базовому шаблону.
     *
     * @param {object} bemjson Входящий BEMJSON
     * @param {object} [data] Данные по сущности в дереве
     * @returns {Node}
     */
    Template.base = function(bemjson, data) {
        return Template.baseTemplate.transform(bemjson, data);
    };

    Template.prototype = {

        /**
         * Применить BEMJSON к шаблону.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson, data) {

            for(var i = 0; i < this._matches.length; i++) {
                if(this._matches[i].is(bemjson)) {
                    return this.transform(bemjson, data);
                }
            }

            return null;
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node}
         */
        transform: function(bemjson, data) {
            var modes = new this.Modes(bemjson, data);

            for(var i = 0, len = Template._defaultModesNames.length; i < len; i++) {
                var mode = Template._defaultModesNames[i];
                bemjson[mode] = this._getMode(modes, bemjson, mode);
            }

            return new Node(bemjson);
        },

        /**
         * Наследовать шаблон.
         *
         * @param {Template} template Базовый шаблон
         * @returns {Template}
         */
        extend: function(template) {
            template.Modes = classify(this.Modes, template._modes);
            return template;
        },

        /**
         * Разбить шаблон на шаблоны с единичными селекторами.
         *
         * @returns {Template[]}
         */
        split: function() {
            return Object.keys(this._patterns).reduce(function(templates, key) {
                templates.push(new Template(this._patterns[key], this._modes).helper(this._helpers.get()));
                return templates;
            }.bind(this), []);
        },

        /**
         * Проверить шаблон на соответствие.
         *
         * Вернёт `true`, если хотя бы один селектор
         * текущего шаблона и проверяемого пройдёт неточную проверку.
         *
         * @param {Template} template Шаблон
         * @returns {boolean}
         */
        is: function(template) {
            return this._matches.some(function(match) {
                return Object.keys(template._patterns).some(function(key) {
                    return match.is(template._patterns[key]);
                });
            });
        },

        /**
         * Добавить одну или несколько
         * пользовательских функций-помощников.
         *
         * @param {string|object} nameOrList Имя функции или карта помощников
         * @param {function} [callback] Тело функции
         * @returns {Template}
         */
        helper: function(nameOrList, callback) {

            if(is.string(nameOrList)) {
                this._helpers.add(nameOrList, callback);
            } else {
                object.each(nameOrList, function(name, callback) {
                    this._helpers.add(name, callback);
                }, this);
            }

            this.Modes = this._classifyModes();
            return this;
        },

        /**
         * Сформировать класс на основе базовых полей.
         *
         * @private
         * @returns {Function}
         */
        _classifyModes: function() {
            return classify(classify(this._getBaseModes()), this._functionifyModes(this._modes));
        },

        /**
         * Получить базовые поля для класса.
         *
         * @private
         * @returns {object}
         */
        _getBaseModes: function() {
            return object.extend(this._functionifyModes(this._getDefaultModes()), this._helpers.get());
        },

        /**
         * Обернуть все поля в функции.
         *
         * Все поля должны являться функциями для
         * возможности вызова `__base` в любой ситуации.
         *
         * Поля, не являющиеся функциями, оборачиваются
         * в анонимную функцию со свойством `__wrapped__`.
         *
         * @private
         * @param {object} mods Поля
         * @returns {object}
         */
        _functionifyModes: function(mods) {
            object.each(mods, function(name, val) {
                if(!is.function(val)) {
                    mods[name] = function() { return val; };
                    mods[name].__wrapped__ = true;
                }
            });
            return mods;
        },

        /**
         * Получить стандартные моды.
         *
         * @private
         * @returns {object}
         */
        _getDefaultModes: function() {
            return {
                js: false,
                bem: true,
                mods: {},
                elemMods: {},
                attrs: {},
                mix: [],
                tag: true,
                single: undefined,
                cls: '',
                content: '',
                options: {}
            };
        },

        /**
         * Получить значение моды.
         *
         * Если значение в шаблоне скалярное, то массивы конкатенируются,
         * а объекты (карты) наследуются с приоритетом у BEMJSON.
         *
         * @private
         * @param {Object} modes Экземпляр класса по модам
         * @param {object} bemjson Входящий BEMJSON
         * @param {string} name Имя требуемой моды
         * @returns {*}
         */
        _getMode: function(modes, bemjson, name) {
            var isValFunc = !modes[name].__wrapped__,
                bemjsonVal = bemjson[name],
                val = modes[name].call(modes, bemjsonVal),
                priorityVal = this._getPriorityValue(isValFunc, val, bemjsonVal);

            if(!isValFunc) {
                if(is.array(val, bemjsonVal)) {
                    priorityVal = bemjsonVal.concat(val);
                } else if(is.map(val, bemjsonVal)) {
                    priorityVal = object.extend(object.clone(val), bemjsonVal);
                }
            }

            return priorityVal;
        },

        /**
         * Получить приоритетное значение моды.
         *
         * Если значение моды в шаблоне задано функцией,
         * то оно является приоритетным.
         *
         * @private
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @param {*} val Значение моды в шаблоне
         * @param {*} bemjsonVal Значение моды в BEMJSON
         * @returns {*}
         */
        _getPriorityValue: function(isValFunc, val, bemjsonVal) {
            if(isValFunc) return val;
            return is.undefined(bemjsonVal) ? val : bemjsonVal;
        }

    };

    /**
     * Базовый шаблон.
     *
     * @type {Template}
     */
    Template.baseTemplate = new Template('', {});

    /**
     * Список имён стандартных мод.
     *
     * @private
     * @type {array}
     */
    Template._defaultModesNames = Object.keys(Template.baseTemplate._getDefaultModes());

    return Template;

});
