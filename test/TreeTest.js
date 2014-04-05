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
