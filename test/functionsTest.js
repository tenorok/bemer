definer('functionsTest', function(assert, functions) {
    describe('Модуль functions.', function() {

        it('Создать экземпляр класса с помощью apply', function() {
            function A(a, b) { this.c = a + b; }
            assert.equal(functions.apply(A, [1, 2]).c, 3);
        });

    });
});
