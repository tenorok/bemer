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

    });
});
