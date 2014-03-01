definer('MatchTest', function(assert, Match) {
    describe('Модуль Match.', function() {

        it('Проверить на соответствие блоку', function() {
            var match = new Match('block');
            assert.isTrue(match.is({ block: 'block' }));
            assert.isFalse(match.is({ block: 'not-block' }));
        });

        it('Проверить на соответствие любому блоку', function() {
            assert.isTrue(new Match('*').is({ block: 'block' }));
        });

        it('Проверить на соответствие элементу', function() {
            var match = new Match('block__element');
            assert.isTrue(match.is({ block: 'block', elem: 'element' }));
            assert.isFalse(match.is({ block: 'not-block', elem: 'element' }));
            assert.isFalse(match.is({ block: 'block', elem: 'not-element' }));
            assert.isFalse(match.is({ block: 'not-block', elem: 'not-element' }));
        });

        it('Проверить на соответствие любому блоку с элементом', function() {
            var match = new Match('*__element');
            assert.isTrue(match.is({ block: 'any-block', elem: 'element' }));
            assert.isFalse(match.is({ block: 'block', elem: 'not-element' }));
        });

        it('Проверить на соответствие любому элементу', function() {
            var match = new Match('block__*');
            assert.isTrue(match.is({ block: 'block', elem: 'element' }));
            assert.isFalse(match.is({ block: 'not-block', elem: 'not-element' }));
        });

        it('Проверить блок с элементом на любое соответствие', function() {
            assert.isFalse(new Match('*').is({ block: 'block', elem: 'element' }));

            var match = new Match('*__*');
            assert.isTrue(match.is({ block: 'block', elem: 'element' }));
            assert.isTrue(match.is({ block: 'not-block', elem: 'element' }));
            assert.isTrue(match.is({ block: 'not-block', elem: 'not-element' }));
        });

    });
});
