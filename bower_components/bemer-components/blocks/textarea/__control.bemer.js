bemer.match('textarea__control', {

    tag: 'textarea',

    attrs: function() {
        if(this.bemjson.placeholder) {
            return { placeholder: this.bemjson.placeholder };
        }
    }

});
