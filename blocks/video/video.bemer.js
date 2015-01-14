bemer
    .match('video', {

        content: [
            { elem: 'clip' },
            { elem: 'slides' },
            {
                block: 'link',
                href: 'http://download.cdn.yandex.net/company/experience/moscowjs/msk_2014_kurbatov.pdf',
                content: 'Скачать презентацию в .pdf'
            }
        ]

    })
    .match('video__clip', {
        tag: 'iframe',
        attrs: {
            width: 1125,
            height: 375,
            src: 'https://video.yandex.ru/iframe/ya-events/r87e3eszfy.6103/?player-type=custom&show-info=false&show-logo=false&hd=1',
            frameborder: 0
        }
    })
    .match('video__slides', {
        tag: 'iframe',
        attrs: {
            width: 425,
            height: 355,
            src: 'http://www.slideshare.net/slideshow/embed_code/39152899',
            frameborder: 0,
            marginwidth: 0,
            marginheight: 0,
            scrolling: 'no',
            allowfullscreen: true
        }
    });
