bemer.match('download', {

    construct: function(bemjson) {
        this.version = 'v' + bemjson.version;
    },

    js: false,

    content: function(content) {
        return {
            block: 'link',
            mix: [{ block: 'download', elem: 'link' }],
            href: 'https://raw.githubusercontent.com/tenorok/bemer/' + this.version + '/bemer.js',
            content: [
                'Скачать bemer.js',
                {
                    block: 'download',
                    elem: 'version',
                    content: this.version
                }
            ]
        };
    }

});
