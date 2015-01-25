bemer
    .match('video', {

        content: function() {
            return [
                {
                    elem: 'clip',
                    attrs: {
                        src: this.bemjson.clip
                    }
                },
                {
                    elem: 'slides',
                    attrs: {
                        src: this.bemjson.slideshare
                    }
                },
                {
                    block: 'link',
                    href: this.bemjson.slides,
                    content: 'Скачать презентацию в .pdf'
                }
            ];
        }

    })
    .match('video__clip', 'video__slides', {

        tag: 'iframe',

        attrs: {
            frameborder: 0,
            marginwidth: 0,
            marginheight: 0,
            scrolling: 'no',
            allowfullscreen: true
        }

    });
