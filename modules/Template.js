definer('Template', /** @exports Template */ function(Match, classify, Node, Name, Helpers, object, string, is) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) {

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
     * Стандартное значение моды `tag`.
     *
     * @type {string}
     */
    Template.tag = 'div';

    /**
     * Получить БЭМ-узел на основе BEMJSON по базому шаблону.
     *
     * @param {object} bemjson Входящий BEMJSON
     * @returns {Node}
     */
    Template.base = function(bemjson) {
        return new Template(
            new Node(bemjson).isBlock() ? '*' : '*' + Name.delimiters.elem + '*', {}
        ).transform(bemjson);
    };

    Template.prototype = {

        /**
         * Применить BEMJSON к шаблону.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson) {

            for(var i = 0; i < this._matches.length; i++) {
                if(this._matches[i].is(bemjson)) {
                    return this.transform(bemjson);
                }
            }

            return null;
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @returns {Node}
         */
        transform: function(bemjson) {
            var modes = new this.Modes(bemjson);

            Object.keys(this._getDefaultModes()).forEach(function(mode) {
                bemjson[mode] = this._getMode(modes, bemjson, mode);
            }, this);

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
                templates.push(new Template(this._patterns[key], this._modes));
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
         * Добавить пользовательскую функцию-помощник.
         *
         * @param {string} name Имя функции
         * @param {Function} callback Тело функции
         * @returns {Template}
         */
        helper: function(name, callback) {
            this._helpers.add(name, callback);
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
            return classify(classify(this._getBaseProps()), this._modes);
        },

        /**
         * Получить базовые поля для класса.
         *
         * @private
         * @returns {object}
         */
        _getBaseProps: function() {
            return object.extend(this._getDefaultModes(), this._helpers.get());
        },

        /**
         * Получить стандартные моды.
         *
         * Если среди селекторов шаблона присутствует хотя бы
         * один блок, то будут отданы стандартные моды для блоков.
         *
         * @private
         * @returns {object}
         */
        _getDefaultModes: function() {

            var hasBlock = this._patterns.some(function(pattern) {
                return new Name(pattern).isBlock();
            }, this);

            return {
                js: hasBlock,
                bem: true,
                mods: {},
                elemMods: {},
                attrs: {},
                mix: [],
                tag: Template.tag,
                cls: '',
                content: ''
            };
        },

        /**
         * Получить значение моды.
         *
         * Значения в виде массивов конкатенируются.
         *
         * Значения в виде объектов (карт) наследуются.
         *
         * Если значение в шаблоне скалярное, то приоритет у BEMJSON.
         * Если значение в шаблоне задано функцией, то приоритет у шаблона.
         *
         * @private
         * @param {Object} modes Экземпляр класса по модам
         * @param {object} bemjson Входящий BEMJSON
         * @param {string} name Имя требуемой моды
         * @returns {*}
         */
        _getMode: function(modes, bemjson, name) {
            var isValFunc = is.function(modes[name]),
                val = isValFunc ? modes[name].call(modes) : modes[name],
                bemjsonVal = bemjson[name],
                priorityVal = this._getPriorityValue(isValFunc, val, bemjsonVal);

            if(is.array(val, bemjsonVal)) {
                return bemjsonVal.concat(val);
            } else if(is.map(val, bemjsonVal)) {
                return isValFunc
                    ? object.extend(bemjsonVal, val)
                    : object.extend(object.clone(val), bemjsonVal);
            }

            if(name === 'content' && is.string(priorityVal)) {
                return string.htmlEscape(priorityVal);
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

    return Template;

});
