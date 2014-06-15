bemer.match('layout', {

    tag: 'div',

    js: false,

    content: [
        { block: 'header' },
        {
            block: 'example',
            content: [
                {
                    block: 'ace',
                    mode: 'javascript',
                    mix: [{ block: 'example', elem: 'templates' }]
                },
                {
                    block: 'ace',
                    mode: 'javascript',
                    mix: [{ block: 'example', elem: 'bemjson' }]
                },
                {
                    block: 'ace',
                    mode: 'html',
                    mix: [{ block: 'example', elem: 'result' }]
                }
            ]
        }
    ]

});
