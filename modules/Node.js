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

            if(node.bem === false) return [];

            var name = new Name(node.block);

            if(this.isElem()) {
                name.elem(node.elem);
            }

            this._tag.addClass(name.toString());

            if(node.js) {
                this._tag.addClass(Node.bemClass);
            }

            return this._tag.getClass();
        }

    };

    return Node;

});
