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
/* before: ../../../../../blocks/tabs/tabs.js */
/**
 * Табы.
 *
 * Одновременно может быть выделен только один таб.
 *
 * @class tabs
 * @extends i-control
 * @bemaker i-control
 */
BEM.DOM.decl({ block: 'tabs', baseBlock: 'i-control' }, /** @lends tabs.prototype */ {

    /**
     * Событие изменения значения табов при выделении другого таба.
     *
     * @event tabs#change
     * @param {string|number|boolean} value Значение выделяемой радиокнопки
     * @param {jQuery} item Выделенный элемент `item`
     */

    /**
     * На элементах `item` возможен булев модификатор `checked`,
     * символизирующий текущий выделенный таб.
     */

    /**
     * Получить/установить значение табов.
     *
     * При получении возвращает значение текущей
     * радиокнопки в состоянии `checked`.
     *
     * При установке переводит состояние `checked` на радиокнопку
     * с указанным значением в атрибуте `value`.
     *
     * @param {string|number|boolean} [value] Значение выделяемой радиокнопки
     * @returns {string|number|BEM.DOM}
     */
    val: function(value) {
        if(!arguments.length) {
            return this.getControl().filter(':checked').val();
        }

        // Таб к выделению.
        var item = this.elem('item').filter(function(index, item) {
            return this.elemParams($(item)).value === value;
        }.bind(this));

        if(item.length) {
            // TODO: Заменить эти строки, когда решится задача https://github.com/bem/bem-bl/issues/325
            // TODO: `.delMod(this.elem('item', 'checked', true), 'checked').setMod(item, 'checked', true);`
            this.elem('item').removeClass('tabs__item_checked');
            item.addClass('tabs__item_checked');

            this.getControl().filter('[value="' + value + '"]').prop('checked', true);

            this.trigger('change', {
                value: value,
                item: item
            });
        }

        return this;
    },

    /**
     * Сбросить выделение табов.
     *
     * @returns {BEM.DOM}
     */
    reset: function() {
        // TODO: Заменить эту строку, когда решится задача https://github.com/bem/bem-bl/issues/325
        // TODO: `this.delMod(this.elem('item'), 'checked');`
        this.elem('item').removeClass('tabs__item_checked');
        this.getControl().prop('checked', false);
        return this;
    }

}, /** @lends tabs */ {

    live: function() {
        this
            .liveBindTo('control', 'change', function(e) {
                this.val(e.target.value);
            });
    }

});
/* after: ../../../../../blocks/tabs/tabs.js */
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
/* before: ../../../../../blocks/tabs/tabs.bemer.js */
bemer.match('tabs', {

    construct: function(bemjson) {

        /**
         * Значение для атрибута `name` тегов `input[type=radio]`.
         *
         * @private
         * @type {string}
         */
        this._name = bemjson.name || this.id();
    },

    tag: 'ul',

    content: function() {
        return this.bemjson.items.map(function(item) {
            item.elem = 'item';
            item.name = this._name;
            item.elemMods = { checked: !!item.checked };
            return item;
        }, this);
    }

});
/* after: ../../../../../blocks/tabs/tabs.bemer.js */
/* before: ../../../../../blocks/tabs/__control.bemer.js */
bemer.match('tabs__control', {

    tag: 'input',

    attrs: {
        type: 'radio'
    }

});
/* after: ../../../../../blocks/tabs/__control.bemer.js */
/* before: ../../../../../blocks/tabs/__item.bemer.js */
bemer.match('tabs__item', {

    tag: 'li',

    js: function() {
        return {
            value: this.bemjson.value
        };
    },

    content: function(text) {
        return {
            elem: 'label',
            name: this.bemjson.name,
            value: this.bemjson.value,
            checked: this.bemjson.elemMods.checked,
            content: text
        };
    }

});
/* after: ../../../../../blocks/tabs/__item.bemer.js */
/* before: ../../../../../blocks/tabs/__label.bemer.js */
bemer.match('tabs__label', {

    tag: 'label',

    content: function(text) {
        return [
            {
                elem: 'control',
                attrs: {
                    name: this.bemjson.name,
                    value: this.bemjson.value,
                    checked: this.bemjson.checked
                }
            },
            {
                elem: 'text',
                content: text
            }
        ];
    }

});
/* after: ../../../../../blocks/tabs/__label.bemer.js */
/* before: ../../../../../blocks/tabs/__text.bemer.js */
bemer.match('tabs__text', {

    tag: 'span'

});
/* after: ../../../../../blocks/tabs/__text.bemer.js */
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
