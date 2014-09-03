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
