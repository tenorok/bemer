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
