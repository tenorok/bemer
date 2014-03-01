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

    /**
     * Символ любого значения.
     *
     * @type {string}
     */
    Match.any = '*';

    Match.prototype = {

        /**
         * Проверить узел на соответствие шаблону.
         *
         * @param {object} node Узел
         * @returns {boolean}
         */
        is: function(node) {
            return (this._block(node.block) && this._elem(node.elem));
        },

        /**
         * Проверить блок на соответствие шаблону.
         *
         * @private
         * @param {string} block Имя блока узла
         * @returns {boolean}
         */
        _block: function(block) {
            var pattern = this._pattern.block();
            return pattern === Match.any || pattern === block;
        },

        /**
         * Проверить элемент на соответствие шаблону.
         *
         * @private
         * @param {string} elem Имя элемента узла
         * @returns {boolean}
         */
        _elem: function(elem) {
            var pattern = this._pattern.elem();

            if(!pattern && !elem) {
                return true;
            }

            return pattern === Match.any || pattern === elem;
        }

    };

    return Match;

});
