definer('Tag', /** @exports Tag */ function() {

    /**
     * Модуль работы с тегом.
     *
     * @constructor
     * @param {string} [name=div] Имя тега
     */
    function Tag(name) {

        /**
         * Имя тега.
         *
         * @private
         * @type {string}
         */
        this._name = name || 'div';

        /**
         * Список классов тега.
         *
         * @private
         * @type {string[]}
         */
        this._class = [];
    }

    /**
     * Список одиночных HTML-тегов.
     *
     * @type {String[]}
     */
    Tag.singleTags = [
        'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img',
        'input', 'keygen', 'link', 'meta', 'param', 'source', 'wbr'
    ];

    Tag.prototype = {

        /**
         * Получить/установить имя тега.
         *
         * @param {string} [name] Имя тега
         * @returns {string|Tag}
         */
        name: function(name) {
            if(!name) return this._name;

            this._name = name;
            return this;
        },

        /**
         * Добавить тегу класс.
         *
         * @param {string} name Имя класса
         * @returns {Tag}
         */
        addClass: function(name) {
            if(!this.hasClass(name)) {
                this._class.push(name);
            }
            return this;
        },

        /**
         * Проверить наличие класса у тега.
         *
         * @param {string} name Имя класса
         * @returns {boolean}
         */
        hasClass: function(name) {
            return !!~this._class.indexOf(name);
        },

        /**
         * Удалить класс тега.
         *
         * @param {string} name Имя класса
         * @returns {Tag}
         */
        delClass: function(name) {
            var index = this._class.indexOf(name);
            if(~index) {
                this._class.splice(index, 1);
            }
            return this;
        },

        /**
         * Получить список классов тега.
         *
         * @returns {string[]}
         */
        getClass: function() {
            return this._class;
        },

        /**
         * Проверить на одиночный тег.
         *
         * @returns {boolean}
         */
        isSingle: function() {
            return !!~Tag.singleTags.indexOf(this._name);
        }

    };

    return Tag;

});
