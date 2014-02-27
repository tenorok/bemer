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
                elem: this._elem = elem.object,
                elemModName: this._elemModName = elem.modName,
                elemModVal: this._elemModVal = elem.modVal
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
         * Получить/установить модификатор элемента.
         *
         * @param {string} [name] Имя модификатора
         * @param {string} [val] Значение модификатора
         * @returns {{name: string, val: string}|Name}
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
         * @returns {string|Name}
         */
        elemModName: function(name) {
            return this._getSet('_elemModName', name);
        },

        /**
         * Получить/установить значение модификатора элемента.
         *
         * @param {string} [val] Значение модификатора
         * @returns {string|Name}
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
            var mod = Name.delimiters.mod,
                name = [this._block];

            if(this._modName) {
                name.push(mod, this._modName);

                if(this._modVal) {
                    name.push(mod, this._modVal);
                }
            }

            if(this._elem) {
                name.push(Name.delimiters.elem, this._elem);

                if(this._elemModName) {
                    name.push(mod, this._elemModName);

                    if(this._elemModVal) {
                        name.push(mod, this._elemModVal);
                    }
                }
            }

            return name.join('');
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
