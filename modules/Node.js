definer('Node', /** @exports Node */ function(Tag, Name) {

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
         * Экземпляр имени БЭМ-сущности.
         *
         * @private
         * @type {Name}
         */
        this._name = new Name(node.block);
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

            if(this.isElem()) {
                this._name.elem(node.elem);
            }

            this._tag.addClass(this._name.toString());

            if(node.js) {
                this._tag.addClass(Node.bemClass);
            }

            if(node.mods) {
                this._tag.addClass(this._getModsClasses('mod'));
            }

            if(node.elemMods) {
                this._tag.addClass(this._getModsClasses('elemMod'));
            }

            if(node.mix) {
                this._tag.addClass(node.mix.reduce(function(classes, node) {
                    return classes.concat(new Node(node).getClass());
                }.bind(this), []));
            }

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
