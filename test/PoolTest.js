definer('PoolTest', function(assert, Pool, Template) {
    describe('Модуль Pool.', function() {

        describe('Добавление шаблонов.', function() {

            it('С единичными селекторами', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}))
                    .add(new Template('block2', {}))
                    .add(new Template('block3', {})).pool.length, 3);
            });

            it('Несколько шаблонов за раз', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}), new Template('block2', {}))
                    .add(new Template('block3', {}), new Template('block4', {})).pool.length, 4);
            });

            it('С несколькими селекторами', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', 'block2', {}))
                    .add(new Template('block3', 'block4', {}), new Template('block5', {})).pool.length, 5);
            });

        });

        describe('Поиск аналогичного шаблона по селектору.', function() {

            it('Простой блок', function() {
                assert.deepEqual(new Pool()
                    .add(new Template('block1', {}), new Template('block2', {}))
                    .add(new Template('block3', {}))
                    .is(new Template('block2', {})), [1]);
            });

            it('Несколько селекторов по блоку', function() {
                assert.deepEqual(new Pool()
                    .add(new Template('block1', {}), new Template('block2', 'block3', {}))
                    .is(new Template('block3', {})), [2]);
            });

            it('Поиск по нескольким селекторам на блок', function() {
                assert.deepEqual(new Pool()
                    .add(new Template('block1', {}), new Template('block2', 'block3', {}))
                    .is(new Template('block1', 'block3', {})), [0, 2]);
            });

            it('В пуле несколько подходящих шаблонов', function() {
                assert.deepEqual(new Pool()
                    .add(new Template('block', {}), new Template('block', 'block_mod_val', {}))
                    .is(new Template('block_mod_val', {})), [2]);
            });

            it('Поиск несуществующего шаблона', function() {
                assert.isNull(new Pool()
                    .add(new Template('block', {}))
                    .is(new Template('block1', 'block3', {})));
            });

        });

        describe('Поиск шаблона для BEMJSON', function() {

            it('Простой блок', function() {
                assert.equal(new Pool()
                    .add(new Template('text', { tag: 'span' }))
                    .add(new Template('header', { tag: 'header' }))
                    .add(new Template('footer', { tag: 'footer' }))
                    .find({ block: 'header' })
                    .toString(),
                    '<header class="header i-bem" data-bem="{&quot;header&quot;:{}}"></header>'
                );
            });

            it('Несуществующий блок', function() {
                assert.isNull(new Pool()
                    .add(new Template('text', { tag: 'span' }))
                    .find({ block: 'header' }));
            });

            it('Блок с модификатором', function() {
                assert.equal(new Pool()
                    .add(new Template('header', { tag: 'header' }))
                    .add(new Template('header_mod_val', { tag: 'header' }))
                    .add(new Template('footer', { tag: 'footer' }))
                    .find({ block: 'header', mods: { mod: 'val' }})
                    .toString(),
                    '<header class="header i-bem header_mod_val" data-bem="{&quot;header&quot;:{}}"></header>'
                );
            });

            it('Шаблоны с наследованием', function() {
                assert.equal(new Pool()
                    .add(new Template('header', { tag: function() { return 'head'; }}))
                    .add(new Template('header_mod_*', { js: false }))
                    .add(new Template('header_mod_val', { tag: function() { return this.__base() + 'er'; }}))
                    .find({ block: 'header', mods: { mod: 'val' }})
                    .toString(),
                    '<header class="header header_mod_val"></header>'
                );
            });

        });

        describe('Очистка списка шаблонов.', function() {

            it('Удалить все шаблоны', function() {
                assert.equal(new Pool()
                    .add(new Template('block1', {}))
                    .add(new Template('block2', {}))
                    .add(new Template('block3', {}))
                    .clean().pool.length, 0);
            });

        });

    });
});
