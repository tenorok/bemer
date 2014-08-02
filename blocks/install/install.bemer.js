bemer
    .match('install', {

        construct: function(bemjson) {
            this.version = 'v' + bemjson.version;
        },

        content: function() {
            return [
                {
                    block: 'download',
                    version: this.version
                },
                {
                    elem: 'paragraph',
                    content: [
                        {
                            block: 'link',
                            href: 'https://raw.githubusercontent.com/tenorok/bemer/' + this.version + '/bemer.min.js',
                            content: 'Загрузить сжатый bemer ' + this.version
                        },
                        {
                            elem: 'hint',
                            content: this.bemjson.size.min + 'К'
                        }
                    ]
                },
                {
                    elem: 'paragraph',
                    content: [
                        'Bemer доступен в ',
                        {
                            block: 'link',
                            href: 'http://bower.io/',
                            content: 'bower'
                        },
                        ' и ',
                        {
                            block: 'link',
                            href: 'https://www.npmjs.org/package/bemer',
                            content: 'npm'
                        }
                    ]
                }
            ];
        }

    })
    .match('install__paragraph', {

        tag: 'p'

    })
    .match('install__hint', {

        tag: 'span'

    });
