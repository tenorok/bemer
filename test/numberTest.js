definer('numberTest', function(assert, number) {
    describe('Модуль number.', function() {

        it('Получить случайное число от 0 до 1', function() {
            var rand = number.random();
            assert.isTrue(rand > 0 && rand < 1);
        });

        it('Получить случайное число от 10 до 100', function() {
            var rand = number.random(10, 100);
            assert.isTrue(rand > 10 && rand < 100);
        });

        it('Получить случайное число от 10 до 100 с шагом 5', function() {
            var rand = number.random(10, 100, 5);
            assert.isTrue(rand >= 10 && rand < 100 && rand % 5 === 0);
        });

    });
});
