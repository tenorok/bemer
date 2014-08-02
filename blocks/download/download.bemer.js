bemer
    .match('download', {

        content: function() {
            return [
                {
                    block: 'link',
                    mix: [{ block: 'download', elem: 'link' }],
                    href: 'https://raw.githubusercontent.com/tenorok/bemer/' + this.bemjson.version + '/bemer.js',
                    content: [
                        'Скачать bemer.js',
                        {
                            block: 'download',
                            elem: 'version',
                            content: this.bemjson.version
                        }
                    ]
                }
            ];
        }

    });

