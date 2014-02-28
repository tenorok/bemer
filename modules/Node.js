definer('Node', /** @exports Node */ function() {

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
    }

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
        }

    };

    return Node;

});
