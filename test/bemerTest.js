definer('bemerTest', function(assert, bemer) {
    describe('Модуль bemer.', function() {

        beforeEach(function() {
            bemer.clean();
        });

        it('Шаблонизация BEMJSON без шаблонов', function() {
            assert.equal(bemer.apply({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Простой шаблон и простой BEMJSON', function() {
            bemer.match('name', { tag: 'span' });
            assert.equal(bemer.apply({ block: 'name' }),
                '<span class="name i-bem" data-bem="{&quot;name&quot;:{}}"></span>'
            );
        });

        it('Метод clean', function() {
            bemer.match('name', { tag: 'span' });
            bemer.clean();
            assert.equal(bemer.apply({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

    });
});
