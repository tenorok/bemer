definer('HelpersTest', function(assert, Helpers) {
    describe('Модуль Helpers.', function() {

        it('Получить все стандартные функции-помощники', function() {
            assert.deepEqual(Object.keys(new Helpers().get()).sort(), [
                '__constructor', 'construct',
                'isFirst', 'isLast',
                'isElem', 'isBlock',

                'escape', 'htmlEscape', 'unHtmlEscape',
                'collapse', 'stripTags',
                'upper', 'lower', 'repeat',

                'random',

                'extend', 'deepExtend',
                'clone', 'deepClone',

                'id', 'is'
            ].sort());

            assert.deepEqual(Object.keys(new Helpers().get().is).sort(), [
                'string', 'boolean',
                'number', 'integer', 'float', 'nan',
                'null', 'undefined', 'primitive',
                'array', 'argument', 'function', 'native',
                'map', 'date', 'regexp',
                'type', 'every'
            ].sort());
        });

        it('Добавить пользовательскую функцию-помощник', function() {
            var helpers = new Helpers();
            helpers.add('foo', function() {
                return 'foo';
            });
            assert.isTrue(!!~Object.keys(helpers.get()).indexOf('foo'));
        });

    });
});
