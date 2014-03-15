definer('TemplateTest', function(assert, Template) {
    describe('Модуль Template.', function() {

        it('Шаблонизировать простой блок', function() {
            assert.equal(new Template('name', {}).match({ block: 'name' }).toString(), '<div class="name"></div>');
            assert.isNull(new Template('name', {}).match({ block: 'name2' }));
        });

        it('Шаблонизировать элемент', function() {
            assert.equal(new Template('name__element', {}).match({
                block: 'name',
                elem: 'element'
            }).toString(), '<div class="name__element"></div>');
            assert.isNull(new Template('name__element2', {}).match({ block: 'name', elem: 'element' }));
        });

    });
});
