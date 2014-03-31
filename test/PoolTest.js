definer('PoolTest', function(assert, Pool, Template) {
    describe('Модуль Pool.', function() {

        describe('Поиск аналогичного шаблона по селектору.', function() {

            it('Простой блок', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', {}))
                    .add(new Template('block3', {}))
                    .is(new Template('block2', {})), 1);
            });

        });

    });
});
