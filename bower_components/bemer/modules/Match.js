definer('Match', /** @exports Match */ function(Selector, object, is) {

    /**
     * Модуль проверки БЭМ-узла на соответствие шаблону.
     *
     * @constructor
     * @param {string} pattern Шаблон
     */
    function Match(pattern) {

        /**
         * Экземпляр шаблона.
         *
         * @private
         * @type {Selector}
         */
        this._pattern = new Selector(pattern);
    }

    Match.prototype = {

        /**
         * Получить/установить шаблон.
         *
         * @param {string} [pattern] Шаблон
         * @returns {Selector|Match}
         */
        pattern: function(pattern) {
            if(pattern === undefined) {
                return this._pattern;
            }

            this._pattern = new Selector(pattern);
            return this;
        },

        /**
         * Проверить узел или имя на соответствие шаблону.
         *
         * @param {object|string} test Узел или имя БЭМ-сущности
         * @returns {boolean}
         */
        is: function(test) {
            return this[is.string(test) ? '_isName' : '_isNode'](test);
        },

        /**
         * Проверить узел или имя на точное соответствие (эквивалент) шаблону.
         *
         * @param {object|string} test Узел или имя БЭМ-сущности
         * @returns {boolean}
         */
        equal: function(test) {
            return this[is.string(test) ? '_equalName' : '_equalNode'](test);
        },

        /**
         * Проверить имя на неточное или точное соответствие шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @param {string} method Имя метода для проверки узла: `_isNode` или `_equalNode`
         * @returns {boolean}
         */
        _name: function(name, method) {
            name = new Selector(name);

            var mods = {};
            mods[name.modName()] = name.modVal();

            var elemMods = {};
            elemMods[name.elemModName()] = name.elemModVal();

            return this[method]({
                block: name.block(),
                mods: mods,
                elem: name.elem(),
                elemMods: elemMods
            });
        },

        /**
         * Проверить имя на соответствие шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @returns {boolean}
         */
        _isName: function(name) {
            return this._name(name, '_isNode');
        },

        /**
         * Проверить узел на соответствие шаблону.
         *
         * @private
         * @param {object} node Узел
         * @returns {boolean}
         */
        _isNode: function(node) {
            return (
                this._block(node.block) &&
                this._blockMod(node.mods) &&
                this._elem(node.elem) &&
                this._elemMod(node.elemMods)
            );
        },

        /**
         * Проверить имя на точное соответствие (эквивалент) шаблону.
         *
         * @private
         * @param {string} name Имя БЭМ-сущности
         * @returns {boolean}
         */
        _equalName: function(name) {
            return this._name(name, '_equalNode');
        },

        /**
         * Проверить узел на точное соответствие (эквивалент) шаблону.
         *
         * @private
         * @param {object} node Узел
         * @returns {boolean}
         */
        _equalNode: function(node) {
            return (
                this._block(node.block) &&
                this._equalBlockMod(node.mods) &&
                this._elem(node.elem) &&
                this._equalElemMod(node.elemMods)
            );
        },

        /**
         * Проверить блок на соответствие шаблону.
         *
         * @private
         * @param {string} block Имя блока узла
         * @returns {boolean}
         */
        _block: function(block) {
            var pattern = this._pattern.block();
            return pattern === Selector.any || block === Selector.any || pattern === block;
        },

        /**
         * Проверить модификаторы блока на соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы блока узла
         * @returns {boolean}
         */
        _blockMod: function(mods) {
            if(this._pattern.isBlock() && !this._pattern.modName() && !this._pattern.modVal()) {
                return true;
            }

            return this._equalBlockMod(mods);
        },

        /**
         * Проверить модификаторы блока на точное соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы блока узла
         * @returns {boolean}
         */
        _equalBlockMod: function(mods) {
            return this._anyMod(this._pattern.modName(), this._pattern.modVal(), mods);
        },

        /**
         * Проверить элемент на соответствие шаблону.
         *
         * @private
         * @param {string} elem Имя элемента узла
         * @returns {boolean}
         */
        _elem: function(elem) {
            var pattern = this._pattern.elem();

            if(elem && !pattern) {
                return false;
            }

            if(!elem) {
                return !pattern;
            }

            return pattern === Selector.any || elem === Selector.any || pattern === elem;
        },

        /**
         * Проверить модификаторы элемента на соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _elemMod: function(mods) {
            if(this._pattern.isElem() && !this._pattern.elemModName() && !this._pattern.elemModVal()) {
                return true;
            }

            return this._equalElemMod(mods);
        },

        /**
         * Проверить модификаторы элемента на точное соответствие шаблону.
         *
         * @private
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _equalElemMod: function(mods) {
            return this._anyMod(this._pattern.elemModName(), this._pattern.elemModVal(), mods);
        },

        /**
         * Проверить модификаторы блока или элемента на соответствие шаблону.
         *
         * @private
         * @param {string} patternName Шаблон имени модификатора
         * @param {string} patternVal Шаблон значения модификатора
         * @param {object} mods Модификаторы элемента узла
         * @returns {boolean}
         */
        _anyMod: function(patternName, patternVal, mods) {
            if(!patternName && !mods) {
                return true;
            }

            if(!mods) {
                return false;
            }

            return object.isEmpty(mods) || Object.keys(mods).some(function(name) {
                return this._mod(patternName, patternVal, name, mods[name]);
            }, this);
        },

        /**
         * Проверить модификатор на соответствие шаблону.
         *
         * @private
         * @param {string} patternName Шаблон имени модификатора
         * @param {string} patternVal Шаблон значения модификатора
         * @param {string} name Имя проверяемого модификатора
         * @param {string} val Значение проверяемого модификатора
         * @returns {boolean}
         */
        _mod: function(patternName, patternVal, name, val) {
            var any = Selector.any;

            if(patternName === any && patternVal === any || name === any && val === any) {
                return true;
            }

            if(patternName === any) {
                return val === any || patternVal === val;
            }

            if(name === any) {
                return patternVal === any || patternVal === val;
            }

            // Вторая проверка на булев модификатор
            if(patternVal === any || !patternVal && val === true) {
                return name === any || patternName === name;
            }

            if(val === any) {
                return patternName === any || patternName === name;
            }

            return patternName === name && patternVal === val;
        }

    };

    return Match;

});
