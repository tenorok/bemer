bemer.match('layout', {

    tag: 'div',

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
                },
                {
                    block: 'install',
                    version: '0.6.3',
                    size: {
                        min: 21
                    }
                }
            ]
        },
        {
            block: 'example',
            content: [
                {
                    elem: 'templates',
                    title: {
                        block: 'link',
                        href: 'https://github.com/tenorok/bemer#%D0%9C%D0%B5%D1%82%D0%BE%D0%B4-match',
                        content: 'Декларируем шаблоны'
                    },
                    content: {
                        block: 'ace',
                        js: {
                            mode: 'javascript',
                            minLines: 16,
                            maxLines: 45
                        }
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
                        js: {
                            mode: 'javascript',
                            minLines: 16,
                            maxLines: 45
                        }
                    }
                },
                {
                    elem: 'result',
                    title: {
                        block: 'link',
                        href: 'https://github.com/tenorok/bemer#%D0%9F%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D0%B0',
                        content: 'Получаем результирующий HTML'
                    },
                    content: {
                        block: 'ace',
                        js: {
                            mode: 'html'
                        }
                    }
                }
            ]
        }
    ]

});
