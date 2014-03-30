definer('Match', /** @exports Match */ function(Name, object) {

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
         * @type {Name}
         */
        this._pattern = new Name(pattern);
    }

    /**
     * Символ любого значения.
     *
     * @type {string}
     */
    Match.any = '*';

    Match.prototype = {

        /**
         * Проверить узел на соответствие шаблону.
         *
         * @param {object} node Узел
         * @returns {boolean}
         */
        is: function(node) {
            return (
                this._block(node.block) &&
                this._blockMod(node.mods) &&
                this._elem(node.elem) &&
                this._elemMod(node.elemMods)
            );
        },

        /**
         * Проверить узел на точное соответствие (эквивалент) шаблону.
         *
         * @param {object} node Узел
         * @returns {boolean}
         */
        equal: function(node) {
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
            return pattern === Match.any || pattern === block;
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

            if(!pattern && !elem) {
                return true;
            }

            return pattern === Match.any || pattern === elem;
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

            if(patternName === Match.any && patternVal === Match.any) {
                return true;
            }

            if(patternName === Match.any) {
                return patternVal === val;
            }

            // Вторая проверка на булев модификатор
            if(patternVal === Match.any || !patternVal && val === true) {
                return patternName === name;
            }

            return patternName === name && patternVal === val;
        }

    };

    return Match;

});
