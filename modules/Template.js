definer('Template', /** @exports Template */ function(Match, classify, Node) {

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

    Template.prototype = {

        /**
         * Применить BEMJSON к шаблону.
         *
         * @param {object} bemjson BEMJSON
         * @returns {Node|null} Экземпляр БЭМ-узла или null при несоответствии BEMJSON шаблону
         */
        match: function(bemjson) {
            return this._match.is(bemjson) ? new Node(bemjson) : null;
        }

    };

    return Template;

});
