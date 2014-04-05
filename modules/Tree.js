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

    /**
     * Стандартные шаблоны.
     *
     * @type {object}
     * @property {Template} block Блока
     * @property {Template} elem Элемента
     * @property {Template} blockModElem Блока с модификатором и элемента
     */
    Tree.defaultTemplates = {
        block: new Template('*', {}),
        elem: new Template('*__*', {}),
        blockModElem: new Template('*_*_*__*', {})
    };

    Tree.prototype = {

        expand: function() {},

        toString: function() {
            var node = this._pool.find(this._tree);

            if(node) {
                return node.toString();
            }

            for(var key in Tree.defaultTemplates) {
                node = Tree.defaultTemplates[key].match(this._tree);
                if(node) {
                    return node.toString();
                }
            }
        }

    };

    return Tree;

});
