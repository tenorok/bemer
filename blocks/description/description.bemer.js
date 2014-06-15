bemer.match('description', {

    js: false,

    content: function(content) {
        return content.map(function(paragraph) {
            return {
                elem: 'paragraph',
                content: paragraph
            };
        });
    }

});

bemer.match('description__paragraph', {

    tag: 'p'

});
