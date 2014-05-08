definer('bemerTest', function(assert, bemer) {
    describe('Модуль bemer.', function() {

        afterEach(function() {
            bemer.clean().config();
        });

        it('Шаблонизация BEMJSON без шаблонов', function() {
            assert.equal(bemer({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Простой шаблон и простой BEMJSON', function() {
            bemer.match('name', { tag: 'span' });
            assert.equal(bemer({ block: 'name' }),
                '<span class="name i-bem" data-bem="{&quot;name&quot;:{}}"></span>'
            );
        });

        it('Метод clean', function() {
            bemer.match('name', { tag: 'span' });
            bemer.clean();
            assert.equal(bemer({ block: 'name' }),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
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

        it('Наследование шаблонов', function() {
            bemer
                .match('header', 'header__*', {
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
                    '<head class="header__logo"></head>' +
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
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}">' +
                    '<div class="name__foo">Hello world!</div>' +
                '</div>'
            );
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
                bemer.config({
                    delimiters: {
                        mod: '=',
                        elem: '--'
                    }
                });
                assert.equal(bemer({ block: 'a', elem: 'b', elemMods: { c: 'd' }}),
                    '<div class="a--b a--b=c=d"></div>');
            });

            it('Изменение обоих разделителей', function() {
                bemer.config({
                    tag: 'span'
                });
                assert.equal(bemer({ block: 'a' }), '<span class="a i-bem" data-bem="{&quot;a&quot;:{}}"></span>');
            });

            it('Изменение БЭМ-класса и БЭМ-атрибута', function() {
                bemer.config({
                    bemClass: 'bem',
                    bemAttr: 'onclick'
                });
                assert.equal(bemer({ block: 'a' }), '<div class="a bem" onclick="{&quot;a&quot;:{}}"></div>');
            });

        });

        describe('Использование функций-помощников.', function() {

            it('Работа со строками', function() {
                bemer.match('header', 'footer', { tag: function() { return this.upper('span'); }});
                assert.equal(bemer({ block: 'header' }),
                    '<SPAN class="header i-bem" data-bem="{&quot;header&quot;:{}}"></SPAN>'
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

                    assert.equal(bemer({ block: 'a' }), '<foo class="a i-bem" data-bem="{&quot;a&quot;:{}}"></foo>');
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

    });
});
