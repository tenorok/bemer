definer('isTest', function(assert, is) {
    describe('Модуль is.', function() {

        it('Проверка на строку', function() {
            assert.isTrue(is.string('a'));
            assert.isTrue(is.string(new String('a')));
            assert.isTrue(is.string('a', new String('b'), 'c'));

            assert.isFalse(is.string('a', 1));
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
            assert.isTrue(is.number(new Number(1)));
            assert.isTrue(is.number(1, new Number(2), 3));

            assert.isFalse(is.number(NaN));
            assert.isFalse(is.number('a'));
            assert.isFalse(is.number(true));
            assert.isFalse(is.number([1, 2]));
            assert.isFalse(is.number({ a: 1 }));
            assert.isFalse(is.number(arguments));
            assert.isFalse(is.number(1, 2, 'c'));
        });

        it('Проверка на целое число', function() {
            assert.isTrue(is.integer(1));
            assert.isTrue(is.integer(7));
            assert.isTrue(is.integer(45));
            assert.isTrue(is.integer(new Number(100), 200));
            assert.isTrue(is.integer(200.0), 'фактически целое число');

            assert.isFalse(is.integer(1.1));
            assert.isFalse(is.integer(10, 200.01));
        });

        it('Проверка на дробное число', function() {
            assert.isTrue(is.float(1.1));
            assert.isTrue(is.float(7.2));
            assert.isTrue(is.float(45.8));
            assert.isTrue(is.float(new Number(100.2), 200.3));

            assert.isFalse(is.float(1));
            assert.isFalse(is.float(10, 200.01));
        });

        it('Проверка на NaN', function() {
            assert.isTrue(is.nan(NaN));
            assert.isTrue(is.nan(NaN, NaN));

            assert.isFalse(is.nan(undefined));
            assert.isFalse(is.nan(arguments));
            assert.isFalse(is.nan([1, 2, 3]));
            assert.isFalse(is.nan(true, false));
            assert.isFalse(is.nan(function() {}));
            assert.isFalse(is.nan({ a: 1 }));
            assert.isFalse(is.nan(0));
            assert.isFalse(is.nan(/x/));
            assert.isFalse(is.nan('a'));
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

        it('Проверка на примитив', function() {
            assert.isTrue(is.primitive('a'));
            assert.isTrue(is.primitive(1, 2, 3));
            assert.isTrue(is.primitive(true));
            assert.isTrue(is.primitive('a', 1, false));
            assert.isTrue(is.primitive(NaN));
            assert.isTrue(is.primitive(null));
            assert.isTrue(is.primitive(undefined));

            assert.isFalse(is.primitive({}));
            assert.isFalse(is.primitive([1, 2, 3]));
            assert.isFalse(is.primitive(arguments));
            assert.isFalse(is.primitive(function() {}));
            assert.isFalse(is.primitive(new Date));
            assert.isFalse(is.primitive(/x/));
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

        it('Проверка на функцию', function() {
            assert.isTrue(is.function(Object.prototype.toString));
            assert.isTrue(is.function(Number.valueOf, Date.prototype.getTime));
            assert.isTrue(is.function(function A() {}));

            assert.isFalse(is.function(arguments));
            assert.isFalse(is.function([1, 2, 3]));
            assert.isFalse(is.function(true, false));
            assert.isFalse(is.function(new Date));
            assert.isFalse(is.function({ a: 1 }));
            assert.isFalse(is.function(0));
            assert.isFalse(is.function(/x/));
            assert.isFalse(is.function('a'));
        });

        it('Проверка на нативную функцию', function() {
            assert.isTrue(is.native(Object.prototype.toString));
            assert.isTrue(is.native(Number.valueOf, Date.prototype.getTime));

            assert.isFalse(is.native(function() {}));
            assert.isFalse(is.native(function A() {}, function b() {}));
        });

        it('Проверка на простой объект (хэш/карту)', function() {
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

        it('Проверка на дату', function() {
            assert.isTrue(is.date(new Date));
            assert.isTrue(is.date(new Date, new Date));

            assert.isFalse(is.date(arguments));
            assert.isFalse(is.date([1, 2, 3]));
            assert.isFalse(is.date(true, false));
            assert.isFalse(is.date(function() {}));
            assert.isFalse(is.date({ a: 1 }));
            assert.isFalse(is.date(0));
            assert.isFalse(is.date(/x/));
            assert.isFalse(is.date('a'));
        });

        it('Проверка на регулярное выражение', function() {
            assert.isTrue(is.regexp(/x/));
            assert.isTrue(is.regexp(RegExp('a'), /b/));

            assert.isFalse(is.regexp(undefined));
            assert.isFalse(is.regexp(arguments));
            assert.isFalse(is.regexp([1, 2, 3]));
            assert.isFalse(is.regexp(true, false));
            assert.isFalse(is.regexp(function() {}));
            assert.isFalse(is.regexp({ a: 1 }));
            assert.isFalse(is.regexp(0));
            assert.isFalse(is.regexp('a'));
        });

        it('Получение типа данных', function() {
            assert.equal(is.type('a'), 'string');
            assert.equal(is.type(100, 0), 'number');
            assert.equal(is.type(true, false), 'boolean');

            assert.equal(is.type(null), 'null');
            assert.equal(is.type(undefined), 'undefined');

            assert.equal(is.type([1, 2, 3], [4, 5]), 'array');
            assert.equal(is.type(arguments), 'argument');

            assert.equal(is.type(function() {}), 'function');

            assert.equal(is.type(Number.valueOf, Date.prototype.getTime), 'native');

            assert.equal(is.type({ a: 1 }, { b: 2 }), 'map');

            assert.equal(is.type(new Date), 'date');
            assert.equal(is.type(NaN), 'nan');
            assert.equal(is.type(/a/, /b/), 'regexp');

            assert.equal(is.type(100, NaN), 'mixed');
            assert.equal(is.type(NaN, 100), 'mixed');
            assert.equal(is.type('a', 100), 'mixed');
            assert.equal(is.type(null, undefined), 'mixed');
            assert.equal(is.type([1], arguments, {}), 'mixed');
            assert.equal(is.type(new Date, NaN), 'mixed');
            assert.equal(is.type(function() {}, RegExp('a')), 'mixed');
        });

        it('Проверка на единый тип данных', function() {
            assert.isTrue(is.every('a', 'b', 'c'));
            assert.isTrue(is.every(100, 0));
            assert.isTrue(is.every(/a/, /b/));
            assert.isTrue(is.every(true, false));
            assert.isTrue(is.every(undefined));
            assert.isTrue(is.every(new Date));

            assert.isFalse(is.every(100, NaN));
            assert.isFalse(is.every(NaN, 100));
            assert.isFalse(is.every(true, {}));
            assert.isFalse(is.every('a', 100));
            assert.isFalse(is.every([1, 2, 3], arguments));
        });

    });
});
