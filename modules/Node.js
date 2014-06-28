definer('Node', /** @exports Node */ function(Tag, Name, object) {

    /**
     * Модуль работы с БЭМ-узлом.
     *
     * @constructor
     * @param {Object} node БЭМ-узел
     */
    function Node(node) {

        /**
         * БЭМ-узел.
         *
         * @private
         * @type {object}
         */
        this._node = node;

        /**
         * Экземпляр тега.
         *
         * @private
         * @type {Tag}
         */
        this._tag = new Tag(node.tag).attr(node.attrs || {});

        /**
         * Экземпляр имени БЭМ-сущности.
         *
         * @private
         * @type {Name}
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
         * Проверить узел на блок.
         *
         * @returns {boolean}
         */
        isBlock: function() {
            return !this.isElem();
        },

        /**
         * Проверить узел на элемент.
         *
         * @returns {boolean}
         */
        isElem: function() {
            return !!this._node.elem;
        },

        /**
         * Получить экземпляр имени базовой БЭМ-сущности.
         *
         * Это может быть блок или элемент блока.
         *
         * @returns {Name}
         */
        getName: function() {

            var name = new Name(this._node.block);

            if(this.isElem()) {
                name.elem(this._node.elem);
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

            if(this._node.js) {
                params[this._name.toString()] = this._node.js === true ? {} : this._node.js;
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
            if(!this._node.mix) return [];

            return this._node.mix.reduce(function(mix, mixNode) {
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
            var node = this._node;

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
            if(content === undefined) return this._node.content || '';

            this._node.content = content;
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

            if(this._node.content) {
                this._tag.addContent(this._node.content);
            }

            return this._tag.toString();
        },

        /**
         * Получить список классов модификаторов узла.
         *
         * @private
         * @param {string} method Имя метода для установки модификаторов
         * @returns {string[]}
         */
        _getModsClasses: function(method) {
            var mods = this._node[method + 's'];
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
            if(!object.isEmpty(this._node.mods)) {
                return Object.keys(this._node.mods).reduce(function(classes, key) {
                    this._name.mod(key, this._node.mods[key]);
                    return classes.concat(this._getModsClasses('elemMod'));
                }.bind(this), []);
            }

            return this._getModsClasses('elemMod');
        }

    };

    return Node;

});
