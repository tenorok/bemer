definer('Template', /** @exports Template */ function(Match, classify) {

    /**
     * Модуль шаблонизации BEMJSON-узла.
     *
     * @constructor
     * @param {string} pattern Шаблон для матчинга
     * @param {object} modes Моды для преобразования узла
     */
    function Template(pattern, modes) {

        /**
         * Экземпляр матчера.
         *
         * @private
         * @type {Match}
         */
        this._match = new Match(pattern);

        /**
         * Класс по модам.
         *
         * @private
         * @type {Function}
         */
        this._Modes = classify(modes);
    }

    Template.prototype = {};

    return Template;

});
