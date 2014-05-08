definer('TreeTest', function(assert, Tree, Pool, Template) {
    describe('Модуль Tree.', function() {

        describe('Сущности без шаблонов.', function() {

            it('Блок', function() {
                var tree = new Tree({ block: 'a' }, new Pool());
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}"></div>');
            });

            it('Блок с модификатором', function() {
                var tree = new Tree({ block: 'a', mods: { b: 'c' }}, new Pool());
                assert.equal(tree.toString(), '<div class="a i-bem a_b_c" data-bem="{&quot;a&quot;:{}}"></div>');
            });

            it('Элемент', function() {
                var tree = new Tree({ block: 'a', elem: 'b' }, new Pool());
                assert.equal(tree.toString(), '<div class="a__b"></div>');
            });

            it('Элемент с модификатором', function() {
                var tree = new Tree({ block: 'a', elem: 'b', elemMods: { c: 'd' }}, new Pool());
                assert.equal(tree.toString(),
                    '<div class="a__b a__b_c_d"></div>'
                );
            });

            it('Блок с модификатором и элементом', function() {
                var tree = new Tree({ block: 'a', mods: { c: 'd' }, elem: 'b' }, new Pool());
                assert.equal(tree.toString(),
                    '<div class="a_c_d__b"></div>'
                );
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                var tree = new Tree({ block: 'a', mods: { c: 'd' }, elem: 'b', elemMods: { e: 'f' }}, new Pool());
                assert.equal(tree.toString(),
                    '<div class="a_c_d__b a_c_d__b_e_f"></div>'
                );
            });

        });

        it('Один простой блок', function() {
            var tree = new Tree({ block: 'a' }, new Pool().add(new Template('a', {})));
            assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}"></div>');
        });

        describe('Примитивные типы в контенте блока.', function() {

            it('Строка', function() {
                var tree = new Tree({ block: 'a', content: 'content' }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">content</div>');
            });

            it('Число', function() {
                var tree = new Tree({ block: 'a', content: 100 }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">100</div>');
            });

            it('Логический тип', function() {
                var tree = new Tree({ block: 'a', content: true }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">true</div>');
            });

            it('Массив примитивов', function() {
                var tree = new Tree({ block: 'a', content: ['a', 100, true] }, new Pool().add(new Template('a', {})));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">a100true</div>');
            });

        });

        describe('Вложенные блоки.', function() {

            it('Один вложенный блок', function() {
                var tree = new Tree({ block: 'a', content: { block: 'b' }},
                    new Pool().add(new Template('b', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                    '</div>');
            });

            it('Массив вложенных блоков', function() {
                var tree = new Tree({ block: 'a', content: [{ block: 'b' }, { block: 'c' }] },
                    new Pool().add(new Template('b', 'c', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                        '<div class="c"></div>' +
                    '</div>');
            });

            it('Массив вложенных блоков и примитивов', function() {
                var tree = new Tree({ block: 'a', content: [{ block: 'b' }, 'text', { block: 'c' }] },
                    new Pool().add(new Template('b', 'c', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                        'text' +
                        '<div class="c"></div>' +
                    '</div>');
            });

            it('Три вложенных друг в друга блока', function() {
                var tree = new Tree({ block: 'a', content: { block: 'b', content: { block: 'c', content: 'content' }}},
                    new Pool().add(new Template('a', 'b', 'c', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a">' +
                        '<div class="b">' +
                            '<div class="c">content</div>' +
                        '</div>' +
                    '</div>');
            });

            it('Пять вложенных друг в друга блока', function() {
                var tree = new Tree({ block: 'a', content: [
                        { block: 'b' },
                        { block: 'c', content: [
                            { block: 'd' },
                            { block: 'e' }
                        ] }
                    ] },
                    new Pool().add(new Template('*', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a">' +
                        '<div class="b"></div>' +
                        '<div class="c">' +
                            '<div class="d"></div>' +
                            '<div class="e"></div>' +
                        '</div>' +
                    '</div>');
            });

            it('Вложенный одноимённый блок с модификатором и шаблоном', function() {
                var tree = new Tree({ block: 'a', content: { block: 'a', mods: { b: 'c' }}},
                    new Pool().add(new Template('a', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a">' +
                        '<div class="a a_b_c"></div>' +
                    '</div>');
            });

            it('Вложенный одноимённый блок с миксом и шаблоном', function() {
                var tree = new Tree({ block: 'a', content: { block: 'a', mix: [{ block: 'b' }] }},
                    new Pool().add(new Template('a', { js: false }))
                );
                assert.equal(tree.toString(),
                    '<div class="a">' +
                        '<div class="a b"></div>' +
                    '</div>');
            });

        });

        describe('Раскрытие контекста блока.', function() {

            it('Вложенный элемент', function() {
                var tree = new Tree({
                    block: 'a',
                    content: {
                        elem: 'b'
                    }
                }, new Pool().add(new Template('a', { js: false })));
                assert.equal(tree.toString(), '<div class="a"><div class="a__b"></div></div>');
            });

            it('Распределённая структура вложенных элементов', function() {
                var tree = new Tree({
                    block: 'a',
                    content: {
                        elem: 'b',
                        content: [
                            {
                                block: 'c',
                                content: {
                                    elem: 'd'
                                }
                            },
                            {
                                elem: 'e',
                                content: {
                                    elem: 'f'
                                }
                            }
                        ]
                    }
                }, new Pool().add(new Template('a', 'c', { js: false })));
                assert.equal(tree.toString(),
                    '<div class="a">' +
                        '<div class="a__b">' +
                            '<div class="c">' +
                                '<div class="c__d"></div>' +
                            '</div>' +
                            '<div class="a__e">' +
                                '<div class="a__f"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>');
            });

        });

        describe('Модификаторы.', function() {

            it('На блок с модификатором и вложенным элементом', function() {
                var tree = new Tree({
                    block: 'a',
                    mods: { c: 'd' },
                    content: {
                        elem: 'b'
                    }
                }, new Pool());
                assert.equal(tree.toString(), '' +
                    '<div class="a i-bem a_c_d" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="a_c_d__b"></div>' +
                    '</div>');
            });

            it('На блок с модификатором и его вложенный элемент', function() {
                var tree = new Tree({
                    block: 'a',
                    mods: { c: 'd' },
                    content: {
                        elem: 'b',
                        elemMods: { e: 'f' }
                    }
                }, new Pool());
                assert.equal(tree.toString(), '' +
                    '<div class="a i-bem a_c_d" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="a_c_d__b a_c_d__b_e_f"></div>' +
                    '</div>');
            });

            it('Добавление модификаторов блоку с модификатором во вложенном элементе', function() {
                var tree = new Tree({
                    block: 'a',
                    mods: { c: 'd' },
                    content: {
                        elem: 'b',
                        mods: { g: 'h' },
                        elemMods: { e: 'f' }
                    }
                }, new Pool());
                assert.equal(tree.toString(), '' +
                    '<div class="a i-bem a_c_d" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="a_g_h__b a_c_d__b a_g_h__b_e_f a_c_d__b_e_f"></div>' +
                    '</div>');
            });

        });

        describe('Определение содержимого в шаблоне.', function() {

            it('Блок с текстом', function() {
                var tree = new Tree({ block: 'a' }, new Pool().add(new Template('a', { content: 'content' })));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">content</div>');
            });

            it('Указание контекста в шаблоне и входящих данных одновременно', function() {
                var tree = new Tree({ block: 'a', content: 'text1' },
                    new Pool().add(new Template('a', { content: 'text2' })));
                assert.equal(tree.toString(), '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">text1</div>');
            });

            it('Блок с вложенным блоком', function() {
                var tree = new Tree({ block: 'a' }, new Pool().add(new Template('a', { content: { block: 'b' }})));
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b i-bem" data-bem="{&quot;b&quot;:{}}"></div>' +
                    '</div>');
            });

            it('Вложенный блок с собственным шаблоном', function() {
                var tree = new Tree({ block: 'a' }, new Pool()
                    .add(new Template('a', { content: { block: 'b' }}))
                    .add(new Template('b', { js: false, content: 'content' })));

                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b">content</div>' +
                    '</div>');
            });

            it('Вложенный блок и элемент', function() {
                var tree = new Tree({ block: 'a' }, new Pool()
                    .add(new Template('a', { content: [{ block: 'b' }, { elem: 'c', content: 'content' }] }))
                    .add(new Template('b', { js: false }))
                    .add(new Template('a__c', { tag: 'span' })));

                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b"></div>' +
                        '<span class="a__c">content</span>' +
                    '</div>');
            });

            it('Дополнительное оборачивание содержимого', function() {
                var tree = new Tree({ block: 'a', content: 'text' }, new Pool().add(new Template('a', {
                    __constructor: function(bemjson) {
                        this.bemjson = bemjson;
                    },
                    content: function() {
                        return { block: 'b', content: this.bemjson.content };
                    }
                })));
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="b i-bem" data-bem="{&quot;b&quot;:{}}">text</div>' +
                    '</div>');
            });

            it('Дополнительное оборачивание содержимого с раскрытием контекста для элемента', function() {
                var tree = new Tree({ block: 'a', content: 'text' }, new Pool().add(new Template('a', {
                    __constructor: function(bemjson) {
                        this.bemjson = bemjson;
                    },
                    content: function() {
                        return { elem: 'b', content: this.bemjson.content };
                    }
                })));
                assert.equal(tree.toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}">' +
                        '<div class="a__b">text</div>' +
                    '</div>');
            });

        });

        it('Использование большого количества шаблонов', function() {

            var pool = new Pool()
                .add(new Template('a', { mix: [{ block: 'mix' }] }))
                .add(new Template('b', { tag: 'span', js: false }))
                .add(new Template('a_a11y', { js: false, attrs: { 'data-clickable': true }}))
                .add(new Template('a__wrap', {
                    __constructor: function(bemjson) {
                        this.bemjson = bemjson;
                    },
                    cls: 'cls',
                    content: function() {
                        return { elem: 'content', content: this.bemjson.content };
                    }
                }))
                .add(new Template('a__content', { js: true }))
                .add(new Template('b_place_top', { tag: 'header' }))
                .add(new Template('a__content_type_link', { tag: 'a', js: false, attrs: { target: '_blank' }}));

            assert.equal(new Tree({
                block: 'a',
                content: [
                    {
                        block: 'b',
                        mods: { place: 'top' }
                    },
                    {
                        elem: 'wrap',
                        content: [
                            { block: 'a', mods: { a11y: true }, content: 'welcome' },
                            {
                                block: 'b',
                                content: {
                                    block: 'a',
                                    elem: 'content',
                                    elemMods: { type: 'link' },
                                    content: 'hello'
                                }
                            }
                        ]
                    }
                ]
            }, pool).toString(),
                '<div class="a i-bem mix" data-bem="{&quot;a&quot;:{}}">' +
                    '<header class="b b_place_top"></header>' +
                    '<div class="cls a__wrap">' +
                        '<div class="a__content i-bem" data-bem="{&quot;a__content&quot;:{}}">' +
                            '<div class="a a_a11y mix" data-clickable="true">welcome</div>' +
                            '<span class="b">' +
                                '<a class="a__content a__content_type_link" target="_blank">hello</a>' +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>');
        });

        describe('Проверка правильных значений в this.data.', function() {

            it('Проверка index и length сравнением', function() {
                new Tree({
                    block: 'a',
                    content: [
                        { block: 'b' },
                        { block: 'c' },
                        { block: 'd' },
                        { block: 'e' }
                    ]
                }, new Pool()
                    .add(new Template('d', {
                        construct: function(bemjson, data) {
                            assert.equal(data.index, 2);
                            assert.equal(data.length, 4);
                        }
                    }))
                ).toString();
            });

            it('Проверка помощником isFirst', function() {
                new Tree({
                    block: 'a',
                    content: [
                        { block: 'b' },
                        { block: 'c' },
                        { block: 'd' },
                        { block: 'e' }
                    ]
                }, new Pool()
                    .add(new Template('b', 'd', {
                        construct: function(bemjson, data) {
                            if(bemjson.block === 'b') {
                                assert.isTrue(this.isFirst());
                            }
                            if(bemjson.block === 'd') {
                                assert.isFalse(this.isFirst());
                            }
                        }
                    }))
                ).toString();
            });

            it('Проверка помощником isLast', function() {
                new Tree({
                        block: 'a',
                        content: [
                            { block: 'b' },
                            { block: 'c' },
                            { block: 'd' },
                            { block: 'e' }
                        ]
                    }, new Pool()
                    .add(new Template('e', 'c', {
                        construct: function(bemjson, data) {
                            if(bemjson.block === 'e') {
                                assert.isTrue(this.isLast());
                            }
                            if(bemjson.block === 'c') {
                                assert.isFalse(this.isLast());
                            }
                        }
                    }))
                ).toString();
            });

            it('У блока поле context должно отсутствовать', function() {
                new Tree({
                        block: 'a',
                        content: [
                            { block: 'b' }
                        ]
                    }, new Pool()
                    .add(new Template('b', {
                        construct: function(bemjson, data) {
                            assert.isUndefined(data.context);
                        }
                    }))
                ).toString();
            });

            it('У элемента должно быть поле context', function() {
                new Tree({
                        block: 'a',
                        mods: { c: 'd' },
                        content: [
                            { elem: 'b' }
                        ]
                    }, new Pool()
                    .add(new Template('a__b', {
                        construct: function(bemjson, data) {
                            assert.equal(data.context.block, 'a');
                            assert.deepEqual(data.context.mods, { c: 'd' });
                        }
                    }))
                ).toString();
            });

        });

    });
});
