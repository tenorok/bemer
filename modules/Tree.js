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
         * Получить список узлов и примитивов
         * на основе массива контента.
         *
         * @private
         * @param {array} bemjson Массив
         * @param {object} data Данные по сущности в дереве
         * @param {object} [data.context] Информация о родительском контексте (если родитель — блок)
         * @param {object} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @returns {array}
         */
        _getContentList: function(bemjson, data) {
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
                    ? this._getContentList(elem, data)
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

            if(!bemjson.block && bemjson.elem) {
                bemjson.block = data.context.block;
                bemjson.mods = object.extend(data.context.mods, bemjson.mods || {});
            }

            var node = this._pool.find(bemjson, data) || Template.base(bemjson, data),
                nodeBemjson = node.bemjson();

            if(nodeBemjson.block) {
                data.context = {
                    block: nodeBemjson.block,
                    mods: object.clone(nodeBemjson.mods)
                };
            }

            return node.content(this[
                is.array(nodeBemjson.content) ? '_getContentList' : '_getNode'
            ](nodeBemjson.content, data));
        }

    };

    return Tree;

});
