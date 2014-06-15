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
                            {
                                block: 'link',
                                href: 'http://ru.bem.info',
                                content: 'БЭМ'
                            },
                            ' — это методология эффективной разработки веб-приложений.'
                        ],
                        [
                            {
                                block: 'link',
                                href: 'https://github.com/tenorok/bemer#bemer--%D0%91%D0%AD%D0%9C-%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80',
                                content: 'Bemer'
                            },
                            ' — шаблонизатор, стремящийся идти по пути упрощения работы с БЭМ. Он удобен при разработке малых и средних проектов.'
                        ],
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
                    title: 'Декларируем шаблоны',
                    content: {
                        block: 'ace',
                        mode: 'javascript'
                    }
                },
                {
                    elem: 'bemjson',
                    title: [
                        'Подаём входящие данные в формате ',
                        {
                            block: 'link',
                            href: 'http://ru.bem.info/tools/templating-engines/BEMHTML/#bemjson',
                            content: 'BEMJSON'
                        }
                    ],
                    content: {
                        block: 'ace',
                        mode: 'javascript'
                    }
                },
                {
                    elem: 'result',
                    title: 'Получаем результирующий HTML',
                    content: {
                        block: 'ace',
                        mode: 'html'
                    }
                }
            ]
        }
    ]

});
