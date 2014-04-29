definer('bemer', /** @exports bemer */ function(Tree, Template, Pool, functions) {

    var pool = new Pool();

    /**
     * Модуль обвязки для удобной работы с шаблонизатором.
     *
     * Экспортируется в глобальный контекст.
     *
     * @class
     */
    function bemer() {}

    /**
     * Добавить шаблон.
     *
     * @param {...string} pattern Шаблоны для матчинга
     * @param {object} modes Моды для преобразования узла
     * @returns {bemer}
     */
    bemer.match = function(pattern, modes) {
        pool.add(functions.apply(Template, arguments));
        return this;
    };

    /**
     * Шаблонизировать BEMJSON на основе имеющихся шаблонов.
     *
     * @param {object} bemjson BEMJSON
     * @returns {string}
     */
    bemer.apply = function(bemjson) {
        return new Tree(bemjson, pool).toString();
    };

    /**
     * Удалить все шаблоны.
     *
     * @returns {bemer}
     */
    bemer.clean = function() {
        pool.clean();
        return this;
    };

    return this.bemer = bemer;

});
