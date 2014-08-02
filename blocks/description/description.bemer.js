bemer
    .match('description', {

        content: function(content) {
            return content.map(function(paragraph) {
                return {
                    elem: 'paragraph',
                    content: paragraph
                };
            });
        }

    })
    .match('description__paragraph', {

        tag: 'p'

    });
