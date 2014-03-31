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
         * @type {array}
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

            this.pool = this.pool.concat(templates);
            return this;
        },

        is: function(template) {}

    };

    return Pool;

});
