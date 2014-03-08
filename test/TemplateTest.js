definer('TemplateTest', function(assert, Template) {
    describe('Модуль Template.', function() {

        it('Шаблонизировать простой блок', function() {
            assert.deepEqual(new Template('name', {}).match({ block: 'name' }), '<div class="name"></div>');
        });

    });
});
