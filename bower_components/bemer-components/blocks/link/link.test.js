describe('link.', function() {

    describe('HTML.', function() {

        describe('link', function() {

            it('Тег', function() {
                assert.equal($(bemer({ block: 'link' }))[0].tagName, 'A');
            });

            it('Атрибут href по умолчанию', function() {
                assert.equal($(bemer({ block: 'link' })).attr('href'), '#');
            });

            it('Заданный атрибут href', function() {
                assert.equal($(bemer({ block: 'link', href: '//example.com' })).attr('href'), '//example.com');
            });

            it('Атрибут target', function() {
                assert.equal($(bemer({ block: 'link', target: 'blank' })).attr('target'), '_blank');
            });

            it('Содержимое', function() {
                assert.equal($(bemer({ block: 'link', content: 'text' })).text(), 'text');
            });

        });

    });

});
