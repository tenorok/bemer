definer('Name', /** @exports Name */ function() {

    /**
     * Модуль работы с именем БЭМ-сущности.
     *
     * @constructor
     * @param {string} [name] Имя БЭМ-сущности
     */
    function Name(name) {

        /**
         * Имя БЭМ-сущности.
         *
         * @private
         * @type {string}
         */
        this._name = name || '';

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

        this.info();
    }

    /**
     * Разделители имён.
     *
     * @type {{mod: string, elem: string}}
     * @property {string} mod Разделитель блока и модификатора, элемента и модификатора, модификатора и значения
     * @property {string} elem Разделитель блока и элемента
     */
    Name.delimiters = {
        mod: '_',
        elem: '__'
    };

    Name.prototype = {

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
                elem: elem.object,
                elemModName: elem.modName,
                elemModVal: elem.modVal
            };
        },

        /**
         * Получить/установить имя блока.
         *
         * @param {string} [name] Имя блока
         * @returns {string|Name}
         */
        block: function(name) {
            return this._getSet('_block', name);
        },

        /**
         * Получить/установить модификатор блока.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Name}
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
         * @returns {string|Name}
         */
        modName: function(name) {
            return this._getSet('_modName', name);
        },

        /**
         * Получить/установить значение модификатора блока.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Name}
         */
        modVal: function(val) {
            return this._getSet('_modVal', val);
        },

        /**
         * Получить/установить элемент.
         *
         * @param {string} [name] Имя элемента
         * @returns {string|Name}
         */
        elem: function(name) {
            return this._getSet('_elem', name);
        },

        /**
         * Получить строковую информацию о блоке и его элементе.
         *
         * @private
         * @returns {{block: string, elem: string}}
         */
        _getBlockAndElem: function() {
            var blockAndElem = this._name.split(Name.delimiters.elem);
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
            var blockAndMod = object.split(Name.delimiters.mod);
            return {
                object: blockAndMod[0],
                modName: blockAndMod[1] || '',
                modVal: blockAndMod[2] || ''
            };
        },

        /**
         * Получить/установить значение полю.
         *
         * @private
         * @param {string} name Имя поля
         * @param {*} [val] Значение
         * @returns {*|Name}
         */
        _getSet: function(name, val) {
            if(val === undefined) return this[name];

            this[name] = val;
            return this;
        }

    };

    return Name;

});
