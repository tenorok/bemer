definer('MatchTest', function(assert, Match) {
    describe('Модуль Match.', function() {

        describe('Проверить на соответствие блоку.', function() {

            it('По имени', function() {
                var match = new Match('block');
                assert.isTrue(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'not-block' }));
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
                assert.isFalse(match.is({ block: 'block', mods: { theme: 'normal' }}));
                assert.isFalse(match.is({ block: 'block', mods: { size: 'm' }}));
                assert.isFalse(match.is({ block: 'block', mods: { margin: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { size: 's' }}));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }}));
            });

            it('Булев модификатор', function() {
                var match = new Match('block_big');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { big: true }}));
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
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { theme: 'normal' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { size: 'm' }}));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { margin: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', elem: 'elem', elemMods: { size: 's' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { size: 's' }}));
            });

            it('Булев модификатор', function() {
                var match = new Match('block__elem_big');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
                assert.isFalse(match.is({ block: 'block', elem: 'elem', elemMods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', elem: 'elem', elemMods: { big: true }}));
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

        describe('Проверить на неточное соответствие', function() {

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

        describe('Проверить на точное соответствие (эквивалент)', function() {

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

            it('Элемент', function() {
                var match = new Match('block__elem');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: { size: 's' }, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'elem' }));
                assert.isTrue(match.is({ block: 'block', mods: {}, elem: 'elem', elemMods: {}}));
            });

            it('Булев модификатор элемента', function() {
                var match = new Match('block__elem_mod');
                assert.isFalse(match.is({ block: 'block', elem: 'elem' }));
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

    });
});
