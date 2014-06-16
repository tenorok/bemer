bemer.match('ace', {

    tag: 'div',

    js: function(js) {
        return this.extend(js || {}, {
            theme: this.bemjson.theme || 'tomorrow_night_eighties'
        });
    },

    attrs: function() {
        return {
            id: this.id()
        };
    }

});
