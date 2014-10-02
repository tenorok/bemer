definer('bemerTest', function(assert, bemer, Helpers) {
    describe('Модуль bemer.', function() {

        afterEach(function() {
            bemer.clean().config();
        });

        it('Шаблонизация BEMJSON без шаблонов', function() {
            assert.equal(bemer({ block: 'name' }),
                '<div class="name"></div>'
            );
        });

        it('Простой шаблон и простой BEMJSON', function() {
            bemer.match('name', { js: true, tag: 'span' });
            assert.equal(bemer({ block: 'name' }),
                '<span class="name i-bem" data-bem="{&quot;name&quot;:{}}"></span>'
            );
        });

        it('Анонимный блок', function() {
            bemer.match('name', { tag: false, content: 'hello' });
            assert.equal(bemer({ block: 'name' }), 'hello');
        });

        it('Метод clean', function() {
            bemer.match('name', { tag: 'span' });
            bemer.clean();
            assert.equal(bemer({ block: 'name' }),
                '<div class="name"></div>'
            );
        });

        it('Несколько матчеров и шаблонов', function() {
            bemer
                .match('header', 'footer', { tag: 'span' })
                .match('header_color_red', { js: { foo: 100 }})
                .match('footer', { js: false });

            assert.equal(bemer({ block: 'header', mods: { color: 'red' }, content: { block: 'footer' }}),
                '<span class="header i-bem header_color_red" data-bem="{&quot;header&quot;:{&quot;foo&quot;:100}}">' +
                    '<span class="footer"></span>' +
                '</span>'
            );
        });

        it('Нестрогий шаблон на элементы, добавляемые в функции шаблона блока', function() {
            bemer
                .match('user', {
                    content: function() {
                        return [
                            {elem: 'name', content: 'I'},
                            {elem: 'mail', content: 7}
                        ];
                    }
                })
                .match('user__*', { tag: 'span' });

            assert.equal(bemer({ block: 'user' }),
                '<div class="user">' +
                    '<span class="user__name">I</span>' +
                    '<span class="user__mail">7</span>' +
                '</div>');
        });

        it('Наследование шаблонов', function() {
            bemer
                .match('header', 'header_*_*__*', {
                    tag: function() {
                       return this.isElem() ? 'head' : 'foot';
                    },
                    js: function() {
                        return this.isBlock();
                    }
                })
                .match('header_color_red', { tag: function() {
                    return this.__base() + 'er';
                }});

            assert.equal(bemer({
                block: 'header',
                mods: { color: 'red' },
                content: { elem: 'logo' }
            }),
                '<footer class="header i-bem header_color_red" data-bem="{&quot;header&quot;:{}}">' +
                    '<head class="header_color_red__logo"></head>' +
                '</footer>'
            );
        });

        it('Получение значения bemjson в параметре и добавление контента', function() {
            bemer.match('name', {
                content: function(content) {
                    return { elem: 'foo', content: content };
                }
            });
            assert.equal(bemer({ block: 'name', content: 'Hello world!' }),
                '<div class="name">' +
                    '<div class="name__foo">Hello world!</div>' +
                '</div>'
            );
        });

        it('Использование this.bemjson', function() {
            bemer.match('name', {
                attrs: function() {
                    return { required: this.bemjson.flag };
                }
            });
            assert.equal(bemer({ block: 'name', js: true, flag: true }),
                '<div class="name i-bem" required data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Использование this.data', function() {
            bemer.match('name_theme_red__b', {
                content: function() {
                    assert.equal(this.data.index, 1);
                    assert.equal(this.data.length, 3);
                    assert.equal(this.data.context.block, 'name');
                    assert.deepEqual(this.data.context.mods, { theme: 'red' });
                }
            });
            bemer({
                block: 'name',
                mods: { theme: 'red' },
                content: [
                    { elem: 'a' },
                    { elem: 'b' },
                    { elem: 'c' }
                ]
            });
        });

        it('Использование this.data для вложенных массивов', function() {
            bemer.match('name_theme_red__a', 'name_theme_red__b', {
                content: function() {
                    assert.equal(this.data.index, 0);
                    assert.equal(this.data.length, 2);
                    assert.equal(this.data.context.block, 'name');
                }
            });
            bemer({
                block: 'name',
                mods: { theme: 'red' },
                content: [
                    [
                        { elem: 'a' },
                        [{ elem: 'b' }, { elem: 'c' }]
                    ]
                ]
            });
        });

        describe('Изменить стандартные настройки шаблонизатора.', function() {

            it('Изменение разделителя блока и элемента', function() {
                bemer.config({
                    delimiters: {
                        elem: '--'
                    }
                });
                assert.equal(bemer({ block: 'a', elem: 'b' }), '<div class="a--b"></div>');
            });

            it('Изменение обоих разделителей', function() {
                bemer
                    .config({
                        delimiters: {
                            mod: '=',
                            elem: '--'
                        }
                    })
                    .match('a--b=c=d', { tag: 'img' });

                assert.equal(bemer({ block: 'a', elem: 'b', elemMods: { c: 'd' }}), '<img class="a--b a--b=c=d">');
            });

            it('Изменение стандартного имени тега', function() {
                bemer.config({
                    tag: 'span'
                });
                assert.equal(bemer({ block: 'a' }), '<span class="a"></span>');
            });

            it('Изменение БЭМ-класса и БЭМ-атрибута', function() {
                bemer.config({
                    bemClass: 'bem',
                    bemAttr: 'onclick'
                });
                assert.equal(bemer({ block: 'a', js: true }), '<div class="a bem" onclick="{&quot;a&quot;:{}}"></div>');
            });

            it('Изменение префикса для идентификаторов', function() {
                bemer.config({
                    idPrefix: 'www'
                });
                bemer.match('a', {
                    js: false,
                    attrs: function() {
                        return { id: this.id() };
                    }
                });
                assert.equal(bemer({ block: 'a' }), '<div class="a" id="www' + Helpers.idSalt + '0"></div>');
            });

            describe('XHTML.', function() {

                it('Булево значение', function() {
                    bemer.config({ xhtml: true });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled"/>');

                    bemer.config({ xhtml: false });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled>', 'Изменить обратно на false');
                });

                it('Отдельно repeatBooleanAttr', function() {
                    bemer.config({ xhtml: { repeatBooleanAttr: true } });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled">');

                    bemer.config({ xhtml: { repeatBooleanAttr: false } });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled>', 'Изменить обратно на false');
                });

                it('Отдельно closeSingleTag', function() {
                    bemer.config({ xhtml: { closeSingleTag: true } });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled/>');

                    bemer.config({ xhtml: { closeSingleTag: false } });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled>', 'Изменить обратно на false');
                });

                it('Вместе repeatBooleanAttr и closeSingleTag', function() {
                    bemer.config({ xhtml: {
                        repeatBooleanAttr: true,
                        closeSingleTag: true
                    }});
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled"/>');

                    bemer.config({ xhtml: { closeSingleTag: false } });
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled">', 'Изменить closeSingleTag обратно на false');
                });

            });

            describe('Экранирование спецсимволов.', function() {

                it('Булево значение', function() {
                    bemer.config({ escape: false });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&">\'</div>');

                    bemer.config({ escape: true });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Отдельно content', function() {
                    bemer.config({ escape: { content: false } });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&amp;">\'</div>');

                    bemer.config({ escape: { content: true } });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Отдельно attr', function() {
                    bemer.config({ escape: { attr: false } });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&">&#39;</div>');

                    bemer.config({ escape: { attr: true } });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Вместе content и attr', function() {
                    bemer.config({ escape: {
                        content: false,
                        attr: false
                    }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&">\'</div>');

                    bemer.config({ escape: { content: true } });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\''}),
                        '<div class="a" type="&">&#39;</div>');
                });

            });

        });

        describe('Использование функций-помощников.', function() {

            it('Работа со строками', function() {
                bemer.match('header', 'footer', { tag: function() { return this.upper('span'); }});
                assert.equal(bemer({ block: 'header' }),
                    '<SPAN class="header"></SPAN>'
                );
            });

            it('Определение первого и последнего элемента', function() {
                bemer
                    .match('*', { js: false })
                    .match('header', { content: function() { return this.isFirst(); }})
                    .match('footer', { content: function() { return this.isLast(); }});
                assert.equal(bemer({
                    block: 'page',
                    content: [
                        { block: 'header' },
                        { block: 'footer' }
                    ]
                }),
                    '<div class="page">' +
                        '<div class="header">true</div>' +
                        '<div class="footer">true</div>' +
                    '</div>'
                );
            });

            describe('Добавление пользовательских функций-помощников.', function() {

                it('Добавление одной функции', function() {
                    bemer
                        .helper('foo', function() {
                            return 'foo';
                        })
                        .match('a', {
                            tag: function() {
                                return this.foo();
                            }
                        });

                    assert.equal(bemer({ block: 'a' }), '<foo class="a"></foo>');
                });

                it('Добавление нескольких функций', function() {
                    bemer
                        .helper('foo', function() {
                            return 'foo';
                        })
                        .helper('bang', function(str) {
                            return str + '!';
                        })
                        .match('a', {
                            js: false,
                            content: function() {
                                return this.bang(this.foo());
                            }
                        });

                    assert.equal(bemer({ block: 'a' }), '<div class="a">foo!</div>');
                });

            });

        });

        describe('Получение внутренних модулей.', function() {

            it('Получить заданный модуль', function() {
                var selector = bemer.modules('Selector');
                assert.isTrue(is.function(selector));
                assert.isTrue(new selector instanceof Selector);
            });

        });

    });
});
