definer('TreeTest', function(assert, Tree) {
    describe('Модуль Tree.', function() {

        it('Раскрыть контекст блока для вложенного элемента', function() {
            var tree = new Tree({
                block: 'a',
                content: {
                    elem: 'b'
                }
            });

            assert.deepEqual(tree.expand(), {
                block: 'a',
                content: {
                    block: 'a',
                    elem: 'b'
                }
            });
        });

    });
});
