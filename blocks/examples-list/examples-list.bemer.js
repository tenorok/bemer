bemer
    .match('examples-list', {

        js: true,

        tag: 'ul'

    })
    .match('examples-list__item', {

        construct: function() {
            this.eq = this.data.index + 1;
        },

        tag: 'li',

        elemMods: function() {
            return { eq: this.eq };
        },

        content: function(content) {
            return [
                {
                    block: 'link',
                    mix: [{
                        block: this.data.context.block,
                        elem: 'link',
                        js: { eq: this.eq }
                    }],
                    content: [
                        {
                            block: this.data.context.block,
                            elem: 'index-wrapper',
                            content: {
                                block: this.data.context.block,
                                elem: 'index-border',
                                content: {
                                    block: this.data.context.block,
                                    elem: 'index',
                                    content: this.eq
                                }
                            }
                        },
                        content
                    ]
                }
            ];
        }

    });
