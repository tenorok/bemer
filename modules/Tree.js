definer('Tree', /** @exports Tree */ function(Template, is) {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @constructor
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
                return bemjson.reduce(function(list, elem, index) {
                    list.push(this._getNode(elem, ctxBlock, {
                        index: index,
                        length: bemjson.length
                    }));
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
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|*}
         */
        _getNode: function(bemjson, ctxBlock, data) {

            if(is.map(bemjson)) {

                if(bemjson.elem && !bemjson.block && ctxBlock) {
                    bemjson.block = ctxBlock;
                }

                var node = this._pool.find(bemjson, data) || Template.base(bemjson, data);
                node.content(this._getContent(bemjson.content, bemjson.block));
                return node;
            }

            return bemjson;
        }

    };

    return Tree;

});
