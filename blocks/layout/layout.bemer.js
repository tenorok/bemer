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
                    mode: 'javascript'
                }
            ]
        }
    ]

});
