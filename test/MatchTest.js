definer('MatchTest', function(assert, Match) {
    describe('Модуль Match.', function() {

        describe('Проверить на соответствие блоку.', function() {

            it('По имени', function() {
                var match = new Match('block');
                assert.isTrue(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'not-block' }));
            });

            it('Любому блоку', function() {
                assert.isTrue(new Match('*').is({ block: 'block' }));
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
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { big: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { big: 's' }}));
            });

            it('Любое значение модификатора', function() {
                var match = new Match('block_size_*');
                assert.isFalse(match.is({ block: 'block' }));
                assert.isFalse(match.is({ block: 'block', mods: { big: 'yes' }}));
                assert.isTrue(match.is({ block: 'block', mods: { size: 's' }}));
                assert.isFalse(match.is({ block: 'not-block', mods: { size: 's' }}));
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
                assert.isFalse(new Match('*').is({ block: 'block', elem: 'element' }));

                var match = new Match('*__*');
                assert.isTrue(match.is({ block: 'block', elem: 'element' }));
                assert.isTrue(match.is({ block: 'not-block', elem: 'element' }));
                assert.isTrue(match.is({ block: 'not-block', elem: 'not-element' }));
            });

        });

    });
});
