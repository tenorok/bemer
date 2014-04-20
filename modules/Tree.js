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
            return this._getNode(bemjson).content(this._getContent(bemjson.content));
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
         * @returns {*}
         */
        _getContent: function(bemjson) {

            if(is.array(bemjson)) {
                return bemjson.reduce(function(list, elem) {
                    list.push(this._getNode(elem));
                    return list;
                }.bind(this), []);
            }

            return this._getNode(bemjson);
        },

        /**
         * Получить БЭМ-узел на основе BEMJSON
         * или просто вернуть полученный примитив.
         *
         * @private
         * @param {*} bemjson BEMJSON или примитив
         * @returns {Node|*}
         */
        _getNode: function(bemjson) {
            return is.map(bemjson) ? this._pool.find(bemjson) || Template.base(bemjson) : bemjson;
        }

    };

    return Tree;

});
