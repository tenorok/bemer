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
        this._block;

        /**
         * Имя модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modName;

        /**
         * Значение модификатора блока.
         *
         * @private
         * @type {string}
         */
        this._modVal;

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
         * @param {string} name Имя блока
         * @returns {string|Name}
         */
        block: function(name) {
            if(name === undefined) return this._block;

            this._block = name;
            return this;
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
            if(name === undefined) return this._modName;

            this._modName = name;
            return this;
        },

        /**
         * Получить/установить значение модификатора блока.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Name}
         */
        modVal: function(val) {
            if(val === undefined) return this._modVal;

            this._modVal = val;
            return this;
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
        }

    };

    return Name;

});
