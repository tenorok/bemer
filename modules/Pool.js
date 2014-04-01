definer('Pool', /** @exports Pool */ function() {

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
        add: function(template) {
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
        }

    };

    return Pool;

});
