definer('modules', /** @exports modules */ function(Tag, Selector, Node, Match) {

    /**
     * Модуль для экспорта других внутренних модулей.
     *
     * @class
     */
    function modules() {}

    /**
     * Список предоставляемых модулей.
     *
     * @private
     * @type {object}
     */
    modules._list = {
        Tag: Tag,
        Selector: Selector,
        Node: Node,
        Match: Match
    };

    /**
     * Получить заданный модуль или все модули.
     *
     * @param {string} [name] Имя модуля
     * @returns {object|*}
     */
    modules.get = function(name) {
        return name ? modules._list[name] : modules._list;
    };

    return modules;

});
