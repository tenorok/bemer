bemer.match('layout', {

    tag: 'div',

    js: false,

    content: [
        { block: 'header' },
        {
            block: 'example',
            content: [
                {
                    elem: 'templates',
                    title: 'Шаблоны',
                    content: {
                        block: 'ace',
                        mode: 'javascript'
                    }
                },
                {
                    elem: 'bemjson',
                    title: 'BEMJSON',
                    content: {
                        block: 'ace',
                        mode: 'javascript'
                    }
                },
                {
                    elem: 'result',
                    title: 'Результирующий HTML',
                    content: {
                        block: 'ace',
                        mode: 'html'
                    }
                }
            ]
        }
    ]

});
