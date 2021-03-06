definer('Pool', /** @exports Pool */ function(array, object) {

    /**
     * Модуль хранения списка шаблонов.
     *
     * @constructor
     */
    function Pool() {

        /**
         * Список шаблонов.
         *
         * @type {Template[]}
         */
        this.pool = [];
    }

    Pool.prototype = {

        /**
         * Добавить шаблон или несколько шаблонов.
         *
         * @param {...Template} template Шаблон к добавлению
         * @returns {Pool}
         */
        add: function(template) { /* jshint unused: false */
            var args = arguments,
                templates = Object.keys(args).reduce(function(templates, key) {
                    return templates.concat(args[key].split());
                }, []);

            templates.forEach(function(template) {
                var indexes = this.is(template);

                // Так как шаблоны разбиты по единичным селекторам,
                // результатом поиска может быть только один индекс или null.
                this.pool.push(indexes ? this.pool[indexes[0]].extend(template) : template);

            }, this);

            return this;
        },

        /**
         * Найти индексы подходящих для наследования шаблонов
         * для каждого селектора указанного шаблона.
         *
         * Результатом всегда возвращается массив индексов
         * или `null`, если подходящие шаблоны не были найдены.
         *
         * @param {Template} template Шаблон для поиска
         * @returns {number[]|null}
         */
        is: function(template) {
            var indexes = [];

            template.split().forEach(function(currentTemplate) {
                for(var index = this.pool.length - 1; index >= 0; index--) {
                    if(this.pool[index].is(currentTemplate)) {
                        indexes.push(index);
                        break;
                    }
                }
            }, this);

            return indexes.length ? indexes : null;
        },

        /**
         * Найти и применить шаблон для BEMJSON.
         *
         * @param {object} bemjson BEMJSON
         * @param {object} [data] Данные по сущности в дереве
         * @returns {Node|null} Экземпляр БЭМ-узла или null при отсутствии подходящего шаблона
         */
        find: function(bemjson, data) {
            var node = null,
                nextNode = null,
                currentBemjson = bemjson,

                /**
                 * Обработанные шаблоны.
                 *
                 * @type {Template[]}
                 */
                processedTemplates = [],

                /**
                 * Установленные из шаблонов моды.
                 *
                 * @type {object}
                 * @property {object} * Имя моды
                 * @property {number} *.weight Вес шаблона
                 * @property {number} *.index Порядковый номер шаблона в общем списке
                 */
                modesFromTemplates = {};

            for(var index = this.pool.length - 1; index >= 0; index--) {
                if(~processedTemplates.indexOf(this.pool[index])) continue;

                if(node) {
                    currentBemjson = node.bemjson();
                }

                nextNode = this.pool[index].match(
                    currentBemjson,
                    data,
                    bemjson,
                    modesFromTemplates,
                    index
                );

                if(nextNode) {
                    node = nextNode;
                    processedTemplates.push(this.pool[index]);

                    // Если изменился набор модификаторов, шаблоны нужно прогонять заново.
                    if(!object.isEqual(currentBemjson.mods || {}, node.bemjson().mods) ||
                        !object.isEqual(currentBemjson.elemMods || {}, node.bemjson().elemMods)) {
                        index = this.pool.length;
                    }
                }
            }

            return node;
        },

        /**
         * Удалить все шаблоны.
         *
         * @returns {Pool}
         */
        clean: function() {
            this.pool = [];
            return this;
        }

    };

    return Pool;

});
