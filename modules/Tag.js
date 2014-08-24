definer('Tag', /** @exports Tag */ function(string, is) {

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
        this._name = name || Tag.defaultName;

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
        this._content = [];
    }

    /**
     * Имя тега по умолчанию.
     *
     * @type {string}
     */
    Tag.defaultName = 'div';

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
            var names = is.array(cls) ? cls : [cls];
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
         * Получить/установить/удалить атрибут.
         * Установить список атрибутов.
         * Получить список атрибутов.
         *
         * При указании значения `false` атрибут будет удалён.
         * При указании значения `true` будет установлен булев атрибут без значения.
         *
         * В качестве значения атрибуту можно передавать массив или объект,
         * они будут установлены в заэкранированном виде.
         *
         * @param {string|object} [name] Имя атрибута или список атрибутов
         * @param {*} [val] Значение атрибута
         * @returns {*|object|Tag}
         */
        attr: function(name, val) {
            if(!arguments.length) return this._attr;

            if(is.map(name)) {
                Object.keys(name).forEach(function(attr) {
                    this.attr(attr, name[attr]);
                }, this);
                return this;
            } else if(val === undefined) {
                return this._attr[name];
            }

            if(is.array(val) || is.map(val)) {
                val = string.htmlEscape(JSON.stringify(val));
            }

            if(val === false) {
                this.delAttr(name);
            } else {
                this._attr[name] = val;
            }

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
         * Получить/установить содержимое тега.
         *
         * @param {string|string[]} [content] Содержимое
         * @returns {string[]|Tag}
         */
        content: function(content) {
            if(content === undefined) return this._content;

            this._content = [];
            this.addContent(content);
            return this;
        },

        /**
         * Добавить содержимое тега.
         *
         * @param {string|string[]} content Содержимое
         * @returns {Tag}
         */
        addContent: function(content) {
            if(is.array(content)) {
                this._content = this._content.concat(content);
            } else {
                this._content.push(content);
            }
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
                attrs = this.attr();

            if(classes.length) {
                tag.push(' class="' + classes.join(' ') + '"');
            }

            Object.keys(attrs).forEach(function(attr) {
                attrs[attr] === true
                    ? tag.push(' ' + attr)
                    : tag.push(' ' + attr + '="' + attrs[attr] + '"');
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
