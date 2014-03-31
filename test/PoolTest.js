definer('PoolTest', function(assert, Pool, Template) {
    describe('Модуль Pool.', function() {

        describe('Добавление шаблонов.', function() {

            it('С единичными селекторами', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}))
                    .add(new Template('block2', {}))
                    .add(new Template('block3', {})).pool.length, 3);
            });

            it('С несколькими селекторами', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', {}))
                    .add(new Template('block3', {}), new Template('block4', {})).pool.length, 4);
            });

        });

        describe('Поиск аналогичного шаблона по селектору.', function() {

            it('Простой блок', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', {}))
                    .add(new Template('block3', {}))
                    .is(new Template('block2', {})), [1]);
            });

            it('Несколько селекторов по блоку', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', 'block3', {}))
                    .is(new Template('block3', {})), [2]);
            });

            it('Поиск по нескольким селекторам на блок', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', 'block3', {}))
                    .is(new Template('block1', 'block3', {})), [0, 2]);
            });

        });

    });
});
