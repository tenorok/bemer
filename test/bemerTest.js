definer('bemerTest', function(assert, bemer) {
    describe('Модуль bemer.', function() {

        afterEach(function() {
            bemer.clean().config();
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

        describe('Изменить стандартные настройки шаблонизатора', function() {

            it('Изменение разделителя блока и элемента', function() {
                bemer.config({
                    delimiters: {
                        elem: '--'
                    }
                });
                assert.equal(bemer({ block: 'a', elem: 'b' }), '<div class="a--b"></div>');
            });

            it('Изменение обоих разделителей', function() {
                bemer.config({
                    delimiters: {
                        mod: '=',
                        elem: '--'
                    }
                });
                assert.equal(bemer({ block: 'a', elem: 'b', elemMods: { c: 'd' }}),
                    '<div class="a--b a--b=c=d"></div>');
            });

            it('Изменение обоих разделителей', function() {
                bemer.config({
                    tag: 'span'
                });
                assert.equal(bemer({ block: 'a' }), '<span class="a i-bem" data-bem="{&quot;a&quot;:{}}"></span>');
            });

            it('Изменение БЭМ-класса и БЭМ-атрибута', function() {
                bemer.config({
                    bemClass: 'bem',
                    bemAttr: 'onclick'
                });
                assert.equal(bemer({ block: 'a' }), '<div class="a bem" onclick="{&quot;a&quot;:{}}"></div>');
            });

        });

    });
});
