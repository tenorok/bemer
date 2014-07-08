definer('Selector', /** @exports Selector */ function() {

    /**
     * Модуль работы с БЭМ-селектором.
     *
     * @constructor
     * @param {string} [selector] БЭМ-селектор
     */
    function Selector(selector) {

        /**
         * БЭМ-селектор.
         *
         * @private
         * @type {string}
         */
        this._selector = selector || '';

        /**
         * Имя блока.
         *
         * @private
         * @type {string}
         */
        this._block = '';

        /**
         * Имя модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modName = '';

        /**
         * Значение модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modVal = '';

        /**
         * Имя элемента.
         *
         * @private
         * @type {string}
         */
        this._elem = '';

        /**
         * Имя модификатора элемента.
         *
         * @private
         * @type {string}
         */
        this._elemModName = '';

        /**
         * Значение модификатора элемента.
         *
         * @private
         * @type {string}
         */
        this._elemModVal = '';

        /**
         * Вес селектора.
         *
         * @private
         * @type {number}
         */
        this._weight = 0;

        this.info();
    }

    /**
     * Разделители имён.
     *
     * @type {{mod: string, elem: string}}
     * @property {string} mod Разделитель блока и модификатора, элемента и модификатора, модификатора и значения
     * @property {string} elem Разделитель блока и элемента
     */
    Selector.delimiters = {
        mod: '_',
        elem: '__'
    };

    /**
     * Символ любого значения.
     *
     * @type {string}
     */
    Selector.any = '*';

    Selector.prototype = {

        /**
         * Получить информацию по БЭМ-сущности.
         *
         * @returns {object}
         */
        info: function() {
            var blockAndElem = this._getBlockAndElem(),
                block = this._getObjectAndMods(blockAndElem.block),
                elem = this._getObjectAndMods(blockAndElem.elem);

            return {
                block: this._block = block.object,
                modName: this._modName = block.modName,
                modVal: this._modVal = block.modVal,
                elem: this._elem = elem.object,
                elemModName: this._elemModName = elem.modName,
                elemModVal: this._elemModVal = elem.modVal
            };
        },

        /**
         * Проверить сущность на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !this.isElem();
        },

        /**
         * Проверить сущность на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._elem;
        },

        /**
         * Получить/установить имя блока.
         *
         * @param {string} [name] Имя блока
         * @returns {string|Selector}
         */
        block: function(name) {
            return this._getSet('_block', name);
        },

        /**
         * Получить/установить модификатор блока.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Selector}
         */
        mod: function(name, val) {
            if(name === undefined && val === undefined) return {
                name: this.modName(),
                val: this.modVal()
            };

            this.modName(name);
            this.modVal(val);
            return this;
        },

        /**
         * Получить/установить имя модификатора блока.
         *
         * @param {string} [name] Имя модификатора
         * @returns {string|Selector}
         */
        modName: function(name) {
            return this._getSet('_modName', name);
        },

        /**
         * Получить/установить значение модификатора блока.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Selector}
         */
        modVal: function(val) {
            return this._getSet('_modVal', val);
        },

        /**
         * Получить/установить элемент.
         *
         * @param {string} [name] Имя элемента
         * @returns {string|Selector}
         */
        elem: function(name) {
            return this._getSet('_elem', name);
        },

        /**
         * Получить/установить модификатор элемента.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Selector}
         */
        elemMod: function(name, val) {
            if(name === undefined && val === undefined) return {
                name: this.elemModName(),
                val: this.elemModVal()
            };

            this.elemModName(name);
            this.elemModVal(val);
            return this;
        },

        /**
         * Получить/установить имя модификатора элемента.
         *
         * @param {string} [name] Имя модификатора
         * @returns {string|Selector}
         */
        elemModName: function(name) {
            return this._getSet('_elemModName', name);
        },

        /**
         * Получить/установить значение модификатора элемента.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Selector}
         */
        elemModVal: function(val) {
            return this._getSet('_elemModVal', val);
        },

        /**
         * Получить строковое представление БЭМ-сущности.
         *
         * @returns {string}
         */
        toString: function() {
            var name = [this._block].concat(this._getMod('_modName', '_modVal'));

            if(this._elem) {
                name = name.concat(
                    Selector.delimiters.elem, this._elem,
                    this._getMod('_elemModName', '_elemModVal')
                );
            }

            return name.join('');
        },

        /**
         * Получить/установить вес селектора.
         *
         * @param {number} [weight] Вес селектора
         * @returns {number|Selector}
         */
        weight: function(weight) {
            if(weight) {
                this._weight = weight;
                return this;
            }

            if(this._weight) {
                return this._weight;
            }

            var weights = {
                block: 2,
                modName: 2,
                modVal: 2,
                elem: 10,
                elemModName: 6,
                elemModVal: 6
            };

            return [
                'block', 'modName', 'modVal',
                'elem', 'elemModName', 'elemModVal'
            ].reduce(function(weight, partName) {
                    var part = this[partName]();
                    if(part) {
                        weight += part === Selector.any ? weights[partName] / 2 : weights[partName];
                    }
                    return weight;
                }.bind(this), 0);
        },

        /**
         * Получить строковую информацию о блоке и его элементе.
         *
         * @private
         * @returns {{block: string, elem: string}}
         */
        _getBlockAndElem: function() {
            var blockAndElem = this._selector.split(Selector.delimiters.elem);
            return {
                block: blockAndElem[0] || '',
                elem: blockAndElem[1] || ''
            };
        },

        /**
         * Получить информацию об объекте (блоке или элементе) и его модификаторе.
         *
         * @private
         * @param {string} object Строковая информация об объекте
         * @returns {{object: string, modName: string, modVal: string}}
         */
        _getObjectAndMods: function(object) {
            var blockAndMod = object.split(Selector.delimiters.mod);
            return {
                object: blockAndMod[0],
                modName: blockAndMod[1] || '',
                modVal: blockAndMod[2] || ''
            };
        },

        /**
         * Получить модификатор.
         *
         * @private
         * @param {string} name Имя поля имени модификатора
         * @param {string} val Имя поля значения модификатора
         * @returns {array}
         */
        _getMod: function(name, val) {
            var mod = [],
                name = this[name],
                val = this[val];

            if(name && val !== false) {
                mod.push(Selector.delimiters.mod, name);

                if(val && val !== true) {
                    mod.push(Selector.delimiters.mod, val);
                }
            }

            return mod;
        },

        /**
         * Получить/установить значение полю.
         *
         * @private
         * @param {string} name Имя поля
         * @param {*} [val] Значение
         * @returns {*|Selector}
         */
        _getSet: function(name, val) {
            if(val === undefined) return this[name];

            this[name] = val;
            return this;
        }

    };

    return Selector;

});
