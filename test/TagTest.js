definer('TagTest', function(assert, Tag) {
    describe('Модуль Tag.', function() {

        it('Получить имя тега', function() {
            var div = new Tag();
            assert.equal(div.name(), 'div');

            var poly = new Tag('span');
            assert.equal(poly.name(), 'span');
            assert.equal(poly.name('img').name(), 'img');
        });

        it('Добавить/удалить классы, проверить на наличие и получить их список', function() {
            var tag = new Tag();
            assert.deepEqual(tag.addClass('block').addClass('block').getClass(), ['block']);
            assert.deepEqual(tag.addClass('block2').getClass(), ['block', 'block2']);
            assert.isTrue(tag.hasClass('block'));
            assert.deepEqual(tag.delClass('block').delClass('unexpect').getClass(), ['block2']);
            assert.isFalse(tag.hasClass('block'));
        });

        it('Проверить на одиночный тег', function() {
            var tag = new Tag('img');
            assert.isTrue(tag.single());
            assert.isFalse(tag.name('table').single());
            assert.isTrue(tag.single(true).single(), 'принудительное указание одиночного тега');
            assert.isTrue(tag.name('b').single(), 'после смены тега принудительное указание не сбрасывается');
            assert.isFalse(tag.single(false).single());
        });

        it('Добавить/удалить атрибуты, получить атрибут и список всех атрибутов', function() {
            var tag = new Tag('input');
            assert.deepEqual(tag.attr('id', 10).attr('id', 100).attr('type', 'checkbox').attrList(), {
                id: 100,
                type: 'checkbox'
            });
            assert.deepEqual(tag.delAttr('type').delAttr('unexpect').attrList(), { id: 100 });
            assert.equal(tag.attr('id'), 100);
            assert.isUndefined(tag.attr('type'));
        });

        it('Установить/добавить и получить содержимое тега', function() {
            var tag = new Tag();
            assert.deepEqual(tag.content('Первый').content(), ['Первый']);
            assert.deepEqual(tag.addContent('Второй').addContent('Третий').content(), ['Первый', 'Второй', 'Третий']);
            assert.deepEqual(tag.content('').content(), ['']);
        });

    });
});
