definer('Template', /** @exports Template */ function(Match, classify, Node, object, string, is) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) {

        var patterns = [].slice.call(arguments, 0, -1);

        /**
         * Экземпляры матчера.
         *
         * @private
         * @type {Match[]}
         */
        this._matches = Object.keys(patterns).reduce(function(matches, key) {
            matches.push(new Match(patterns[key]));
            return matches;
        }, []);

        /**
         * Моды для преобразования узла.
         *
         * @private
         * @type {object}
         */
        this._modes = [].slice.call(arguments, -1)[0];

        /**
         * Стандартные моды.
         *
         * @type {object}
         */
        this.defaultModes = {
            js: true,
            bem: true,
            mods: {},
            elemMods: {},
            attrs: {},
            mix: [],
            tag: 'div',
            cls: '',
            content: ''
        };

        /**
         * Класс по модам.
         *
         * @private
         * @type {Function}
         */
        this.Modes = classify(classify(this.defaultModes), this._modes);
    }

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
         * Преобразовать BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @returns {Node}
         */
        transform: function(bemjson) {
            var modes = new this.Modes(bemjson);

            Object.keys(this.defaultModes).forEach(function(mode) {
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
            this.Modes = classify(template.Modes, this._modes);
            return this;
        },

        /**
         * Получить значение моды.
         *
         * @private
         * @param {Object} modes Экземпляр класса по модам
         * @param {object} bemjson Входящий BEMJSON
         * @param {string} name Имя требуемой моды
         * @returns {*}
         */
        _getMode: function(modes, bemjson, name) {
            var val = is.function(modes[name]) ? modes[name].call(modes) : modes[name],
                bemjsonVal = bemjson[name],
                resolvedVal = bemjsonVal || val;

            this._checkTypes(is.type(this.defaultModes[name]), [val, bemjsonVal], name);

            if(is.array(val, bemjsonVal)) {
                return bemjsonVal.concat(val);
            } else if(is.map(val, bemjsonVal)) {
                return object.extend(val, bemjsonVal);
            }

            if(name === 'content' && is.string(resolvedVal)) {
                return string.htmlEscape(resolvedVal);
            }

            return resolvedVal;
        },

        /**
         * Проверить тип данных для моды.
         *
         * @private
         * @param {string} valid Эталонный тип
         * @param {*[]} values Список значений к проверке
         * @param {string} name Имя моды
         * @throws {TypeError} Неверный тип данных
         */
        _checkTypes: function(valid, values, name) {
            if(name === 'content') return;
            values.forEach(function(val) {
                if(val !== undefined && is.type(val) !== valid) {
                    throw new TypeError(val + ' is wrong type of mode ' + name);
                }
            });
        }

    };

    return Template;

});
