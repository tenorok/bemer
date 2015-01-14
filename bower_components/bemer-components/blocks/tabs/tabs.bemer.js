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
