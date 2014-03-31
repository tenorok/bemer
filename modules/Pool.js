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
         * Добавить шаблон.
         *
         * @param {...Template} template Шаблон к добавлению
         * @returns {Pool}
         */
        add: function(template) {
            Array.prototype.push.apply(this.pool, Array.prototype.slice.call(arguments));
            return this;
        }

    };

    return Pool;

});
