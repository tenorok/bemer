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
