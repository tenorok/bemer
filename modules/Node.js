definer('Node', /** @exports Node */ function(Tag, Selector, object) {

    /**
     * Модуль работы с БЭМ-узлом.
     *
     * @constructor
     * @param {object} bemjson BEMJSON узла
     */
    function Node(bemjson) {

        /**
         * BEMJSON узла.
         *
         * @private
         * @type {object}
         */
        this._bemjson = bemjson;

        /**
         * Экземпляр тега.
         *
         * @private
         * @type {Tag}
         */
        this._tag = new Tag(bemjson.tag).attr(bemjson.attrs || {});

        if(bemjson.single !== undefined) {
            this._tag.single(bemjson.single);
        }

        /**
         * Экземпляр имени БЭМ-сущности.
         *
         * @private
         * @type {Selector}
         */
        this._name = this.getName();

        /**
         * Список информационных объектов о примиксованных сущностях.
         *
         * @private
         * @type {array}
         */
        this._mix = this.getMix();

        /**
         * Параметры узла.
         *
         * @private
         * @type {object}
         */
        this._params = this.getParams();

        /**
         * Опции преобразования узла.
         *
         * @private
         * @type {object}
         */
        this._options = bemjson.options || {};
    }

    /**
     * Имя класса для js-инициализации.
     *
     * @type {string}
     */
    Node.bemClass = 'i-bem';

    /**
     * Имя атрибута для хранения параметров инициализации.
     *
     * @type {string}
     */
    Node.bemAttr = 'data-bem';

    Node.prototype = {

        /**
         * Получить/установить BEMJSON узла.
         *
         * @param {object} [bemjson] BEMJSON
         * @returns {object|Node}
         */
        bemjson: function(bemjson) {
            if(bemjson === undefined) {
                return this._bemjson;
            }

            this._bemjson = bemjson;
            return this;
        },

        /**
         * Проверить узел на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !!this._bemjson.block && !this.isElem();
        },

        /**
         * Проверить узел на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._bemjson.elem;
        },

        /**
         * Получить экземпляр имени базовой БЭМ-сущности.
         *
         * Это может быть блок или элемент блока.
         *
         * @returns {Selector}
         */
        getName: function() {

            var name = new Selector(this._bemjson.block);

            if(this.isElem()) {
                name.elem(this._bemjson.elem);
            }

            return name;
        },

        /**
         * Получить параметры узла.
         *
         * @returns {object}
         */
        getParams: function() {
            var params = {};

            if(this._bemjson.js) {
                params[this._name.toString()] = this._bemjson.js === true ? {} : this._bemjson.js;
            }

            return this._mix.reduce(function(params, mixNode) {
                return object.extend(params, mixNode.params);
            }, params);
        },

        /**
         * Получить информацию о примиксованных сущностях.
         *
         * @returns {array}
         */
        getMix: function() {
            if(!this._bemjson.mix) return [];

            return this._bemjson.mix.reduce(function(mix, mixNode) {
                if(!mixNode) return mix;

                var node = new Node(mixNode);
                mix.push({
                    name: node.getName().toString(),
                    params: node.getParams(),
                    classes: node.getClass()
                });
                return mix;
            }, []);
        },

        /**
         * Получить список классов узла.
         *
         * @returns {string[]}
         */
        getClass: function() {
            var node = this._bemjson;

            if(node.cls) {
                this._tag.addClass(node.cls.split(' ').filter(function(cls) { return cls; }));
            }

            if(node.bem === false) return this._tag.getClass();

            if(this.isBlock() || this.isElem() && object.isEmpty(node.mods)) {
                this._tag.addClass(this._name.toString());
            }

            if(!object.isEmpty(this._params)) {
                this._tag.addClass(Node.bemClass);
            }

            if(!object.isEmpty(node.mods)) {
                var mods = this._getModsClasses('mod');
                this._tag.addClass(mods.length ? mods : this._name.toString());
            }

            if(this.isElem() && !object.isEmpty(node.elemMods)) {
                this._tag.addClass(this._getElemModsClasses());
            }

            this._tag.addClass(this._mix.reduce(function(mixClasses, mixNode) {
                return mixClasses.concat(mixNode.classes);
            }, []));

            return this._tag.getClass();
        },

        /**
         * Получить/установить содержимое узла.
         *
         * @param {*} [content] Содержимое
         * @returns {*|Node}
         */
        content: function(content) {
            if(content === undefined) return this._bemjson.content || '';

            this._bemjson.content = content;
            return this;
        },

        /**
         * Получить строковое представление узла.
         *
         * @returns {string}
         */
        toString: function() {
            this.getClass();

            if(!object.isEmpty(this._params)) {
                this._tag.attr(Node.bemAttr, this._params);
            }

            if(this._bemjson.content) {
                this._tag.addContent(this._bemjson.content);
            }

            var escape = Node.resolveOptionEscape(this._options.escape);

            return this._tag.toString({
                escapeContent: escape.content,
                escapeAttr: escape.attrs
            });
        },

        /**
         * Получить список классов модификаторов узла.
         *
         * @private
         * @param {string} method Имя метода для установки модификаторов
         * @returns {string[]}
         */
        _getModsClasses: function(method) {
            var mods = this._bemjson[method + 's'];
            return Object.keys(mods).reduce(function(classes, key) {
                if(mods[key]) {
                    classes.push(this._name[method](key, mods[key]).toString());
                }
                return classes;
            }.bind(this), []);
        },

        /**
         * Получить список классов модификаторов элемента.
         *
         * @private
         * @returns {string[]}
         */
        _getElemModsClasses: function() {
            if(!object.isEmpty(this._bemjson.mods)) {
                return Object.keys(this._bemjson.mods).reduce(function(classes, key) {
                    this._name.mod(key, this._bemjson.mods[key]);
                    return classes.concat(this._getModsClasses('elemMod'));
                }.bind(this), []);
            }

            return this._getModsClasses('elemMod');
        }

    };

    /**
     * Получить/установить опции экранирования.
     *
     * @param {boolean|object} escape Флаг экранирования спецсимволов
     * @param {boolean} [escape.content] Флаг экранирования содержимого
     * @param {boolean} [escape.attrs] Флаг экранирования значений атрибутов
     * @returns {object}
     */
    Node.resolveOptionEscape = function(escape) {
        var content = Tag.escapeContent,
            attrs = Tag.escapeAttr;

        if(escape !== undefined) {
            if(is.boolean(escape)) {
                content = escape;
                attrs = escape;
            } else {
                if(is.boolean(escape.content)) {
                    content = escape.content;
                }
                if(is.boolean(escape.attrs)) {
                    attrs = escape.attrs;
                }
            }
        }

        return {
            content: content,
            attrs: attrs
        };
    };

    return Node;

});
