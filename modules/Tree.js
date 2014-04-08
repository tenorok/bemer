definer('Tree', /** @exports Tree */ function(Template) {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @class
     */
    function Tree(tree, pool) {

        /**
         * Дерево.
         *
         * @private
         * @type {object}
         */
        this._tree = tree;

        /**
         * Список шаблонов.
         *
         * @private
         * @type {Pool}
         */
        this._pool = pool;

        /**
         * Контекст блока в дереве.
         *
         * @private
         * @type {string}
         */
        this._block = tree.block || '';
    }

    Tree.prototype = {

        toString: function() {

            return this._getNode(this._tree).toString();
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON.
         *
         * @private
         * @param {object} bemjson BEMJSON
         * @returns {Node}
         */
        _getNode: function(bemjson) {
            return this._pool.find(bemjson) || Template.base(bemjson);
        }

    };

    return Tree;

});
