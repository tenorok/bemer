bemer
    .match('example', {

        js: true

    })
    .match('example__templates', 'example__bemjson', 'example__result', {

        content: function(content) {

            if(this.bemjson.title) {
                content = [content];
                content.unshift({ elem: 'title', content: this.bemjson.title });
            }

            return content;
        }

    });
