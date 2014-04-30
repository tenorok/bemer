definer('bemerTest', function(assert, bemer) {
    describe('Модуль bemer.', function() {

        beforeEach(function() {
            bemer.clean();
        });

        it('Шаблонизация BEMJSON без шаблонов', function() {
            assert.equal(bemer({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Простой шаблон и простой BEMJSON', function() {
            bemer.match('name', { tag: 'span' });
            assert.equal(bemer({ block: 'name' }),
                '<span class="name i-bem" data-bem="{&quot;name&quot;:{}}"></span>'
            );
        });

        it('Метод clean', function() {
            bemer.match('name', { tag: 'span' });
            bemer.clean();
            assert.equal(bemer({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Несколько матчеров и шаблонов', function() {
            bemer
                .match('header', 'footer', { tag: 'span' })
                .match('header_color_red', { js: { foo: 100 }})
                .match('footer', { js: false });

            assert.equal(bemer({ block: 'header', mods: { color: 'red' }, content: { block: 'footer' }}),
                '<span class="header i-bem header_color_red" data-bem="{&quot;header&quot;:{&quot;foo&quot;:100}}">' +
                    '<span class="footer"></span>' +
                '</span>'
            );
        });

    });
});
