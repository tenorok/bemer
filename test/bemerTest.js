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

        it('Использование шаблонов на несколько модификаторов одновременно', function() {
            bemer
                .match('button', { tag: 'button' })
                .match('button_disabled', { attrs: { disabled: true }})
                .match('button_theme_normal', { content: 'Кнопка' });

            assert.equal(bemer({ block: 'button', mods: { disabled: true, theme: 'normal' }}),
                '<button class="button button_disabled button_theme_normal" disabled>Кнопка</button>'
            );
        });

        it('Нестрогий шаблон на элементы, добавляемые в функции шаблона блока', function() {
            bemer
                .match('user', {
                    content: function() {
                        return [
                            { elem: 'name', content: 'I' },
                            { elem: 'mail', content: 7 }
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

        it('Наследование шаблонов с базовым вызовом без функции', function() {
            bemer
                .match('button', {
                    js: true,
                    tag: 'button'
                })
                .match('button_type_pseudo', {
                    js: false,
                    tag: function() {
                        return 'my-' + this.__base();
                    }
                });

            assert.equal(bemer({
                block: 'button',
                mods: { type: 'pseudo' }
            }),
                '<my-button class="button button_type_pseudo"></my-button>'
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

        describe('Приоритеты шаблонов.', function() {

            it('При равном весе селекторов приоритет у более позднего', function() {
                bemer
                    .match('name_a_b', {
                        tag: 'p'
                    })
                    .match('name_c_d', {
                        tag: 'span'
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b', c: 'd' }}),
                    '<span class="name name_a_b name_c_d"></span>'
                );
            });

            it('Несмотря на последовательность шаблонов, приоритет у селектора с большим весом', function() {
                bemer
                    .match('name_a_b', {
                        tag: 'p'
                    })
                    .match('name_a_*', {
                        tag: 'span'
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b' }}),
                    '<p class="name name_a_b"></p>'
                );
            });

            it('Приоритет у селектора с большим весом для нескольких модификаторов', function() {
                bemer
                    .match('name_a_b', {
                        tag: 'p'
                    })
                    .match('name_c_*', {
                        tag: 'span'
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b', c: 'd' }}),
                    '<p class="name name_a_b name_c_d"></p>'
                );
            });

            it('Шаблоны с несколькими селекторами', function() {
                bemer
                    .match('name', 'name_a_b', {
                        tag: 'span',
                        mods: { c: 'd' }
                    })
                    .match('name_a_*', 'name_c_d', {
                        tag: 'p'
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b', c: 'd' }}),
                    '<p class="name name_c_d name_a_b"></p>'
                );
            });

            it('Три селектора: точный, неточный и снова точный', function() {
                bemer
                    .match('name_a_b', {
                        tag: 'h1',
                        attrs: { b: 2 }
                    })
                    .match('name_a_*', {
                        tag: 'h2',
                        attrs: { b: 1 }
                    })
                    .match('name_a_b', {
                        tag: 'h3'
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b' }}),
                    '<h3 class="name name_a_b" b="2"></h3>'
                );
            });

            it('Три модификатора и большое количество селекторов', function() {
                bemer
                    .match('name', 'name_c_d', {
                        tag: 'h1'
                    })
                    .match('name_a_*', {
                        attrs: { a: 1 }
                    })
                    .match('name_a_b', 'name_e_f', {
                        tag: 'h2'
                    })
                    .match('name_e_f', {
                        tag: 'h3',
                        mods: { g: 'h' }
                    })
                    .match('name', {
                        tag: 'h4'
                    })
                    .match('name_a_b', {
                        attrs: { b: 2 }
                    });
                assert.equal(bemer({ block: 'name', mods: { a: 'b', c: 'd', e: 'f' }}),
                    '<h3 class="name name_g_h name_a_b name_c_d name_e_f" a="1" b="2"></h3>'
                );
            });

            describe('Изменение модификаторов в шаблонах.', function() {

                it('Добавление нового модификатора', function() {
                    bemer
                        .match('header', {
                            mods: { a: 'foo' }
                        })
                        .match('header_a_foo', {
                            tag: 'header'
                        });
                    assert.equal(bemer({ block: 'header' }), '<header class="header header_a_foo"></header>');
                });

                it('Добавление нового модификатора из шаблонов в обратном порядке декларации', function() {
                    bemer
                        .match('header_a_foo', {
                            tag: 'header'
                        })
                        .match('header', {
                            mods: { a: 'foo' }
                        });
                    assert.equal(bemer({ block: 'header' }), '<header class="header header_a_foo"></header>');
                });

                it('Удаление существующего модификатора', function() {
                    bemer
                        .match('header_a_foo', {
                            tag: 'header',
                            mods: { b: 'bar' }
                        })
                        .match('header_b_bar', {
                            mods: function(bemjson) { return this.extend(bemjson, { a: false }); }
                        });
                    assert.equal(bemer({ block: 'header', mods: { a: 'foo' }}),
                        '<header class="header header_b_bar"></header>'
                    );
                });

                it('Изменение имеющегося модификатора', function() {
                    bemer
                        .match('header', {
                            mods: { a: 'foo' }
                        })
                        .match('header_a_foo', {
                            tag: 'header',
                            mods: { a: false }
                        });
                    assert.equal(bemer({ block: 'header' }), '<header class="header"></header>');
                });

                it('При равном весе приоритет у более позднего шаблона', function() {
                    bemer
                        .match('name_a_foo', { mods: { b: 'bar' }})
                        .match('name_a_foo', { tag: 'p' })
                        .match('name_b_bar', { tag: 'span' });
                    assert.equal(bemer({ block: 'name', mods: { a: 'foo' }}),
                        '<span class="name name_b_bar name_a_foo"></span>'
                    );
                });

                it('При равном весе селекторов хеши объединяются с приоритетом у более позднего шаблона', function() {
                    bemer
                        .match('header_a_foo', {
                            attrs: { c: 1 },
                            mods: { b: 'bar' }
                        })
                        .match('header_b_bar', {
                            attrs: { c: 2 }
                        });
                    assert.equal(bemer({ block: 'header', mods: { a: 'foo' }}),
                        '<div class="header header_b_bar header_a_foo" c="2"></div>'
                    );
                });

                it('Шаблоны не должны выполняться более одного раза', function() {
                    var i = 0;
                    bemer
                        .match('header_a_foo', {
                            attrs: function() {
                                var attrs = {};
                                attrs['a' + i] = i++;
                                return attrs;
                            },
                            mods: { b: 'bar' }
                        })
                        .match('header_b_bar', {
                            tag: 'header'
                        });
                    assert.equal(bemer({ block: 'header', mods: { a: 'foo' }}),
                        '<header class="header header_b_bar header_a_foo" a0="0"></header>'
                    );
                });

                it('Унаследованные моды не должны затирать предыдущий результат', function() {
                    var i = 0;
                    bemer
                        .match('header', {
                            attrs: function() {
                                var attrs = {};
                                attrs['a' + i] = i++;
                                return attrs;
                            },
                            tag: 'footer',
                            mods: { a: 'foo' }
                        })
                        .match('header_a_foo', {
                            tag: 'header'
                        });
                    assert.equal(bemer({ block: 'header' }),
                        '<header class="header header_a_foo" a0="0"></header>'
                    );
                });

                it('Функция в значении поля шаблона должна принимать актуальный BEMJSON', function() {
                    bemer
                        .match('header_a_foo', {
                            attrs: { a: 1 },
                            mods: { b: 'bar' }
                        })
                        .match('header_b_bar', {
                            attrs: function(bemjson) {
                                bemjson.a++;
                                bemjson.b = 2;
                                return bemjson;
                            }
                        });
                    assert.equal(bemer({ block: 'header', mods: { a: 'foo' }}),
                        '<div class="header header_b_bar header_a_foo" a="2" b="2"></div>'
                    );
                });

                describe('Изменение модификатора блока элемента.', function() {

                    it('Добавление нового модификатора блоку', function() {
                        bemer
                            .match('header__logo', {
                                mods: { a: 'foo' }
                            })
                            .match('header_a_foo__logo', {
                                tag: 'header'
                            });
                        assert.equal(bemer({ block: 'header', elem: 'logo' }),
                            '<header class="header_a_foo__logo"></header>'
                        );
                    });

                    it('Не нужно выполнять шаблон без модификатора после шаблона с модификатором', function() {
                        var i = 0;
                        bemer
                            .match('header__logo', {
                                construct: /* istanbul ignore next */ function() {
                                    throw new Error('Excessively execute template');
                                },
                                tag: 'footer'
                            })
                            .match('header__logo', {
                                construct: function() {},
                                attrs: function() {
                                    var attrs = {};
                                    attrs['a' + i] = i++;
                                    return attrs;
                                },
                                mods: { a: 'foo' }
                            })
                            .match('header_a_foo__logo', {
                                tag: 'header'
                            });
                        assert.equal(bemer({ block: 'header', elem: 'logo' }),
                            '<header class="header_a_foo__logo" a0="0"></header>'
                        );
                    });

                });

                describe('Изменение модификаторов элементов.', function() {

                    it('Добавление нового модификатора', function() {
                        bemer
                            .match('header__logo', {
                                elemMods: { a: 'foo' }
                            })
                            .match('header__logo_a_foo', {
                                tag: 'header'
                            });
                        assert.equal(bemer({ block: 'header', elem: 'logo' }),
                            '<header class="header__logo header__logo_a_foo"></header>'
                        );
                    });

                    it('Не нужно выполнять шаблон без модификатора после шаблона с модификатором', function() {
                        var i = 0;
                        bemer
                            .match('header__logo', {
                                construct: /* istanbul ignore next */ function() {
                                    throw new Error('Excessively execute template');
                                },
                                tag: 'footer'
                            })
                            .match('header__logo', {
                                construct: function() {},
                                attrs: function() {
                                    var attrs = {};
                                    attrs['a' + i] = i++;
                                    return attrs;
                                },
                                elemMods: { a: 'foo' }
                            })
                            .match('header__logo_a_foo', {
                                tag: 'header'
                            });
                        assert.equal(bemer({ block: 'header', elem: 'logo' }),
                            '<header class="header__logo header__logo_a_foo" a0="0"></header>'
                        );
                    });

                });

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
                    bemer.config({ xhtml: { repeatBooleanAttr: true }});
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled">');

                    bemer.config({ xhtml: { repeatBooleanAttr: false }});
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled>', 'Изменить обратно на false');
                });

                it('Отдельно closeSingleTag', function() {
                    bemer.config({ xhtml: { closeSingleTag: true }});
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled/>');

                    bemer.config({ xhtml: { closeSingleTag: false }});
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

                    bemer.config({ xhtml: { closeSingleTag: false }});
                    assert.equal(bemer({ block: 'a', tag: 'input', attrs: { disabled: true }}),
                        '<input class="a" disabled="disabled">', 'Изменить closeSingleTag обратно на false');
                });

            });

            describe('Экранирование спецсимволов.', function() {

                it('Булево значение', function() {
                    bemer.config({ escape: false });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&">\'</div>');

                    bemer.config({ escape: true });
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Отдельно content', function() {
                    bemer.config({ escape: { content: false }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&amp;">\'</div>');

                    bemer.config({ escape: { content: true }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Отдельно attrs', function() {
                    bemer.config({ escape: { attrs: false }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&">&#39;</div>');

                    bemer.config({ escape: { attrs: true }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Вместе content и attr', function() {
                    bemer.config({ escape: {
                        content: false,
                        attrs: false
                    }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&">\'</div>');

                    bemer.config({ escape: { content: true }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'' }),
                        '<div class="a" type="&">&#39;</div>');
                });

                it('Задать содержимое в шаблоне, а затем поменять глобальный конфиг', function() {
                    bemer.match('a', { content: '&' });
                    bemer.config({ escape: { content: false }});
                    assert.equal(bemer({ block: 'a' }), '<div class="a">&</div>');
                });

                it('Переопределить опцию для конкретного узла', function() {
                    bemer.config({ escape: { content: false }});
                    assert.equal(bemer({ block: 'a', attrs: { type: '&' }, content: '\'', options: { escape: true }}),
                        '<div class="a" type="&amp;">&#39;</div>');
                });

                it('Переопределить опцию для конкретного шаблона', function() {
                    bemer.match('a', { options: { escape: true }});
                    bemer.config({ escape: false });
                    assert.equal(bemer({ block: 'a', content: '\'' }), '<div class="a">&#39;</div>');
                });

                it('Уточнить опцию для конкретного шаблона', function() {
                    bemer.config({ escape: false });
                    bemer.match('a', { options: { escape: { content: true }}});
                    assert.equal(bemer({ block: 'a', attrs: { a: '&' }, content: '\'' }),
                        '<div class="a" a="&">&#39;</div>');
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
                var Selector = bemer.modules('Selector');
                assert.isTrue(is.function(Selector));
                assert.isTrue(new Selector() instanceof Selector);
            });

        });

    });
});
