/* before: ../../../../../blocks/i-block/i-block.js */
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
/* after: ../../../../../blocks/i-block/i-block.js */
/* before: ../../../../../blocks/i-component/i-component.js */
/**
 * @class i-component
 * @abstract
 * @extends i-block
 * @bemaker i-block
 */
BEM.DOM.decl({ block: 'i-component', baseBlock: 'i-block' }, /** @lends i-component.prototype */ {

    /**
     * Булев модификатор `focus`.
     *
     * Устанавливается когда блок или вложенный в него узел
     * получает настоящий фокус.
     */

    /**
     * Булев модификатор `disabled`.
     *
     * Устанавливается для заблокированного компонента.
     */

    onSetMod: {

        focus: {
            '*': function() {
                return !this.hasMod('disabled');
            }
        },

        disabled: {
            true: function() {
                this.delMod('focus');
            }
        }

    }

}, /** @lends i-component */ {

    live: function() {
        this
            .liveBindTo('focusin', function() {
                this.setMod('focus');
            })
            .liveBindTo('focusout', function() {
                this.delMod('focus');
            });
    }

});
/* after: ../../../../../blocks/i-component/i-component.js */
/* before: ../../../../../blocks/i-control/i-control.js */
/**
 * @class i-control
 * @abstract
 * @extends i-component
 * @bemaker i-component
 */
BEM.DOM.decl({ block: 'i-control', baseBlock: 'i-component' }, /** @lends i-control.prototype */ {

    /**
     * Событие изменения значения контрола.
     *
     * @event i-control#change
     */

    /**
     * Булев модификатор `disabled`.
     *
     * Устанавливает одноимённый атрибут всем контролам блока.
     */

    onSetMod: {

        disabled: {
            '*': function(name, val) {
                this.__self.each(this.getControl(), function() {
                    return this.prop(name, !!val);
                });
            }
        }

    },

    /**
     * Получить настоящий контрол
     * или список контролов.
     *
     * @returns {jQuery}
     */
    getControl: function() {
        return this.elem('control');
    },

    /**
     * Получить/установить атрибут имени настоящего контрола
     * или списка контролов.
     *
     * При вызове без аргумента возвращается имя контрола
     * или список имён, если контролов несколько.
     *
     * При вызове с аргументом устанавливается указанное значение атрибуту `name` контрола
     * или массив значения, если контролов несколько.
     *
     * При вызове с аргументом в виде массива атрибут `name` устанавливается
     * последовательно для каждого контрола.
     *
     * @param {string|string[]} [name] Имя или несколько имён контролов
     * @returns {BEM.DOM|string|string[]}
     */
    name: function(name) {
        var control = this.getControl();

        if(name) {
            if(Array.isArray(name)) {
                this.__self.each(control, function() {
                    this.attr('name', name.shift() || '');
                });
                return this;
            }

            this.__self.each(control, function() {
                this.attr('name', name);
            }, function() {
                this.attr('name', name + '[]');
            });
            return this;
        }

        return this.__self.each(control, function() {
            return this.attr('name');
        });
    },

    /**
     * Получить/установить значение настоящему контролу
     * или списку контролов.
     *
     * При вызове без аргумента возвращается значение контрола
     * или список значений, если контролов несколько.
     *
     * При вызове с аргументом устанавливается указанное
     * значение для всех контролов.
     *
     * При вызове с аргументом в виде массива значение устанавливается
     * последовательно для каждого контрола.
     *
     * @param {*|*[]} [value] Значение или несколько значений контролов
     * @param {object} [data] Данные для события `change`
     * @returns {BEM.DOM|string|string[]}
     */
    val: function(value, data) {
        var control = this.getControl();

        if(value) {
            var prevVal = this.val();
            this.__self.each(control, function() {
                this.val(Array.isArray(value) ? value.shift() || '' : value);
            });

            if(!_.isEqual(prevVal, this.val())) {
                this.trigger('change', data || {});
            }

            return this;
        }

        return this.__self.each(control, function() {
            return this.val();
        });
    }

}, /** @lends i-control */ {

    live: function() {
        this
            .liveBindTo('control', 'change', function(e, data) {
                this.trigger(e, data);
            });
    }

});
/* after: ../../../../../blocks/i-control/i-control.js */
/* before: ../../../../../blocks/textarea/textarea.js */
/**
 * @class textarea
 * @extends i-control
 * @bemaker i-control
 */
BEM.DOM.decl({ block: 'textarea', baseBlock: 'i-control' }, /** @lends textarea.prototype */ {

}, /** @lends textarea */ {

});
/* after: ../../../../../blocks/textarea/textarea.js */

/* before: ../../../../../blocks/i-block/i-block.bemer.js */
bemer.match('i-block', {
    js: true
});
/* after: ../../../../../blocks/i-block/i-block.bemer.js */
/* before: ../../../../../blocks/i-component/i-component.bemer.js */
bemer.match('i-component', {
    js: true
});
/* after: ../../../../../blocks/i-component/i-component.bemer.js */
/* before: ../../../../../blocks/i-control/i-control.bemer.js */
bemer.match('i-control', {
    js: true
});
/* after: ../../../../../blocks/i-control/i-control.bemer.js */
/* before: ../../../../../blocks/link/link.bemer.js */
bemer.match('link', {

    tag: 'a',

    attrs: function() {
        var attrs = {
            href: this.bemjson.href || '#'
        };

        if(this.bemjson.target) {
            attrs.target = '_' + this.bemjson.target;
        }

        return attrs;
    }

});
/* after: ../../../../../blocks/link/link.bemer.js */
/* before: ../../../../../blocks/textarea/textarea.bemer.js */
bemer.match('textarea', {

    js: true,

    tag: 'div',

    content: function() {
        return [
            {
                elem: 'control',
                placeholder: this.bemjson.placeholder,
                content: this.bemjson.content
            }
        ];
    }

});
/* after: ../../../../../blocks/textarea/textarea.bemer.js */
/* before: ../../../../../blocks/textarea/__control.bemer.js */
bemer.match('textarea__control', {

    tag: 'textarea',

    attrs: function() {
        if(this.bemjson.placeholder) {
            return { placeholder: this.bemjson.placeholder };
        }
    }

});
/* after: ../../../../../blocks/textarea/__control.bemer.js */
