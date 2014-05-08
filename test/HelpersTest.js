definer('HelpersTest', function(assert, Helpers) {
    describe('Модуль Helpers.', function() {

        it('Получить все стандартные функции-помощники', function() {
            assert.deepEqual(Object.keys(new Helpers().get()).sort(), [
                '__constructor', 'construct',
                'isFirst', 'isLast',
                'isElem', 'isBlock',
                'escape', 'htmlEscape', 'unHtmlEscape',
                'trim', 'ltrim', 'rtrim',
                'collapse', 'stripTags',
                'upper', 'lower', 'repeat',
                'extend', 'deepExtend',
                'clone', 'deepClone'
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
