definer('Tree', /** @exports Tree */ function(Template, is) {

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

        /**
         * Развернуть дерево в набор экземпляров БЭМ-узлов.
         *
         * @param {object} bemjson BEMJSON
         * @returns {Node}
         */
        expand: function(bemjson) {
            return this._getNode(bemjson);
        },

        /**
         * Получить строковое представление дерева.
         *
         * @returns {string}
         */
        toString: function() {
            return this.expand(this._tree).toString();
        },

        /**
         * Получить узел или примитив
         * или список узлов и примитивов
         * на основе контента.
         *
         * @private
         * @param {*} bemjson BEMJSON, массив или примитив
         * @param {string} ctxBlock Контекст блока
         * @returns {*}
         */
        _getContent: function(bemjson, ctxBlock) {

            if(is.array(bemjson)) {
                return bemjson.reduce(function(list, elem) {
                    list.push(this._getNode(elem, ctxBlock));
                    return list;
                }.bind(this), []);
            }

            return this._getNode(bemjson, ctxBlock);
        },

        /**
         * Рекурсивно получить БЭМ-узел с его контентом на основе BEMJSON
         * или просто вернуть полученный примитив.
         *
         * @private
         * @param {*} bemjson BEMJSON или примитив
         * @param {string} [ctxBlock] Контекст блока
         * @returns {Node|*}
         */
        _getNode: function(bemjson, ctxBlock) {

            if(is.map(bemjson)) {

                if(bemjson.elem && !bemjson.block && ctxBlock) {
                    bemjson.block = ctxBlock;
                }

                var node = this._pool.find(bemjson) || Template.base(bemjson);
                node.content(this._getContent(bemjson.content, bemjson.block));
                return node;
            }

            return bemjson;
        }

    };

    return Tree;

});
