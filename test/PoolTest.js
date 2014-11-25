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

            it('Поиск для блока с модификатором и элемента с модификатором', function() {
                assert.deepEqual(new Pool()
                    .add(new Template('header_a_foo__logo', {}))
                    .add(new Template('header_b_bar__logo', {}))
                    .add(new Template('header_a_foo__logo_c_faz', {}))
                    .add(new Template('header_a_foo__logo_d_baz', {}))
                    .add(new Template('header_b_bar__logo_c_faz', {}))
                    .is(new Template('header_b_bar__logo_d_baz', {})), [1]);
            });

        });

        describe('Поиск шаблона для BEMJSON.', function() {

            it('Простой блок', function() {
                assert.equal(new Pool()
                    .add(new Template('text', { tag: 'span' }))
                    .add(new Template('header', { tag: 'header' }))
                    .add(new Template('footer', { tag: 'footer' }))
                    .find({ block: 'header' })
                    .toString(),
                    '<header class="header"></header>'
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
                    .add(new Template('header_mod_val', { attrs: { title: 'i' }}))
                    .add(new Template('footer', { tag: 'footer' }))
                    .find({ block: 'header', mods: { mod: 'val' }})
                    .toString(),
                    '<header class="header header_mod_val" title="i"></header>'
                );
            });

            it('Шаблоны с наследованием', function() {
                assert.equal(new Pool()
                    .add(new Template('header', { tag: function() { return 'head'; }}))
                    .add(new Template('header_mod_*', { attrs: { a: 1 }}))
                    .add(new Template('header_mod_val', { tag: function() { return this.__base() + 'er'; }}))
                    .find({ block: 'header', mods: { mod: 'val' }})
                    .toString(),
                    '<header class="header header_mod_val" a="1"></header>'
                );
            });

            it('Конечное значение поля шаблона определяет модификатор с большим весом', function() {
                assert.equal(new Pool()
                    .add(new Template('any_b_*', { tag: 'header' }))
                    .add(new Template('any_b_bar', { tag: 'footer' }))
                    .find({ block: 'any', mods: { b: 'bar' }})
                    .toString(),
                    '<footer class="any any_b_bar"></footer>'
                );
            });

            it('Несколько подходящих шаблонов под несколько модификаторов', function() {
                assert.equal(new Pool()
                    .add(new Template('input_a_foo', { tag: 'input', attrs: { value: 100 }}))
                    .add(new Template('input_b_bar', { attrs: { type: 'text' }}))
                    .find({ block: 'input', mods: {
                        a: 'foo',
                        b: 'bar'
                    }})
                    .toString(),
                    '<input class="input input_a_foo input_b_bar" value="100" type="text">'
                );
            });

            it('Конечное значение поля шаблона определяет более поздний модификатор', function() {
                assert.equal(new Pool()
                    .add(new Template('input_a_foo', { tag: 'footer' }))
                    .add(new Template('input_b_bar', { tag: 'header' }))
                    .find({ block: 'input', mods: {
                        a: 'foo',
                        b: 'bar'
                    }})
                    .toString(),
                    '<header class="input input_a_foo input_b_bar"></header>'
                );
            });

            it('Переопределение атрибутов в разных модификаторах', function() {
                assert.equal(new Pool()
                        .add(new Template('input_a_foo', { attrs: { c: 1 }}))
                        .add(new Template('input_b_bar', { attrs: { c: 2 }}))
                        .find({ block: 'input', mods: {
                            a: 'foo',
                            b: 'bar'
                        }})
                        .toString(),
                        '<div class="input input_a_foo input_b_bar" c="2"></div>'
                );
            });

            it('Четыре подходящих шаблона под четыре модификатора', function() {
                assert.equal(new Pool()
                        .add(new Template('text_a_foo', { tag: 'span', attrs: { value: 100 }}))
                        .add(new Template('text_b_bar', { attrs: { type: 200 }}))
                        .add(new Template('text_c_faz', { cls: 'faz' }))
                        .add(new Template('text_d_baz', { content: 'hello' }))
                        .find({ block: 'text', mods: {
                            a: 'foo',
                            b: 'bar',
                            c: 'faz',
                            d: 'baz'
                        }})
                        .toString(),
                        '<span class="faz text text_a_foo text_b_bar text_c_faz text_d_baz" value="100" type="200">' +
                            'hello' +
                        '</span>'
                );
            });

            it('При равном весе приоритет у более позднего шаблона', function() {
                assert.equal(new Pool()
                        .add(new Template('text_a_foo', { mods: { b: 'bar' }}))
                        .add(new Template('text_a_foo', { tag: 'p' }))
                        .add(new Template('text_b_bar', { tag: 'span' }))
                        .find({ block: 'text', mods: {
                            a: 'foo'
                        }})
                        .toString(),
                    '<span class="text text_b_bar text_a_foo"></span>'
                );
            });

            describe('Элементы.', function() {

                it('Простой элемент', function() {
                    assert.equal(new Pool()
                        .add(new Template('text__paragraph', { tag: 'p' }))
                        .add(new Template('header__logo', { tag: 'h1' }))
                        .add(new Template('footer__logo', { cls: 'h6' }))
                        .find({ block: 'header', elem: 'logo' })
                        .toString(),
                        '<h1 class="header__logo"></h1>'
                    );
                });

                it('Элемент с несколькими модификаторами', function() {
                    assert.equal(new Pool()
                        .add(new Template('header__logo', { tag: 'h1' }))
                        .add(new Template('header__logo_a_foo', { tag: 'h2' }))
                        .add(new Template('header__logo_b_bar', { attrs: { title: 'Yo!' }}))
                        .find({ block: 'header', elem: 'logo', elemMods: {
                            a: 'foo',
                            b: 'bar'
                        }})
                        .toString(),
                        '<h2 class="header__logo header__logo_a_foo header__logo_b_bar" title="Yo!"></h2>'
                    );
                });

                it('Блок с несколькими модификаторами и элемент с несколькими модификаторами', function() {
                    assert.equal(new Pool()
                        .add(new Template('header_a_foo__logo', { tag: 'header' }))
                        .add(new Template('header_b_bar__logo', { single: true }))
                        .add(new Template('header_a_foo__logo_c_faz', { attrs: { afaz: 1 }}))
                        .add(new Template('header_a_foo__logo_d_baz', { attrs: { abaz: 1 }}))
                        .add(new Template('header_b_bar__logo_c_faz', { attrs: { bfaz: 1 }}))
                        .add(new Template('header_b_bar__logo_d_baz', { attrs: { bbaz: 1 }}))
                        .find({ block: 'header', mods: {
                            a: 'foo',
                            b: 'bar'
                        }, elem: 'logo', elemMods: {
                            c: 'faz',
                            d: 'baz'
                        }})
                        .toString(),
                        '<header class="header_a_foo__logo header_b_bar__logo ' +
                            'header_a_foo__logo_c_faz header_a_foo__logo_d_baz ' +
                            'header_b_bar__logo_c_faz header_b_bar__logo_d_baz" ' +
                            'afaz="1" abaz="1" bfaz="1" bbaz="1">'
                    );
                });

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
