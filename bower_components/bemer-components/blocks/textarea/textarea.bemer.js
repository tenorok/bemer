bemer.match('textarea', {

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
