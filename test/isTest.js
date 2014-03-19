definer('isTest', function(assert, is) {
    describe('Модуль is.', function() {

        it('Проверка на строку', function() {
            assert.isTrue(is.string('a'));
            assert.isTrue(is.string(new String('a')));
            assert.isTrue(is.string('a', new String('b'), 'c'));

            assert.isFalse(is.string(1));
            assert.isFalse(is.string(true));
            assert.isFalse(is.string([1, 2]));
            assert.isFalse(is.string({ a: 1 }));
            assert.isFalse(is.string(arguments));
            assert.isFalse(is.string('a', 'b', 1));
        });

        it('Проверка на число', function() {
            assert.isTrue(is.number(1));
            assert.isTrue(is.number(1.2));
            assert.isTrue(is.number(NaN));
            assert.isTrue(is.number(new Number(1)));
            assert.isTrue(is.number(1, new Number(2), 3));

            assert.isFalse(is.number('a'));
            assert.isFalse(is.number(true));
            assert.isFalse(is.number([1, 2]));
            assert.isFalse(is.number({ a: 1 }));
            assert.isFalse(is.number(arguments));
            assert.isFalse(is.number(1, 2, 'c'));
        });

        it('Проверка на логический тип', function() {
            assert.isTrue(is.boolean(true));
            assert.isTrue(is.boolean(false));
            assert.isTrue(is.boolean(new Boolean(true)));
            assert.isTrue(is.boolean(true, new Boolean(false), true));

            assert.isFalse(is.boolean('a'));
            assert.isFalse(is.boolean(1));
            assert.isFalse(is.boolean([1, 2]));
            assert.isFalse(is.boolean({ a: 1 }));
            assert.isFalse(is.boolean(arguments));
            assert.isFalse(is.boolean(1, 2, 'c'));
        });

        it('Проверка на null', function() {
            assert.isTrue(is.null(null));
            assert.isTrue(is.null(null, null));

            assert.isFalse(is.null('a'));
            assert.isFalse(is.null(1));
            assert.isFalse(is.null([1, 2]));
            assert.isFalse(is.null({ a: 1 }));
            assert.isFalse(is.null(arguments));
            assert.isFalse(is.null(1, 2, 'c'));
        });

        it('Проверка на undefined', function() {
            assert.isTrue(is.undefined());
            assert.isTrue(is.undefined(undefined));
            assert.isTrue(is.undefined(undefined, undefined));

            assert.isFalse(is.undefined('a'));
            assert.isFalse(is.undefined(1));
            assert.isFalse(is.undefined(false));
            assert.isFalse(is.undefined(null));
            assert.isFalse(is.undefined([1, 2]));
            assert.isFalse(is.undefined({ a: 1 }));
            assert.isFalse(is.undefined(arguments));
            assert.isFalse(is.undefined(1, 2, 'c'));
        });

        it('Проверка на массив', function() {
            assert.isTrue(is.array([1, 2, 3]));
            assert.isTrue(is.array(new Array(1, 2, 3)));
            assert.isTrue(is.array(new Array(10)));
            assert.isTrue(is.array([1], new Array(2), [3]));

            assert.isFalse(is.array('a'));
            assert.isFalse(is.array(1));
            assert.isFalse(is.array(true));
            assert.isFalse(is.array({ a: 1 }));
            assert.isFalse(is.array(arguments));
            assert.isFalse(is.array(1, 2, 'c'));
        });

        it('Проверка на аргументы', function() {
            assert.isTrue(is.argument(arguments));

            assert.isFalse(is.argument({}));
            assert.isFalse(is.argument([]));
            assert.isFalse(is.argument(null));
            assert.isFalse(is.argument(new Object({ a: 1 })));
            assert.isFalse(is.argument(Object.create({ a: 1 })));
        });

        it('Проверка на нативную функцию', function() {
            assert.isTrue(is.native(Object.prototype.toString));
            assert.isTrue(is.native(Number.valueOf, Date.prototype.getTime));

            assert.isFalse(is.native(function() {}));
            assert.isFalse(is.native(function A() {}, function b() {}));
        });

        it('Проверка на простой объект/хэш/карту', function() {
            function Foo(a) { this.a = a; }

            assert.isTrue(is.map({}), 'Пустой хэш');
            assert.isTrue(is.map({ a: 1 }), 'Простой хэш');
            assert.isTrue(is.map({ 'constructor': Foo }), 'Хэш с полем по имени конструктора');
            assert.isTrue(is.map({ a: 1 }, { 'constructor': null }), 'Два хэша');

            assert.isFalse(is.map([1, 2, 3]), 'Массив');
            assert.isFalse(is.map(new Foo(1)), 'Экземпляр Foo');

            assert.isFalse(is.map(null), 'null');
            assert.isTrue(is.map(Object.create(null)), 'Object.create');
            assert.isTrue(is.map({ 'valueOf': 0 }), 'Хэш с полем valueOf');

            assert.isFalse(is.map(arguments), 'arguments');
            assert.isFalse(is.map(Error), 'Error');
            assert.isFalse(is.map(Math), 'Math');

            assert.isFalse(is.map('a'), 'Строка');
            assert.isFalse(is.map(true), 'Boolean');
        });

    });
});
