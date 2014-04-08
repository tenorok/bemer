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

        expand: function() {},

        toString: function() {
            var node = this._pool.find(this._tree);

            if(node) {
                return node.toString();
            }

            return Template.base(this._tree).toString();
        }

    };

    return Tree;

});
