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
            block: 'description',
            content: [
                'БЭМ — это методология эффективной разработки веб-приложений. Большое количество информации размещено на официальном сайте http://ru.bem.info.',
                'Bemer — шаблонизатор, стремящийся идти по пути упрощения работы с БЭМ. Он должен быть очень удобным для разработки малых и средних проектов.',
                'Исходный код шаблонизатора разделён на подробно задокументированные модули с помощью definer.',
                'Рекомендуется использовать bemer совместно с i-bem.'
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
