definer('modulesTest', function(assert, modules, is, Selector) {
    describe('Модуль modules.', function() {

        it('Получить все модули', function() {
            assert.deepEqual(Object.keys(modules.get()).sort(), [
                'number',
                'string',
                'object',
                'functions',
                'is',
                'Tag',
                'Selector',
                'Node',
                'Match'
            ].sort());
        });

        it('Получить заданный модуль', function() {
            var selector = modules.get('Selector');
            assert.isTrue(is.function(selector));
            assert.isTrue(new selector instanceof Selector);
        });

    });
});
