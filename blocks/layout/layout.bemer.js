bemer.match('layout', {

    tag: 'div',

    js: false,

    content: [
        {
            block: 'header',
            content: [
                { elem: 'title', content: 'Bemer' },
                { elem: 'description', content: 'БЭМ-шаблонизатор' }
            ]
        },
        {
            block: 'info',
            content: [
                {
                    block: 'description',
                    content: [
                        [
                            'БЭМ — это методология эффективной разработки веб-приложений. Большое количество информации размещено на официальном сайте ',
                            {
                                block: 'link',
                                href: 'http://ru.bem.info',
                                content: 'http://ru.bem.info'
                            },
                            '.'
                        ],
                        'Bemer — шаблонизатор, стремящийся идти по пути упрощения работы с БЭМ. Он должен быть очень удобным для разработки малых и средних проектов.',
                        [
                            'Исходный код шаблонизатора разделён на ',
                            {
                                block: 'link',
                                href: 'jsdoc/module-bemer-bemer.html',
                                content: 'подробно задокументированные модули'
                            },
                            ' с помощью ',
                            {
                                block: 'link',
                                href: 'https://github.com/tenorok/definer',
                                content: 'definer'
                            },
                            '.'
                        ],
                        [
                            'Рекомендуется использовать bemer совместно с ',
                            {
                                block: 'link',
                                href: 'http://tenorok.github.io/get-i-bem/',
                                content: 'i-bem'
                            },
                            '.'
                        ]
                    ]
                }
            ]
        },
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
