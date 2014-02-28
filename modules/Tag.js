definer('Tag', /** @exports Tag */ function(string) {

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

        /**
         * Список атрибутов.
         *
         * @private
         * @type {object}
         */
        this._attr = {};

        /**
         * Флаг принудительного указания одиночного тега.
         *
         * @private
         * @type {boolean}
         */
        this._single;

        /**
         * Содержимое тега.
         *
         * @private
         * @type {string[]}
         */
        this._content = [''];
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
         * @param {string|string[]} cls Имя класса или список имён
         * @returns {Tag}
         */
        addClass: function(cls) {
            var names = Array.isArray(cls) ? cls : [cls];
            names.forEach(function(name) {
                if(!this.hasClass(name)) {
                    this._class.push(name);
                }
            }, this);
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
         * Проверить/установить одиночный тег.
         *
         * @param {boolean} [state] Флаг одиночного тега
         * @returns {boolean|Tag}
         */
        single: function(state) {
            if(state === undefined) {
                return this._single !== undefined
                    ? this._single
                    : !!~Tag.singleTags.indexOf(this._name);
            }

            this._single = state;
            return this;
        },

        /**
         * Получить/установить атрибут.
         *
         * В качестве значения атрибуту можно передавать массив или объект,
         * они будут установлены в заэкранированном виде.
         *
         * @param {string} name Имя атрибута
         * @param {*} [val] Значение атрибута
         * @returns {*|Tag}
         */
        attr: function(name, val) {
            if(val === undefined) return this._attr[name];

            if(typeof val === 'object') {
                val = string.htmlEscape(JSON.stringify(val));
            }

            this._attr[name] = val;
            return this;
        },

        /**
         * Удалить атрибут.
         *
         * @param {string} name Имя атрибута
         * @returns {Tag}
         */
        delAttr: function(name) {
            delete this._attr[name];
            return this;
        },

        /**
         * Получить список атрибутов.
         *
         * @returns {object}
         */
        attrList: function() {
            return this._attr;
        },

        /**
         * Получить/установить содержимое тега.
         *
         * @param {string} [content] Содержимое
         * @returns {string[]|Tag}
         */
        content: function(content) {
            if(content === undefined) return this._content;

            this._content = [content];
            return this;
        },

        /**
         * Добавить содержимое тега.
         *
         * @param {string} content Содержимое
         * @returns {Tag}
         */
        addContent: function(content) {
            this._content.push(content);
            return this;
        },

        /**
         * Получить строковое представление тега.
         *
         * @returns {string}
         */
        toString: function() {
            var tag = ['<' + this.name()],
                classes = this.getClass(),
                attrList = this.attrList();

            if(classes.length) {
                tag.push(' class="' + classes.join(' ') + '"');
            }

            Object.keys(attrList).forEach(function(attr) {
                tag.push(' ' + attr + '="' + attrList[attr] + '"');
            }, this);

            if(this.single()) {
                tag.push('/>')
            } else {
                tag.push('>');
                tag = tag.concat(this.content());
                tag.push('</' + this.name() + '>');
            }

            return tag.join('');
        }

    };

    return Tag;

});
