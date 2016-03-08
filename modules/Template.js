definer('Template', /** @exports Template */ function( /* jshint maxparams: false */
    Match, classify, Node, Selector, Helpers, object, array, string, is
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
         * @type {object}
         */
        this.modes = [].slice.call(arguments, -1)[0];

        /**
         * Имена мод шаблона.
         *
         * @private
         * @type {string[]}
         */
        this._modesNames = Object.keys(this.modes);

        /**
         * Вес шаблона.
         *
         * Рассчитать вес шаблона возможно при наличии только одного селектора.
         * При наличии в шаблоне нескольких селекторов его вес устанавливается как `null`.
         *
         * @type {?number}
         */
        this.weight = this._patterns.length === 1
            ? new Selector(this._patterns[0]).weight()
            : null;

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
        this._matches = Object.keys(this._patterns).map(function(key) {
            return new Match(this._patterns[key]);
        }, this);

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
         * @param {object} [baseBemjson] Базовый BEMJSON из входящих данных
         * @param {string[]} [modesFromAnotherTemplates] Список полей, которые были установлены из других шаблонов
         * @param {number} [index] Порядковый номер шаблона в общем списке
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson, data, baseBemjson, modesFromAnotherTemplates, index) {
            for(var i = 0; i < this._matches.length; i++) {
                if(this._matches[i].is(bemjson)) {
                    return this.transform(object.clone(bemjson), data, baseBemjson, modesFromAnotherTemplates, index);
                }
            }
            return null;
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @param {object} bemjson Входящий BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @param {object} [baseBemjson=bemjson] Базовый BEMJSON из входящих данных
         * @param {string[]} [modesFromAnotherTemplates={}] Список полей, которые были установлены из других шаблонов
         * @param {number} [index=0] Порядковый номер шаблона в общем списке
         * @returns {Node}
         */
        transform: function(bemjson, data, baseBemjson, modesFromAnotherTemplates, index) {
            var modes = new this.Modes(bemjson, data);

            for(var i = 0, len = Template._defaultModesNames.length; i < len; i++) {
                var modeName = Template._defaultModesNames[i],
                    modeInfo = this._getMode(
                        modes,
                        bemjson,
                        modeName,
                        baseBemjson || bemjson,
                        modesFromAnotherTemplates || {},
                        index || 0
                    );

                if(modeName === 'content' && modeInfo.value && modeInfo.priority === this._valuePriorities.THIS) {
                    /**
                     * Имя блока текущего узла.
                     *
                     * Необходимо для корректной установки контекстуального блока
                     * элементам, которые добавляются в содержимое в текущем шаблоне.
                     *
                     * @private
                     * @type {string}
                     */
                    modeInfo.value.__templateBlock__ = bemjson.block;
                }

                bemjson[modeName] = modeInfo.value;
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
            template.Modes = classify(this.Modes, template.modes);
            return template;
        },

        /**
         * Разбить шаблон на шаблоны с единичными селекторами.
         *
         * @returns {Template[]}
         */
        split: function() {
            return Object.keys(this._patterns).map(function(key) {
                return new Template(this._patterns[key], this.modes).helper(this._helpers.get());
            }, this);
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
            return classify(classify(this._getBaseModes()), this._functionifyModes(this.modes));
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
         * @param {object} modes Поля
         * @returns {object}
         */
        _functionifyModes: function(modes) {
            object.each(modes, function(name, val) {
                if(!is.function(val)) {
                    modes[name] = function() {
                        if(is.array(val)) return array.deepClone(val);
                        if(is.map(val)) return object.deepClone(val);
                        return val;
                    };
                    modes[name].__wrapped__ = true;
                }
            }, this);
            return modes;
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
         * Словарь для идентификации места установления значения моды.
         *
         * @private
         * @readonly
         * @typedef ValuePriorities
         * @enum {string}
         * @prop {string} THIS Текущий шаблон
         * @prop {string} ANOTHER Другой шаблон
         * @prop {string} BEMJSON Входящие данные
         */
        _valuePriorities: {
            THIS: 'this',
            ANOTHER: 'another',
            BEMJSON: 'bemjson'
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
         * @param {object} baseBemjson Базовый BEMJSON из входящих данных
         * @param {string[]} modesFromAnotherTemplates Список полей, которые были установлены из других шаблонов
         * @param {number} index Порядковый номер шаблона в общем списке
         * @returns {{value: *, priority: ValuePriorities}}
         */
        _getMode: function(modes, bemjson, name, baseBemjson, modesFromAnotherTemplates, index) {
            var isValFunc = !modes[name].__wrapped__,
                bemjsonVal = bemjson[name],
                baseBemjsonVal = baseBemjson[name],
                val = modes[name].call(modes, bemjsonVal),
                priorityVal = this._getPriorityValue(
                    name,
                    val,
                    bemjsonVal,
                    baseBemjsonVal,
                    isValFunc,
                    modesFromAnotherTemplates,
                    { weight: this.weight, index: index }
                );

            if(!isValFunc) {
                if(is.array(val, bemjsonVal)) {
                    priorityVal.value = bemjsonVal.concat(val);
                } else if(is.map(val, bemjsonVal)) {
                    priorityVal.value = this._isThisTemplatePriority(index, modesFromAnotherTemplates[name], isValFunc)
                        ? object.extend(object.clone(bemjsonVal), val)
                        : object.extend(object.clone(val), bemjsonVal);
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
         * @param {string} name Имя требуемой моды
         * @param {*} val Значение моды в шаблоне
         * @param {*} bemjsonVal Значение моды в BEMJSON
         * @param {*} baseBemjsonVal Значение моды базового BEMJSON из входящих данных
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @param {string[]} modesFromAnotherTemplates Список полей, которые были установлены из других шаблонов
         * @param {object} info Информация для добавления в список полей, установленных из шаблонов
         * @returns {{value: *, priority: ValuePriorities}}
         */
        _getPriorityValue: function(name, val, bemjsonVal, baseBemjsonVal, isValFunc, modesFromAnotherTemplates, info) {
            var isOwn = !!~this._modesNames.indexOf(name),
                isThisTemplatePriority = this._isThisTemplatePriority(
                    info.index,
                    modesFromAnotherTemplates[name],
                    isValFunc
                );

            if(isThisTemplatePriority && isOwn) {
                modesFromAnotherTemplates[name] = info;
                return {
                    value: val,
                    priority: this._valuePriorities.THIS
                };
            }

            if(!modesFromAnotherTemplates[name] && !is.undefined(baseBemjsonVal)) {
                return {
                    value: baseBemjsonVal,
                    priority: this._valuePriorities.BEMJSON
                };
            }

            if(is.undefined(val) || modesFromAnotherTemplates[name] && (!isOwn || !isThisTemplatePriority)) {
                return {
                    value: bemjsonVal,
                    priority: this._valuePriorities.ANOTHER
                };
            }

            if(isOwn) {
                modesFromAnotherTemplates[name] = info;
            }

            return {
                value: val,
                priority: this._valuePriorities.THIS
            };
        },

        /**
         * Проверить приоритет моды текущего шаблона.
         *
         * @private
         * @param {number} index Порядковый номер текущего шаблона в общем списке
         * @param {object} modeFromAnotherTemplate Информация об установке моды из другого шаблона
         * @param {boolean} isValFunc Значение моды в шаблоне может быть задано функцией
         * @returns {boolean}
         */
        _isThisTemplatePriority: function(index, modeFromAnotherTemplate, isValFunc) {
            // Мода не была установлена в другом шаблоне, значит приоритет имеет BEMJSON или функция шаблона.
            if(!modeFromAnotherTemplate) return isValFunc;

            if(modeFromAnotherTemplate.weight > this.weight) return false;
            if(modeFromAnotherTemplate.weight === this.weight) {
                return modeFromAnotherTemplate.index <= index;
            }

            return true;
        }

    };

    /**
     * Базовый шаблон.
     *
     * @type {Template}
     */
    Template.baseTemplate = new Template('', {});

    /**
     * Стандартные моды базового шаблона.
     *
     * @private
     * @type {object}
     */
    Template._defaultModes = Template.baseTemplate._getDefaultModes();

    /**
     * Список имён стандартных мод.
     *
     * @private
     * @type {array}
     */
    Template._defaultModesNames = Object.keys(Template._defaultModes);

    return Template;

});
