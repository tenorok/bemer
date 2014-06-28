definer('modulesTest', function(assert, modules, is, Name) {
    describe('Модуль modules.', function() {

        it('Получить все модули', function() {
            assert.deepEqual(Object.keys(modules.get()).sort(), [
                'number',
                'string',
                'object',
                'functions',
                'is',
                'Tag',
                'Name',
                'Node',
                'Match'
            ].sort());
        });

        it('Получить заданный модуль', function() {
            var name = modules.get('Name');
            assert.isTrue(is.function(name));
            assert.isTrue(new name instanceof Name);
        });

    });
});
