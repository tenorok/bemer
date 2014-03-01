definer('MatchTest', function(assert, Match) {
    describe('Модуль Match.', function() {

        it('Проверить на соответствие блоку', function() {
            var match = new Match('my-block');
            assert.isTrue(match.is({ block: 'my-block' }));
            assert.isFalse(match.is({ block: 'not-my-block' }));
        });

    });
});
