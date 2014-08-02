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
