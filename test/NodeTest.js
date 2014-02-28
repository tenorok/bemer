definer('NodeTest', function(assert, Node) {
    describe('Модуль Node.', function() {

        it('Проверить узел на блок', function() {
            assert.isTrue(new Node({ block: 'name' }).isBlock());
            assert.isTrue(new Node({ block: 'name', js: true }).isBlock());
            assert.isFalse(new Node({ block: 'name', elem: 'elem' }).isBlock());
        });

        it('Проверить узел на элемент', function() {
            assert.isFalse(new Node({ block: 'name' }).isElem());
            assert.isTrue(new Node({ block: 'name', elem: 'elem' }).isElem());
        });

        it('Получить список классов узла', function() {
            assert.deepEqual(new Node({ block: 'name' }).getClass(), ['name']);
            assert.deepEqual(new Node({ block: 'name', bem: false }).getClass(), []);
            assert.deepEqual(new Node({ block: 'name', js: true }).getClass(), ['name', 'i-bem']);
            assert.deepEqual(new Node({ block: 'name', js: { a: 100 }}).getClass(), ['name', 'i-bem']);
            assert.deepEqual(new Node({ block: 'name', elem: 'element' }).getClass(), ['name__element']);
        });

    });
});
