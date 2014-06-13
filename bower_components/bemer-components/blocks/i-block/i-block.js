/**
 * @class i-block
 * @abstract
 */
BEM.DOM.decl('i-block', /** @lends i-block.prototype */ {}, /** @lends i-block */ {

    /**
     * Возвращает BEMJSON блока.
     *
     * @returns {object}
     */
    getBEMJSON: function() {
        return { block: this.getName() };
    },

    /**
     * Получить экземпляр блока.
     *
     * При необходимости инициализации возвращает экземпляр блока,
     * если же инициализация не требуется возвращается jQuery.
     *
     * @param {object} [bemjson] BEMJSON
     * @returns {BEM.DOM|jQuery}
     */
    create: function(bemjson) {
        var bemjson = bemjson || this.getBEMJSON.apply(this, arguments),
            block = BEM.DOM.init($(bemer(bemjson)));

        return bemjson.js === false ? block : block.bem(this.getName());
    },

    /**
     * Колбек вызывается для одного или нескольких элементов
     * при обработке DOM-элементов.
     *
     * @callback i-block~eachSingleCallback
     * @this jQuery
     * @param {jQuery} elem Элемент
     * @param {number} index Индекс элемента
     */

    /**
     * Колбек вызывается для нескольких элементов
     * при обработке DOM-элементов.
     *
     * @callback i-block~eachMultiCallback
     * @this jQuery
     * @param {jQuery} elem Элемент
     * @param {number} index Индекс элемента
     */

    /**
     * Обработать один или несколько DOM-элементов.
     *
     * При одинаковой обработке одного и нескольких элементов
     * достаточно передать только один обработчик.
     *
     * При необходимости различной обработки одного и нескольких
     * элементов можно передать два разных обработчика.
     *
     * @param {jQuery} domElem Один или несколько DOM-элементов
     * @param {i-block~eachSingleCallback} singleCallback Обработчик одного или нескольких элемента
     * @param {i-block~eachMultiCallback} [multiCallback] Обработчик нескольких элементов
     * @returns {array|*} При обработке нескольких элементов возвращается массив
     */
    each: function(domElem, singleCallback, multiCallback) {
        if(domElem.length > 1) {
            var result = [],
                callback = multiCallback || singleCallback;

            domElem.each(function(index, elem) {
                var $elem = $(elem);
                result.push(callback.call($elem, $elem, index));
            });
            return result;
        } else {
            return singleCallback.call(domElem, domElem, 0);
        }
    }

});
