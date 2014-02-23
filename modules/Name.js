definer('Name', function() {

    /**
     * Модуль парсинга имени БЭМ-сущности.
     *
     * @constructor
     * @param {string} name Имя БЭМ-сущности
     */
    function Name(name) {
        this.name = name;
    }

    /**
     * Разделители имён.
     *
     * @type {{mod: string, val: string, elem: string}}
     */
    Name.delimiters = {
        mod: '_',
        val: '_',
        elem: '__'
    };

    Name.prototype = {

        /**
         * Получить информацию по БЭМ-сущности.
         *
         * @returns {Object}
         */
        info: function() {
            var blockAndElem = this._getBlockAndElem(),
                block = this._getObjectAndMods(blockAndElem.block),
                elem = this._getObjectAndMods(blockAndElem.elem);

            return {
                block: block.object,
                modName: block.modName,
                modVal: block.modVal,
                elem: elem.object,
                elemModName: elem.modName,
                elemModVal: elem.modVal
            };
        },

        /**
         * Получить строковую информацию о блоке и его элементе.
         *
         * @private
         * @returns {{block: string, elem: string}}
         */
        _getBlockAndElem: function() {
            var blockAndElem = this.name.split(Name.delimiters.elem);
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
