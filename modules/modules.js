definer('modules', /** @exports modules */ function(number, string, object, functions, is, Tag, Name, Node, Match) {

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
        number: number,
        string: string,
        object: object,
        functions: functions,
        is: is,
        Tag: Tag,
        Name: Name,
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
