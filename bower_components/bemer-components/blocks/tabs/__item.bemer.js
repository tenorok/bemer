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
