definer('Tree', /** @exports Tree */ function(Template, is, object) {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @constructor
     * @param {object} tree BEMJSON-дерево
     * @param {Pool} pool Список шаблонов
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
         * @param {object} data Данные по сущности в дереве
         * @param {object} [data.context] Информация о родительском контексте (если родитель — блок)
         * @param {object} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @returns {*}
         */
        _getContent: function(bemjson, data) {
            if(!is.array(bemjson)) return this._getNode(bemjson, data);

            var list = [];
            for(var index = 0, len = bemjson.length; index < len; index++) {
                var elem = bemjson[index],
                    elemData = {
                        index: index,
                        length: bemjson.length
                    };

                if(elem && elem.elem) {
                    elemData.context = data.context;
                }

                var node = is.array(elem)
                    ? this._getContent(elem, data)
                    : this._getNode(elem, elemData);

                list = list.concat(node);
            }
            return list;
        },

        /**
         * Рекурсивно получить БЭМ-узел с его контентом на основе BEMJSON
         * или просто вернуть полученный примитив.
         *
         * @private
         * @param {*} bemjson BEMJSON или примитив
         * @param {object} [data] Данные по сущности в дереве
         * @param {object} [data.index] Порядковый индекс сущности
         * @param {object} [data.length] Количество сущностей у родителя
         * @param {object} [data.context] Информация о родительском контексте (только для элементов)
         * @param {object} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @returns {Node|*}
         */
        _getNode: function(bemjson, data) {
            if(!is.map(bemjson)) return bemjson;

            data = data || {};

            if(bemjson.elem && !bemjson.block && data.context.block) {
                bemjson.block = data.context.block;
                if(data.context.mods) {
                    bemjson.mods = object.extend(data.context.mods, bemjson.mods || {});
                }
            }

            var node = this._pool.find(bemjson, data) || Template.base(bemjson, data);

            if(bemjson.block) {
                data.context = { block: bemjson.block };
                if(bemjson.mods) {
                    data.context.mods = object.clone(bemjson.mods);
                }
            }

            return node.content(this._getContent(bemjson.content, data));
        }

    };

    return Tree;

});
