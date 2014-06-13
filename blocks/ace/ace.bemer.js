bemer.match('ace', {

    tag: 'div',

    js: function() {
        return {
            theme: this.bemjson.theme || 'tomorrow_night_eighties',
            mode: this.bemjson.mode
        };
    },

    attrs: function() {
        return {
            id: this.id()
        };
    }

});
