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
         * @param {object} [data.context] Информация о родительском контексте
         * @param {string} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @param {string} [data.context.elem] Имя родительского элемента
         * @param {object} [data.context.elemMods] Модификаторы родительского элемента
         * @param {object} [context] Информация о контекстуальном блоке
         * @param {string} [context.block] Имя контекстуального блока
         * @param {object} [context.mods] Модификаторы контекстуального блока
         * @returns {array}
         */
        _getContentList: function(bemjson, data, context) {
            var list = [];
            for(var index = 0, len = bemjson.length; index < len; index++) {
                var item = bemjson[index],
                    elemData = {
                        index: index,
                        length: bemjson.length
                    };

                if(item) {
                    elemData.context = data.context;
                }

                var node = is.array(item)
                    ? this._getContentList(item, data, context)
                    : this._getNode(item, elemData, context);

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
         * @param {object} [data.context] Информация о родительском контексте
         * @param {string} [data.context.block] Имя родительского блока
         * @param {object} [data.context.mods] Модификаторы родительского блока
         * @param {string} [data.context.elem] Имя родительского элемента
         * @param {object} [data.context.elemMods] Модификаторы родительского элемента
         * @param {object} [context] Информация о контекстуальном блоке
         * @param {string} [context.block] Имя контекстуального блока
         * @param {object} [context.mods] Модификаторы контекстуального блока
         * @returns {Node|*}
         */
        _getNode: function(bemjson, data, context) {
            if(!is.map(bemjson)) return bemjson === undefined ? '' : bemjson;

            data = data || {};
            context = context || {};

            if(!bemjson.block && bemjson.elem) {
                bemjson.block = context.block;
                bemjson.mods = object.extend(object.clone(context.mods), bemjson.mods || {});
            }

            var node = this._pool.find(bemjson, data) || Template.base(bemjson, data),
                nodeBemjson = node.bemjson();

            if(nodeBemjson.block) {
                data.context = {
                    block: nodeBemjson.block,
                    mods: object.clone(nodeBemjson.mods)
                };

                if(node.isBlock()) {
                    context = {
                        block: data.context.block,
                        mods: data.context.mods
                    };
                } else {
                    data.context.elem = nodeBemjson.elem;
                    data.context.elemMods = nodeBemjson.elemMods;
                }
            }

            return node.content(this[
                is.array(nodeBemjson.content) ? '_getContentList' : '_getNode'
            ](nodeBemjson.content, data, context));
        }

    };

    return Tree;

});
