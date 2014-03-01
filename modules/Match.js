definer('Match', /** @exports Match */ function(Name) {

    /**
     * Модуль проверки БЭМ-узла на соответствие шаблону.
     *
     * @constructor
     * @param {string} pattern Шаблон
     */
    function Match(pattern) {

        /**
         * Экземпляр шаблона.
         *
         * @private
         * @type {Name}
         */
        this._pattern = new Name(pattern);
    }

    Match.prototype = {

        /**
         * Проверить узел на соответствие шаблону.
         *
         * @param {object} node Узел
         * @returns {boolean}
         */
        is: function(node) {
            return this._pattern.block() === node.block;
        }

    };

    return Match;

});
