definer('objectTest', function(assert, object) {
    describe('Модуль object.', function() {

        it('Расширить объект', function() {
            assert.deepEqual(object.extend({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
        });

        it('Расширить объект только собственными свойствами', function() {
            function Foo() {
                this.a = 1;
                this.c = 3;
            }
            Foo.prototype.b = 2;
            assert.deepEqual(object.extend({}, new Foo), { a: 1, c: 3 });
        });

        it('Перетереть свойства расширяемого объекта', function() {
            var expected = { a: 3, b: 2, c: null };
            assert.deepEqual(object.extend({ a: 1, b: 2 }, expected), expected);
        });

        it('Проверить объект на наличие полей', function() {
            assert.isTrue(object.isEmpty({}));
            assert.isFalse(object.isEmpty({ a: 1 }));
            function Foo() {}
            Foo.prototype.a = 1;
            assert.isTrue(object.isEmpty(Foo));
        });

    });
});
