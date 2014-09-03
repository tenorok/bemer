definer('functions', /** @exports functions */ function() {

    /**
     * Модуль работы с функциями.
     *
     * @class
     */
    function functions() {}

    /**
     * Создать экземпляр класса с помощью apply.
     *
     * @param {Function} constructor Класс
     * @param {array} args Массив аргументов
     * @returns {Object} Экземпляр класса
     */
    functions.apply = function(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    };

    return functions;

});
