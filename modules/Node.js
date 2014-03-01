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
        this._tag = new Tag();

        /**
         * Список классов узла.
         *
         * @private
         * @type {string[]}
         */
        this._classes = [];

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
            return Object.keys(this._node).some(function(key) {
                return key === 'elem';
            });
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

            this._classes.push(name.toString());
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
                this._classes.push(Node.bemClass);
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

            this._tag.addClass(this._classes);

            if(node.mods) {
                this._tag.addClass(this._getModsClasses('mod'));
            }

            if(node.elemMods) {
                this._tag.addClass(this._getModsClasses('elemMod'));
            }

            this._tag.addClass(this._mix.reduce(function(mixClasses, mixNode) {
                return mixClasses.concat(mixNode.classes);
            }, []));

            return this._tag.getClass();
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
                classes.push(this._name[method](key, mods[key]).toString());
                return classes;
            }.bind(this), []);
        }

    };

    return Node;

});
