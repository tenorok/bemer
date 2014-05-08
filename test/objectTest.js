definer('objectTest', function(assert, object) {
    describe('Модуль object.', function() {

        it('Расширить объект', function() {
            assert.deepEqual(object.extend({ a: 1 }, { b: 2 }), { a: 1, b: 2 });
        });

        it('Расширить несколько объектов', function() {
            assert.deepEqual(object.extend({ a: 1 }, { b: 2 }, { c: 3 }), { a: 1, b: 2, c: 3 });
            assert.deepEqual(object.extend({ a: 1 }, { b: 2 }, { a: 3 }), { a: 3, b: 2 });
        });

        it('Расширить объект рекурсивно', function() {
            assert.deepEqual(object.deepExtend(
                {
                    a: 1,
                    b: {
                        c: 2,
                        d: {
                            e: 3,
                            f: {
                                g: 4,
                                h: {
                                    i: 5
                                },
                                j: 6
                            }
                        }
                    }
                },
                {
                    a: 6,
                    b: {
                        c: 7,
                        d: {
                            f: {
                                g: 8,
                                h: 9
                            }
                        }
                    }
                }
            ),
                {
                    a: 6,
                    b: {
                        c: 7,
                        d: {
                            e: 3,
                            f: {
                                g: 8,
                                h: 9,
                                j: 6
                            }
                        }
                    }
                }
            );
        });

        it('Расширить несколько объектов рекурсивно', function() {
            assert.deepEqual(object.deepExtend(
                {
                    a: 1,
                    b: {
                        c: 3,
                        d: {
                            e: 4
                        }
                    },
                    f: {
                        g: 5
                    }
                },
                {
                    b: {
                        c: 4
                    }
                },
                {
                    b: {
                        d: {
                            e: 5
                        }
                    },
                    f: {
                        g: 6,
                        h: 7
                    }
                }
            ),
                {
                    a: 1,
                    b: {
                        c: 4,
                        d: {
                            e: 5
                        }
                    },
                    f: {
                        g: 6,
                        h: 7
                    }
                }
            );
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

        it('Проверка на наличие полей должна уметь обрабатывать отсутствие объекта', function() {
            assert.isTrue(object.isEmpty());
            assert.isTrue(object.isEmpty(null));
            assert.isTrue(object.isEmpty(undefined));
        });

        it('Клонировать объект', function() {
            var a = {},
                b = object.clone(a);
            b.foo = 100;
            assert.isUndefined(a.foo);
        });

        it('Клонировать объект рекурсивно', function() {
            var a = { b: { c: 100 }},
                d = object.deepClone(a);

            d.b.c = 200;
            assert.equal(a.b.c, 100);
        });

    });
});
