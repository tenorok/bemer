definer('TreeTest', function(assert, Tree, Pool, Template) {
    describe('Модуль Tree.', function() {

        describe('Сущности без шаблонов.', function() {

            it('Блок', function() {
                var tree = new Tree({ block: 'a' }, new Pool());
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}"></div>');
            });

            it('Блок с модификатором', function() {
                var tree = new Tree({ block: 'a', mods: { b: 'c' }}, new Pool());
                assert.equal(tree.toString(), '<div class="a i-bem a_b_c" data-bem="{&quot;a&quot;:{}}"></div>');
            });

            it('Элемент', function() {
                var tree = new Tree({ block: 'a', elem: 'b' }, new Pool());
                assert.equal(tree.toString(), '<div class="a__b i-bem" data-bem="{&quot;a__b&quot;:{}}"></div>');
            });

            it('Элемент с модификатором', function() {
                var tree = new Tree({ block: 'a', elem: 'b', elemMods: { c: 'd' }}, new Pool());
                assert.equal(tree.toString(),
                    '<div class="a__b i-bem a__b_c_d" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

            it('Блок с модификатором и элементом', function() {
                var tree = new Tree({ block: 'a', mods: { c: 'd' }, elem: 'b' }, new Pool());
                assert.equal(tree.toString(),
                    '<div class="i-bem a_c_d__b" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                var tree = new Tree({ block: 'a', mods: { c: 'd' }, elem: 'b', elemMods: { e: 'f' }}, new Pool());
                assert.equal(tree.toString(),
                    '<div class="i-bem a_c_d__b a_c_d__b_e_f" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

        });

        it('Один простой блок', function() {
            var tree = new Tree({ block: 'a' }, new Pool().add(new Template('a', {})));
            assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}"></div>');
        });

        describe('Примитивные типы в контенте блока', function() {

            it('Строка', function() {
                var tree = new Tree({ block: 'a', content: 'content' }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">content</div>');
            });

            it('Число', function() {
                var tree = new Tree({ block: 'a', content: 100 }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">100</div>');
            });

            it('Логический тип', function() {
                var tree = new Tree({ block: 'a', content: true }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">true</div>');
            });

            it('Массив примитивов', function() {
                var tree = new Tree({ block: 'a', content: ['a', 100, true] }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">a100true</div>');
            });

        });

        describe('Вложенные блоки', function() {

            it('Один вложенный блок', function() {
                var tree = new Tree({ block: 'a', content: { block: 'b' }},
                    new Pool().add(new Template('b', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                    '</div>');
            });

            it('Массив вложенных блоков', function() {
                var tree = new Tree({ block: 'a', content: [{ block: 'b' }, { block: 'c' }] },
                    new Pool().add(new Template('b', 'c', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                        '<div class="c"></div>' +
                    '</div>');
            });

        });

        it('Раскрыть контекст блока для вложенного элемента', function() {
            var tree = new Tree({
                block: 'a',
                content: {
                    elem: 'b'
                }
            }, new Pool().add(new Template('a', { js: false })));
            assert.equal(tree.toString(), '<div class="a"><div class="a__b"></div></div>');
        });

    });
});
