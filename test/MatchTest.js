definer('MatchTest', function(assert, Match) {
    describe('Модуль Match.', function() {

        it('Получить/установить шаблон', function() {
            assert.deepEqual(new Match('header_theme_dark').pattern(), new Selector('header_theme_dark'));
            assert.deepEqual(new Match('footer').pattern('footer_size_big').pattern(), new Selector('footer_size_big'));
        });

        describe('Проверить на соответствие блоку.', function() {

            it('По имени', function() {
                var match = new Match('block');
                assert.isTrue(match.is({ block: 'block' }));
                assert.isTrue(match.is({ block: 'block', mods: {}}));
                assert.isFalse(match.is({ block: 'not-block' }));
                assert.isFalse(match.is({ block: 'block', elem: '*' }));
            });

            it('Любому блоку', function() {
                var match = new Match('*');
                assert.isTrue(match.is({ block: 'block' }));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
            });

        });

        describe('Проверить на соответствие блоку с модификатором.', function() {

            it('По имени', function() {
                var match = new Match('block_size_s');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: {}}));
                assert.isFalse(match.is({ block: 'block', mods: { theme: 'normal' }}));
                assert.isFalse(match.is({ block: 'block', mods: { size: 'm' }}));
                assert.isFalse(match.is({ block: 'block', mods: { margin: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { size: 's' }}));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }}));
            });

            it('Булев модификатор', function() {
                var match = new Match('block_big');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: {}}));
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { big: true }}));
                assert.isTrue(match.is({ block: 'block', mods: { theme: 'large', big: true }}));
            });

            it('Любое имя модификатора', function() {
                var match = new Match('block_*_s');
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { big: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { big: 's' }}));
            });

            it('Любое значение модификатора', function() {
                var match = new Match('block_size_*');
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { size: 's' }}));
            });

            it('Любое соответствие модификаторов', function() {
                var match = new Match('block_*_*');
                assert.isTrue(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { size: 's' }}));
            });

            it('Любое соответствие', function() {
                var match = new Match('*_*_*');
                assert.isTrue(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'not-block', mods: { size: 's' }}));
            });

        });

        describe('Проверить на соответствие элементу.', function() {

            it('По имени', function() {
                var match = new Match('block__element');
                assert.isTrue(match.is({ block: 'block', elem: 'element' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'element' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'element', elemMods: {}}));
                assert.isTrue(match.is({ block: 'block', mods: { mod: true }, elem: 'element' }));
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'not-block', elem: 'element' }));
                assert.isFalse(match.is({ block: 'block', elem: 'not-element' }));
                assert.isFalse(match.is({ block: 'not-block', elem: 'not-element' }));
            });

            it('Любому блоку с элементом', function() {
                var match = new Match('*__element');
                assert.isTrue(match.is({ block: 'any-block', elem: 'element' }));
                assert.isFalse(match.is({ block: 'block', elem: 'not-element' }));
            });

            it('Любому элементу', function() {
                var match = new Match('block__*');
                assert.isTrue(match.is({ block: 'block', elem: 'element' }));
                assert.isFalse(match.is({ block: 'not-block', elem: 'not-element' }));
                assert.isFalse(match.is({ block: 'block' }));
            });

            it('Любое соответствие', function() {
                var match = new Match('*__*');
                assert.isTrue(match.is({ block: 'block', elem: 'element' }));
                assert.isTrue(match.is({ block: 'not-block', elem: 'element' }));
                assert.isTrue(match.is({ block: 'not-block', elem: 'not-element' }));
            });

        });

        describe('Проверить на соответствие элементу с модификатором.', function() {

            it('По имени', function() {
                var match = new Match('block__elem_size_s');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: {}}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { theme: 'normal' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { size: 'm' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { margin: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Булев модификатор', function() {
                var match = new Match('block__elem_big');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem', elemMods: {}}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: true }}));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'elem', elemMods: { big: true }}));
            });

            it('Любое имя модификатора', function() {
                var match = new Match('block__elem_*_s');
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { big: 's' }}));
            });

            it('Любое значение модификатора', function() {
                var match = new Match('block__elem_size_*');
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Любое соответствие модификаторов', function() {
                var match = new Match('block__elem_*_*');
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Любое соответствие элемента с модификаторами', function() {
                var match = new Match('block__*_*_*');
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Любое соответствие блока и элемента с модификаторами', function() {
                var match = new Match('*__*_*_*');
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
            });

        });

        describe('Проверить на соответствие блоку с модификатором и элементу с модификатором.', function() {

            it('По имени', function() {
                var match = new Match('b_bn_bv__e_en_ev');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isFalse(match.is({ block: 'nb', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { nbn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'nbv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'ne', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { nen: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'nev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
            });

            it('Булев модификатор', function() {
                var match = new Match('b_bn__e_en');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isFalse(match.is({ block: 'nb', mods: { bn: true }, elem: 'e', elemMods: { en: true }}));
                assert.isFalse(match.is({ block: 'b', mods: { nbn: true }, elem: 'e', elemMods: { en: true }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'true' }, elem: 'e', elemMods: { en: true }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: true }, elem: 'ne', elemMods: { en: true }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: true }, elem: 'e', elemMods: { nen: true }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: true }, elem: 'e', elemMods: { en: 'true' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: true }, elem: 'e', elemMods: { en: true }}));
            });

            it('Любое имя модификатора', function() {
                var match = new Match('b_*_bv__e_*_ev');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isFalse(match.is({ block: 'nb', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'nbv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'ne', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'nev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
            });

            it('Любое значение модификатора', function() {
                var match = new Match('b_bn_*__e_en_*');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isFalse(match.is({ block: 'nb', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { nbn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'ne', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { nen: 'ev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv2' }, elem: 'e', elemMods: { en: 'ev2' }}));
            });

            it('Любое соответствие модификаторов', function() {
                var match = new Match('b_*_*__e_*_*');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isFalse(match.is({ block: 'nb', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isFalse(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'ne', elemMods: { en: 'ev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
            });

            it('Любое соответствие', function() {
                var match = new Match('*_*_*__*_*_*');
                assert.isFalse(match.is({ block: 'b', elem: 'e' }));
                assert.isTrue(match.is({ block: 'nb', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'ne', elemMods: { en: 'ev' }}));
                assert.isTrue(match.is({ block: 'b', mods: { bn: 'bv' }, elem: 'e', elemMods: { en: 'ev' }}));
            });

        });

        describe('Проверить на неточное соответствие.', function() {

            it('Блок', function() {
                assert.isTrue(new Match('block').is({ block: 'block', mods: { size: 's' }}));
                assert.isFalse(new Match('block_size').is({ block: 'block', mods: { size: 's' }}));
            });

            it('Блок с модификатором', function() {
                assert.isFalse(new Match('block_size_s').is({ block: 'block' }));
            });

            it('Элемент', function() {
                assert.isTrue(new Match('block__elem').is({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Элемент с модификатором', function() {
                assert.isFalse(new Match('block__elem_size_s').is({ block: 'block', elem: 'elem' }));
            });

            it('Блок с модификатором и элемент', function() {
                var match = new Match('block_mod_val__elem');
                assert.isTrue(match.is({ block: 'block', mods: { mod: 'val' }, elem: 'elem', elemMods: { size: 's' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                assert.isFalse(new Match('block_mod_val__elem_size_s').is(
                    { block: 'block', mods: { mod: 'val' }, elem: 'elem' }
                ));
            });

        });

        describe('Проверить на точное соответствие (эквивалент).', function() {

            it('Блок', function() {
                var match = new Match('block');
                assert.isTrue(match.equal({ block: 'block' }));
                assert.isFalse(match.equal({ block: 'block', mods: { size: 's' }}));
            });

            it('Блок с модификатором', function() {
                var match = new Match('block_size_s');
                assert.isFalse(match.equal({ block: 'block' }));
                assert.isTrue(match.equal({ block: 'block', mods: { size: 's' }}));
            });

            it('Элемент', function() {
                var match = new Match('block__elem');
                assert.isFalse(match.equal({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
                assert.isTrue(match.equal({ block: 'block', elem: 'elem' }));
            });

            it('Элемент с модификатором', function() {
                var match = new Match('block__elem_size_s');
                assert.isTrue(match.equal({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
                assert.isFalse(match.equal({ block: 'block', elem: 'elem' }));
            });

            it('Блок с модификатором и элемент', function() {
                var match = new Match('block_mod_val__elem');
                assert.isFalse(match.equal(
                    { block: 'block', mods: { mod: 'val' }, elem: 'elem', elemMods: { size: 's' }}
                ));
                assert.isTrue(match.equal({ block: 'block', mods: { mod: 'val' }, elem: 'elem' }));
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                assert.isTrue(new Match('block_mod_val__elem_size_s').equal(
                    { block: 'block', mods: { mod: 'val' }, elem: 'elem', elemMods: { size: 's' }}
                ));
            });

        });

        describe('Проверить произвольные шаблоны и узлы.', function() {

            it('Блок', function() {
                assert.isFalse(new Match('block').is({ block: 'block', elem: 'elem' }));
            });

            it('Булев модификатор блока', function() {
                var match = new Match('block_mod');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: true }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { mod: true }}));
            });

            it('Модификатор блока', function() {
                var match = new Match('block_mod_val');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: true }}));
                assert.isFalse(match.is({ block: 'block', mods: { mod: 'val' }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elemMods: { mod: 'val' }}));
            });

            it('Элемент у блока с булевым модификатором', function() {
                var match = new Match('block_mod__elem');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: 'val' }, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: { mod: true }, elem: 'elem' }));
            });

            it('Элемент у блока с модификатором', function() {
                var match = new Match('block_mod_val__elem');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem', elemMods: {}}));
                assert.isFalse(match.is({ block: 'block', mods: { mod: true }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: 'no' }, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: { mod: 'val' }, elem: 'elem' }));
            });

            it('Элемент', function() {
                var match = new Match('block__elem');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'elem', elemMods: {}}));
            });

            it('Булев модификатор элемента', function() {
                var match = new Match('block__elem_mod');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: true }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elemMods: { mod: true }}));
            });

            it('Модификатор элемента', function() {
                var match = new Match('block__elem_mod_val');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { mod: true }}));
                assert.isFalse(match.is({ block: 'block', mods: { mod: 'val' }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { mod: true }}));
            });

            it('Модификатор блока и элемента', function() {
                var match = new Match('block_m_v__elem_em_ev');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', mods: { m: 'v' }, elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { em: 'ev' }}));
            });

        });

        describe('Проверить на соответствие имени БЭМ-сущности.', function() {

            describe('Проверить на соответствие блоку.', function() {

                it('По имени', function() {
                    var match = new Match('block');
                    assert.isTrue(match.is('block'));
                    assert.isFalse(match.is('not-block'));
                });

                it('Любому блоку', function() {
                    var match = new Match('*');
                    assert.isTrue(match.is('block'));
                    assert.isTrue(match.is('block_size_s'));
                    assert.isFalse(match.is('block__elem'));
                });

            });

            describe('Проверить на соответствие блоку с модификатором.', function() {

                it('По имени', function() {
                    var match = new Match('block_size_s');
                    assert.isFalse(match.is('block'));
                    assert.isFalse(match.is('block_theme_normal'));
                    assert.isFalse(match.is('block_size_m'));
                    assert.isFalse(match.is('block_margin_s'));
                    assert.isFalse(match.is('not-block_size_s'));
                    assert.isTrue(match.is('block_size_s'));
                });

                it('Булев модификатор', function() {
                    var match = new Match('block_big');
                    assert.isFalse(match.is('block'));
                    assert.isFalse(match.is('block_big_yes'));
                    assert.isTrue(match.is('block_big'));
                });

                it('Любое имя модификатора', function() {
                    var match = new Match('block_*_s');
                    assert.isFalse(match.is('block_big_yes'));
                    assert.isTrue(match.is('block_big_s'));
                    assert.isFalse(match.is('not-block_big_s'));
                });

            });

            describe('Проверить на соответствие элементу.', function() {

                it('По имени', function() {
                    var match = new Match('block__element');
                    assert.isTrue(match.is('block__element'));
                    assert.isFalse(match.is('not-block__element'));
                    assert.isFalse(match.is('block__not-element'));
                    assert.isFalse(match.is('not-block__not-element'));
                });

            });

            describe('Проверить на соответствие элементу с модификатором.', function() {

                it('По имени', function() {
                    var match = new Match('block__elem_size_s');
                    assert.isFalse(match.is('block__elem'));
                    assert.isFalse(match.is('block__elem_theme_normal'));
                    assert.isFalse(match.is('block__elem_size_m'));
                    assert.isFalse(match.is('block__elem_margin_s'));
                    assert.isFalse(match.is('not-block__elem_size_s'));
                    assert.isTrue(match.is('block__elem_size_s'));
                });

                it('Булев модификатор', function() {
                    var match = new Match('block__elem_big');
                    assert.isFalse(match.is('block__elem'));
                    assert.isFalse(match.is('block__elem_big_yes'));
                    assert.isTrue(match.is('block__elem_big'));
                });

                it('Любое значение модификатора', function() {
                    var match = new Match('block__elem_size_*');
                    assert.isFalse(match.is('block__elem_big_yes'));
                    assert.isTrue(match.is('block__elem_size_s'));
                    assert.isFalse(match.is('not-block__elem_size_s'));
                });

            });

            describe('Проверить на соответствие имени со звёздочками.', function() {

                it('Блок', function() {
                    var match = new Match('block');
                    assert.isTrue(match.is('*'));
                    assert.isTrue(match.is('block'));
                });

                it('Блок с модификатором', function() {
                    var match = new Match('block_mod_val');
                    assert.isTrue(match.is('block_*_val'));
                    assert.isTrue(match.is('block_mod_*'));
                    assert.isTrue(match.is('*_mod_val'));
                });

                it('Блок с модификатором и звёздочками', function() {
                    var match = new Match('block_*_val');
                    assert.isTrue(match.is('*_mod_val'));
                    assert.isFalse(match.is('block_*_val2'));
                });

                it('Элемент', function() {
                    var match = new Match('block__elem');
                    assert.isTrue(match.is('block__*'));
                    assert.isTrue(match.is('*__elem'));
                });

                it('Элемент со звёздочками', function() {
                    var match = new Match('block__*');
                    assert.isTrue(match.is('*__elem'));
                    assert.isFalse(match.is('block2__elem'));
                });

                it('Элемент с модификатором', function() {
                    var match = new Match('block__elem_mod_val');
                    assert.isTrue(match.is('block__elem_mod_*'));
                    assert.isTrue(match.is('block__elem_*_val'));
                    assert.isTrue(match.is('block__*_mod_val'));
                    assert.isTrue(match.is('*__elem_mod_val'));
                    assert.isTrue(match.is('block__elem_*_*'));
                    assert.isTrue(match.is('block__*_*_*'));
                    assert.isTrue(match.is('*__*_*_*'));
                    assert.isTrue(match.is('block__*_mod_*'));
                    assert.isTrue(match.is('*__elem_mod_*'));
                    assert.isTrue(match.is('*__*_mod_*'));
                });

                it('Элемент с модификатором и звёздочками', function() {
                    var match = new Match('block__elem_*_*');
                    assert.isTrue(match.is('block__*_mod_*'));
                    assert.isTrue(match.is('block__elem_*_val'));
                    assert.isFalse(match.is('*__elem2_mod_val'));
                });

                it('Блок с модификатором и элемент', function() {
                    var match = new Match('block_mod_val__elem');
                    assert.isTrue(match.is('block_mod_val__*'));
                    assert.isTrue(match.is('block_mod_*__elem'));
                    assert.isTrue(match.is('block_*_*__elem'));
                    assert.isTrue(match.is('*_mod_*__elem'));
                });

                it('Блок с модификатором, элементом и звёздочками', function() {
                    var match = new Match('block_*_val__elem');
                    assert.isTrue(match.is('block_mod_*__*'));
                    assert.isTrue(match.is('*_mod_val__*'));
                    assert.isFalse(match.is('block_*_val__elem2'));
                });

                it('Блок с модификатором и элемент с модификатором', function() {
                    var match = new Match('block_mod_val__elem_mod_val');
                    assert.isTrue(match.is('block_mod_val__elem_mod_*'));
                    assert.isTrue(match.is('block_mod_val__elem_*_val'));
                    assert.isTrue(match.is('block_mod_val__*_mod_val'));
                    assert.isTrue(match.is('block_*_val__*_mod_val'));
                    assert.isTrue(match.is('block_mod_*__*_mod_val'));
                    assert.isTrue(match.is('*_mod_*__*_mod_val'));
                });

                it('Блок с модификатором, элемент с модификатором и звёздочки', function() {
                    var match = new Match('block_*_val__elem_mod_*');
                    assert.isTrue(match.is('block_mod_*__*_mod_val'));
                    assert.isTrue(match.is('block_mod_val__*_*_val'));
                    assert.isFalse(match.is('*_mod_val2__*_*_val'));
                });
            });

            describe('Проверить на неточное соответствие.', function() {

                it('Блок', function() {
                    assert.isTrue(new Match('block').is('block_size_s'));
                    assert.isFalse(new Match('block_size').is('block_size_s'));
                });

                it('Блок с модификатором', function() {
                    assert.isFalse(new Match('block_size_s').is('block'));
                });

                it('Элемент', function() {
                    assert.isTrue(new Match('block__elem').is('block__elem_size_s'));
                });

                it('Элемент с модификатором', function() {
                    assert.isFalse(new Match('block__elem_size_s').is('block__elem'));
                });

                it('Блок с модификатором и элемент', function() {
                    var match = new Match('block_mod_val__elem');
                    assert.isTrue(match.is('block_mod_val__elem_size_s'));
                    assert.isFalse(match.is('block__elem_size_s'));
                });

                it('Блок с модификатором и элемент с модификатором', function() {
                    assert.isFalse(new Match('block_mod_val__elem_size_s').is('block_mod_val__elem'));
                });

            });

            describe('Проверить на точное соответствие (эквивалент).', function() {

                it('Блок', function() {
                    var match = new Match('block');
                    assert.isTrue(match.equal('block'));
                    assert.isFalse(match.equal('block_size_s'));
                });

                it('Блок с модификатором', function() {
                    var match = new Match('block_size_s');
                    assert.isFalse(match.equal('block'));
                    assert.isTrue(match.equal('block_size_s'));
                });

                it('Элемент', function() {
                    var match = new Match('block__elem');
                    assert.isFalse(match.equal('block__elem_size_s'));
                    assert.isTrue(match.equal('block__elem'));
                });

                it('Элемент с модификатором', function() {
                    var match = new Match('block__elem_size_s');
                    assert.isTrue(match.equal('block__elem_size_s'));
                    assert.isFalse(match.equal('block__elem'));
                });

                it('Блок с модификатором и элемент', function() {
                    var match = new Match('block_mod_val__elem');
                    assert.isFalse(match.equal('block_mod_val__elem_size_s'));
                    assert.isTrue(match.equal('block_mod_val__elem'));
                });

                it('Блок с модификатором и элемент с модификатором', function() {
                    assert.isTrue(new Match('block_mod_val__elem_size_s').equal('block_mod_val__elem_size_s'));
                });

            });

        });

    });
});
