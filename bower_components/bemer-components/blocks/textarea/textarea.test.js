describe('textarea.', function() {

    describe('HTML.', function() {

        describe('textarea.', function() {

            it('Тег', function() {
                assert.equal($(bemer({ block: 'textarea' }))[0].tagName, 'DIV');
            });

        });

        describe('__control.', function() {

            it('Тег', function() {
                assert.equal($(bemer({ block: 'textarea' })).children('.textarea__control')[0].tagName, 'TEXTAREA');
            });

            it('Placeholder', function() {
                assert.equal(
                    $(bemer({ block: 'textarea', placeholder: 'message' }))
                        .children('.textarea__control').attr('placeholder'),
                    'message'
                );
            });

            it('Содержимое', function() {
                assert.equal($(bemer({ block: 'textarea', content: 'paragraph' }))
                    .children('.textarea__control').val(), 'paragraph'
                );
            });

        });

    });

    describe('Событие change.', function() {

        it('Возникновение события change', function(done) {
            var textarea = BEM.blocks.textarea.create();

            textarea.on('change', function() {
                assert.equal(textarea.val(), 'data');
                done();
            });

            textarea.val('data');
        });

    });

});
