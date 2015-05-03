definer('TemplateTest', function(assert, Template, Helpers, Selector) {
    describe('Модуль Template.', function() {

        it('Шаблонизировать простой блок', function() {
            assert.equal(new Template('name', {}).match({ block: 'name' }).toString(),
                '<div class="name"></div>'
            );
            assert.isNull(new Template('name', {}).match({ block: 'name2' }));
        });

        it('Шаблонизировать элемент', function() {
            assert.equal(new Template('name__element', {}).match({
                block: 'name',
                elem: 'element'
            }).toString(), '<div class="name__element"></div>');
            assert.isNull(new Template('name__element2', {}).match({ block: 'name', elem: 'element' }));
        });

        it('Шаблонизировать элемент с включенным js', function() {
            assert.equal(new Template('name__element', {}).match({
                block: 'name',
                elem: 'element',
                js: true
            }).toString(), '<div class="name__element i-bem" data-bem="{&quot;name__element&quot;:{}}"></div>');
        });

        it('Шаблонизировать блок с js-параметрами', function() {
            assert.equal(new Template('name', {}).match({
                block: 'name',
                js: { foo: 100 }
            }).toString(), '<div class="name i-bem" data-bem="{&quot;name&quot;:{&quot;foo&quot;:100}}"></div>');
        });

        it('Шаблонизировать блок с заменой тега', function() {
            assert.equal(new Template('name', {
                tag: 'span'
            }).match({ block: 'name' }).toString(),
                '<span class="name"></span>'
            );
        });

        it('Шаблонизировать блок с принудительным указанием одиночного тега', function() {
            assert.equal(new Template('name', {
                single: true
            }).match({ block: 'name' }).toString(),
                '<div class="name">'
            );
            assert.equal(new Template('name', {
                tag: 'mytag',
                single: function() { return true; }
            }).match({ block: 'name' }).toString(),
                '<mytag class="name">'
            );
        });

        it('Шаблонизировать элемент с заменой тега', function() {
            assert.equal(new Template('my__*', {
                tag: function() { return 'img'; }
            }).match({ block: 'my', elem: 'image' }).toString(),
                '<img class="my__image">'
            );
        });

        it('Изменить содержимое элементов в функции по селектору со звёздочкой', function() {
            assert.equal(new Template('list__*', {
                content: function(content) { return content || 'default'; }
            }).match({ block: 'list', elem: 'item' }).toString(),
                '<div class="list__item">default</div>'
            );
        });

        it('Шаблонизировать без БЭМ', function() {
            assert.equal(new Template('name', {
                js: false,
                bem: false
            }).match({ block: 'name' }).toString(),
                '<div></div>'
            );
        });

        it('Добавить атрибутов', function() {
            assert.equal(new Template('picture', {
                tag: 'img',
                attrs: { alt: 'image' }
            }).match({ block: 'picture', attrs: { src: '1.png' }}).toString(),
                '<img class="picture" alt="image" src="1.png">'
            );
        });

        it('Добавить миксов', function() {
            assert.equal(new Template('picture', {
                tag: 'img',
                mix: [{ block: 'image', js: true }]
            }).match({ block: 'picture', mix: [{ block: 'link' }] }).toString(),
                '<img class="picture i-bem link image" data-bem="{&quot;image&quot;:{}}">'
            );
        });

        it('Шаблонизировать с произвольными классами', function() {
            assert.equal(new Template('name', {
                cls: 'my1 my2'
            }).match({ block: 'name' }).toString(),
                '<div class="my1 my2 name"></div>'
            );
        });

        it('Шаблонизировать с добавлением модификаторов', function() {
            assert.equal(new Template('name', {
                mods: { theme: 'normal' },
                elemMods: { fake: true }
            }).match({ block: 'name' }).toString(),
                '<div class="name name_theme_normal"></div>'
            );
        });

        it('Шаблонизировать с наследованием модификаторов', function() {
            assert.equal(new Template('name_size_s', {
                mods: { theme: 'normal' }
            }).match({ block: 'name', mods: { size: 's' }}).toString(),
                '<div class="name name_theme_normal name_size_s"></div>'
            );
            assert.equal(new Template('name_size_s', {
                mods: { theme: 'normal' }
            }).match({ block: 'name', mods: { size: 's', theme: 'dark' }}).toString(),
                '<div class="name name_theme_dark name_size_s"></div>'
            );
        });

        it('Шаблонизировать с добавлением булевых модификаторов блоку', function() {
            assert.equal(new Template('name', {
                js: false,
                mods: { checked: true }
            }).match({ block: 'name' }).toString(),
                '<div class="name name_checked"></div>'
            );
            assert.equal(new Template('name', {
                js: false,
                mods: { checked: false }
            }).match({ block: 'name' }).toString(),
                '<div class="name"></div>'
            );
        });

        it('Шаблонизировать с добавлением модификаторов элементу', function() {
            assert.equal(new Template('name__elem', {
                elemMods: { checked: true }
            }).match({ block: 'name', elem: 'elem' }).toString(),
                '<div class="name__elem name__elem_checked"></div>'
            );
        });

        it('Установить блоку содержимое', function() {
            assert.equal(new Template('name', {
                content: 'просто текст'
            }).match({ block: 'name' }).toString(),
                '<div class="name">просто текст</div>'
            );
            assert.equal(new Template('name', {
                content: ['первый', ' и ', 'второй']
            }).match({ block: 'name' }).toString(),
                '<div class="name">первый и второй</div>'
            );
            assert.equal(new Template('name', {
                content: ['один']
            }).match({ block: 'name', content: 'два' }).toString(),
                '<div class="name">два</div>'
            );
        });

        it('Шаблонизировать анонимный блок', function() {
            assert.equal(new Template('name', {
                tag: false,
                content: 'содержимое'
            }).match({ block: 'name' }).toString(), 'содержимое');
        });

        it('Корректно устанавливаются моды шаблонов с разным весом', function() {
            var bemjson = { block: 'name', mods: { a: 'b' }},
                processedMods = [],
                modesFromAnotherTemplates = [],

                firstNode = new Template('name_a_*', { tag: 'span', attrs: { a: 1 }})
                    .match(bemjson, {}, processedMods, bemjson, modesFromAnotherTemplates, 0),

                secondNode = new Template('name_a_b', { tag: 'p', attrs: { a: 2 }})
                    .match(firstNode.bemjson(), {}, processedMods, bemjson, modesFromAnotherTemplates, 1),

                thirdNode = new Template('name_*_b', { tag: 'footer', single: true })
                    .match(secondNode.bemjson(), {}, processedMods, bemjson, modesFromAnotherTemplates, 1);

            assert.equal(firstNode.toString(), '<span class="name name_a_b" a="1"></span>');
            assert.equal(secondNode.toString(), '<p class="name name_a_b" a="2"></p>');
            assert.equal(thirdNode.toString(), '<p class="name name_a_b" a="2">');
        });

        describe('Экранирование содержимого.', function() {

            it('Строка в содержимом', function() {
                assert.equal(new Template('name', {
                    content: '>>экранирование<<'
                }).match({ block: 'name' }).toString(),
                    '<div class="name">&gt;&gt;экранирование&lt;&lt;</div>'
                );
            });

            it('Массив в содержимом', function() {
                assert.equal(new Template('name', {
                    content: [
                        '>раз<',
                        '&"два"'
                    ]
                }).match({ block: 'name' }).toString(),
                    '<div class="name">&gt;раз&lt;&amp;&quot;два&quot;</div>'
                );
            });

            it('Массив в содержимом шаблона и BEMJSON', function() {
                assert.equal(new Template('name', {
                    content: [
                        '>два<',
                        '&"три"'
                    ]
                }).match({ block: 'name', content: ['<раз>'] }).toString(),
                    '<div class="name">&lt;раз&gt;&gt;два&lt;&amp;&quot;три&quot;</div>'
                );
            });

        });

        describe('Несколько селекторов.', function() {

            it('Несколько блоков', function() {
                assert.equal(new Template('name1', 'name2', 'name3', {}).match({ block: 'name2' }).toString(),
                    '<div class="name2"></div>'
                );
                assert.isNull(new Template('name1', 'name2', 'name3', {}).match({ block: 'name4' }));
            });

            it('Блоки с модификаторами', function() {
                assert.equal(new Template('name1', 'name2_mod_val', 'name3', {}).match(
                    { block: 'name2', mods: { mod: 'val' }}
                ).toString(),
                    '<div class="name2 name2_mod_val"></div>'
                );
            });

            it('Элементы', function() {
                assert.equal(new Template('block__elem', 'block__elem2', {}).match(
                    { block: 'block', elem: 'elem2' }
                ).toString(),
                    '<div class="block__elem2"></div>'
                );
            });

            it('Блок и элементы', function() {
                assert.equal(new Template('block', 'block__elem', 'block__elem2', {}).match(
                    { block: 'block', elem: 'elem2' }
                ).toString(),
                    '<div class="block__elem2"></div>'
                );
            });

        });

        describe('Наследование шаблонов.', function() {

            it('Одиночное наследование', function() {
                assert.equal(new Template('parent', { js: true, mods: function() { return { a: 1 }; }})
                    .extend(new Template('child', { mods: function() { return { a: this.__base().a, b: 2 }; }}))
                    .match({ block: 'child' }).toString(),
                    '<div class="child i-bem child_a_1 child_b_2" data-bem="{&quot;child&quot;:{}}"></div>'
                );
            });

            it('Цепочка наследований', function() {
                assert.equal(new Template('grand', { js: false, mods: { a: 1 }})
                    .extend(new Template('parent', { mods: function() { return { a: 2 }; }}))
                    .extend(new Template('child', { mods: function() { return { a: this.__base().a, b: 2 }; }}))
                    .match({ block: 'child' }).toString(),
                    '<div class="child child_a_2 child_b_2"></div>'
                );
            });

            it('Длинная цепочка наследований', function() {
                assert.equal(new Template('great', { js: false, mods: { a: 1 }})
                    .extend(new Template('grand', { mods: function() { return { a: 2 }; }}))
                    .extend(new Template('parent', { mods: function() { return { a: this.__base().a + 1 }; }}))
                    .extend(new Template('child', { mods: function() { return { a: this.__base().a + 1 }; }}))
                    .match({ block: 'child' }).toString(),
                    '<div class="child child_a_4"></div>'
                );
            });

            it('Изменение настроек экранирования через наследование', function() {
                assert.equal(new Template('parent', { options: { escape: false }})
                    .extend(new Template('child', { options: { escape: { content: true, attrs: false }}}))
                    .match({ block: 'child', attrs: { a: '&' }, content: '&' }).toString(),
                    '<div class="child" a="&">&amp;</div>'
                );
            });

            it('Получение предыдущего значения моды без функции', function() {
                assert.equal(new Template('parent', { tag: 'head' })
                    .extend(new Template('child', { tag: function() { return this.__base() + 'er'; }}))
                    .match({ block: 'child' }).toString(),
                    '<header class="child"></header>'
                );
            });

            it('Получение предыдущего значения кастомного поля', function() {
                assert.equal(new Template('parent', { custom: 100 })
                    .extend(new Template('child', {
                        custom: function() { return this.__base() + 200; },
                        content: function() { return this.custom(); }
                    }))
                    .match({ block: 'child' }).toString(),
                    '<div class="child">300</div>'
                );
            });

        });

        it('Разбивка на шаблоны с единичными селекторами', function() {
            var templates = new Template('one', 'two', 'three', {}).split();
            assert.isNotNull(templates[0].match({ block: 'one' }));
            assert.isNotNull(templates[1].match({ block: 'two' }));
            assert.isNotNull(templates[2].match({ block: 'three' }));
            assert.isNull(templates[2].match({ block: 'four' }));
        });

        describe('Проверка шаблонов на соответствие.', function() {

            it('Блок', function() {
                var template = new Template('block', {});
                assert.isTrue(template.is(new Template('block', {})));
                assert.isTrue(template.is(new Template('block_mod_val', {})));
                assert.isFalse(template.is(new Template('block1', {})));
            });

            it('Блок с модификатором', function() {
                var template = new Template('block_mod_val', {});
                assert.isFalse(template.is(new Template('block', {})));
                assert.isTrue(template.is(new Template('block_mod_val', {})));
                assert.isFalse(template.is(new Template('block1', {})));
                assert.isFalse(template.is(new Template('block_mod', {})));
                assert.isFalse(template.is(new Template('block_mod_foo', {})));
                assert.isTrue(template.is(new Template('block_mod_*', {})));
            });

            it('Несколько блоков', function() {
                var template = new Template('block1', 'block2', 'block3', {});
                assert.isTrue(template.is(new Template('block2', {})));
                assert.isTrue(template.is(new Template('block4', 'block1', {})));
                assert.isTrue(template.is(new Template('block1_mod_val', 'block1', {})));
                assert.isFalse(template.is(new Template('block4', 'block5', {})));
            });

        });

        describe('Применение стандартного шаблона.', function() {

            it('Безымянный тег', function() {
                assert.equal(Template.base({}).toString(),
                    '<div></div>'
                );
            });

            it('Блок', function() {
                assert.equal(Template.base({ block: 'a' }).toString(),
                    '<div class="a"></div>'
                );
            });

            it('Блок с модификатором', function() {
                assert.equal(Template.base({ block: 'a', mods: { b: 'c' }}).toString(),
                    '<div class="a a_b_c"></div>'
                );
            });

            it('Элемент', function() {
                assert.equal(Template.base({ block: 'a', elem: 'b' }).toString(),
                    '<div class="a__b"></div>'
                );
            });

            it('Элемент с модификатором', function() {
                assert.equal(Template.base({ block: 'a', elem: 'b', elemMods: { c: 'd' }}).toString(),
                    '<div class="a__b a__b_c_d"></div>'
                );
            });

            it('Блок с модификатором и элементом', function() {
                assert.equal(Template.base({ block: 'a', mods: { c: 'd' }, elem: 'b' }).toString(),
                    '<div class="a_c_d__b"></div>'
                );
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                assert.equal(Template.base({ block: 'a', mods: { c: 'd' }, elem: 'b', elemMods: { e: 'f' }}).toString(),
                    '<div class="a_c_d__b a_c_d__b_e_f"></div>'
                );
            });

        });

        describe('Переопределение мод.', function() {

            it('Для примитивных значений приоритет у bemjson', function() {

                assert.equal(new Template('name', { tag: 'span' }).match({ block: 'name', tag: 'i' }).toString(),
                    '<i class="name"></i>',
                    'строка'
                );

                assert.equal(new Template('name', { js: true }).match({ block: 'name', js: false }).toString(),
                    '<div class="name"></div>',
                    'логический тип'
                );

                assert.equal(new Template('name', { tag: false }).match({ block: 'name', tag: true }).toString(),
                    '<div class="name"></div>',
                    'логический тип и тег по умолчанию'
                );

            });

            it('Массивы конкатенируются', function() {
                assert.equal(new Template('name', { mix: [{ block: 'mix2' }] }).match({
                    block: 'name', mix: [{ block: 'mix1' }]
                }).toString(),
                    '<div class="name mix1 mix2"></div>'
                );
            });

            it('Объекты (карты) наследуются с приоритетом у bemjson', function() {
                assert.equal(new Template('name', { mods: { a: 'b' }}).match({
                    block: 'name', mods: { a: 'c', d: 'e' }
                }).toString(),
                    '<div class="name name_a_c name_d_e"></div>'
                );
                assert.equal(new Template('name', { attrs: { style: { height: 100 }}}).match({
                        block: 'name', attrs: { style: { textAlign: 'center' }}
                    }).toString(),
                    '<div class="name" style="text-align:center;"></div>'
                );
            });

            describe('Переопределение функцией в шаблоне.', function() {

                it('Примитивные значения', function() {

                    assert.equal(new Template('name', { tag: function() { return 'span'; }}).match({
                        block: 'name', tag: 'i'
                    }).toString(),
                        '<span class="name"></span>',
                        'строка'
                    );

                    assert.equal(new Template('name', { js: function() { return true; }}).match({
                        block: 'name', js: false
                    }).toString(),
                        '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>',
                        'логический тип'
                    );

                });

                it('Массивы не конкатенируются', function() {
                    assert.equal(new Template('name', { mix: function() { return [{ block: 'mix2' }]; }}).match({
                        block: 'name', mix: [{ block: 'mix1' }]
                    }).toString(),
                        '<div class="name mix2"></div>'
                    );
                });

                it('Объекты (карты) не наследуются', function() {
                    assert.equal(new Template('name', { mods: function() { return { a: 'b' }; }}).match({
                        block: 'name', mods: { a: 'c', d: 'e' }
                    }).toString(),
                        '<div class="name name_a_b"></div>'
                    );
                });

            });

            describe('Внутренний конструктор.', function() {

                it('Переопределение внутреннего конструктора и кастомная мода', function() {
                    assert.equal(new Template('name', {
                        __constructor: function(bemjson) {
                            this.json = bemjson;
                        },
                        isIndex: function() {
                            return this.json.index;
                        },
                        mods: function() {
                            if(this.isIndex()) {
                                return { theme: 'normal' };
                            }
                        }
                    }).match({ block: 'name', index: true }).toString(),
                        '<div class="name name_theme_normal"></div>'
                    );
                });

                it('Использовать поле bemjson в кастомной моде', function() {
                    assert.equal(new Template('name', {
                        isIndex: function() {
                            return this.bemjson.index;
                        },
                        mods: function() {
                            if(this.isIndex()) {
                                return { theme: 'normal' };
                            }
                        }
                    }).match({ block: 'name', index: true }).toString(),
                        '<div class="name name_theme_normal"></div>'
                    );
                });

            });

            describe('Внешний конструктор.', function() {

                it('Добавить внешний конструктор', function() {
                    assert.equal(new Template('name', {
                        construct: function(bemjson, data) { /* jshint unused: false */
                            this.blockName = bemjson.block;
                        },
                        content: function() {
                            return this.blockName;
                        }
                    }).match({ block: 'name', index: true }).toString(),
                        '<div class="name">name</div>'
                    );
                });

            });

            describe('Функции-помощники.', function() {

                it('Проверить на первый элемент среди сестринских', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.isFirst();
                        }
                    }).match({
                            block: 'name'
                        }).toString(),
                        '<div class="name">true</div>'
                    );
                });

                it('Проверить на последний элемент среди сестринских', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.isLast();
                        }
                    }).match({
                            block: 'name'
                        }).toString(),
                        '<div class="name">true</div>'
                    );
                });

                it('Проверить на элемент', function() {
                    var template = new Template('name', 'name__elem', {
                        content: function() {
                            return this.isElem() + '!';
                        }
                    });
                    assert.equal(template.match({
                        block: 'name'
                    }).toString(),
                        '<div class="name">false!</div>'
                    );
                    assert.equal(template.match({
                        block: 'name',
                        elem: 'elem'
                    }).toString(),
                        '<div class="name__elem">true!</div>'
                    );
                });

                it('Проверить на блок', function() {
                    var template = new Template('name', 'name__elem', {
                        content: function() {
                            return this.isBlock() + '!';
                        }
                    });
                    assert.equal(template.match({
                        block: 'name'
                    }).toString(),
                        '<div class="name">true!</div>'
                    );
                    assert.equal(template.match({
                        block: 'name',
                        elem: 'elem'
                    }).toString(),
                        '<div class="name__elem">false!</div>'
                    );
                });

                it('Экранировать строку текста', function() {
                    assert.equal(new Template('name', {
                        attrs: function() {
                            return {
                                'data-escape': this.escape(this.bemjson.text)
                            };
                        }
                    }).match({
                            block: 'name',
                            text: '\\,\n\r\t\u2028\u2029'
                        }).toString(),
                        '<div class="name" data-escape="\\\\,\\n\\r\\t\\u2028\\u2029"></div>'
                    );
                });

                it('Разэкранировать строку текста', function() {
                    assert.equal(new Template('name', {
                        attrs: function() {
                            return {
                                'data-escape': this.unEscape(this.bemjson.text)
                            };
                        }
                    }).match({
                            block: 'name',
                            text: '\\\\,\\n\\r\\t\\u2028\\u2029'
                        }).toString(),
                        '<div class="name" data-escape="\\,\n\r\t\u2028\u2029"></div>'
                    );
                });

                it('Экранировать html-строку', function() {
                    assert.equal(new Template('name', {
                        options: { escape: false },
                        attrs: function() {
                            return {
                                'data-escape': this.htmlEscape(this.bemjson.text)
                            };
                        }
                    }).match({
                            block: 'name',
                            text: '&<>"\'\/'
                        }).toString(),
                        '<div class="name" data-escape="&amp;&lt;&gt;&quot;&#39;\/"></div>'
                    );
                });

                it('Разэкранировать html-строку', function() {
                    assert.equal(new Template('name', {
                        options: { escape: { attrs: false }},
                        attrs: function() {
                            return {
                                'data-escape': this.unHtmlEscape(this.bemjson.text)
                            };
                        },
                        content: '&'
                    }).match({
                            block: 'name',
                            text: '&amp;&lt;&gt;&quot;&#39;\/'
                        }).toString(),
                        '<div class="name" data-escape="&<>"\'\/">&amp;</div>'
                    );
                });

                it('Удалить повторяющиеся пробелы', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.collapse(this.bemjson.content);
                        }
                    }).match({
                            block: 'name',
                            content: 'Just   text  in    paragraph.'
                        }).toString(),
                        '<div class="name">Just text in paragraph.</div>'
                    );
                });

                it('Удалить HTML-теги', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.stripTags(this.bemjson.content);
                        }
                    }).match({
                            block: 'name',
                            content: '<p>Text and <a href="#">link</a>.</p>'
                        }).toString(),
                        '<div class="name">Text and link.</div>'
                    );
                });

                it('Перевести строку в верхний регистр', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.upper(this.bemjson.content);
                        }
                    }).match({
                            block: 'name',
                            content: 'abcd'
                        }).toString(),
                        '<div class="name">ABCD</div>'
                    );
                });

                it('Перевести строку в нижний регистр', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.lower(this.bemjson.content);
                        }
                    }).match({
                            block: 'name',
                            content: 'ABCD'
                        }).toString(),
                        '<div class="name">abcd</div>'
                    );
                });

                it('Повторить строку заданное количество раз с указанным разделителем', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.repeat(this.bemjson.content, 3, '+');
                        }
                    }).match({
                            block: 'name',
                            content: 'a'
                        }).toString(),
                        '<div class="name">a+a+a</div>'
                    );
                });

                it('Расширить объект', function() {
                    assert.equal(new Template('name', {
                        attrs: function(attrs) {
                            return this.extend(attrs, {
                                a: 2,
                                b: 3
                            });
                        }
                    }).match({
                            block: 'name',
                            attrs: { a: 1 }
                        }).toString(),
                        '<div class="name" a="2" b="3"></div>'
                    );
                });

                it('Получить тип данных содержимого', function() {
                    assert.equal(new Template('name', {
                        content: function(content) {
                            return this.is.type(content);
                        }
                    }).match({
                            block: 'name',
                            content: ['a', 'b']
                        }).toString(),
                        '<div class="name">array</div>'
                    );
                });

                it('Получить случайное число от 100 до 999 с шагом 2', function() {
                    new Template('name', {
                        content: function() {
                            var rand = this.random(100, 999, 2);
                            assert.isTrue(rand >= 100 && rand < 999 && rand % 2 === 0);
                        }
                    }).match({ block: 'name' });
                });

                it('Получить сформированный идентификатор', function() {
                    var template = new Template('name', {
                        js: false,
                        attrs: function() {
                            return { id: this.id() };
                        }
                    });
                    assert.equal(template.match({ block: 'name' }).toString(),
                        '<div class="name" id="i' + Helpers.idSalt + '0"></div>');
                    assert.equal(template.match({ block: 'name' }).toString(),
                        '<div class="name" id="i' + Helpers.idSalt + '1"></div>');
                });

                it('Получить сформированный идентификатор с кастомизированным префиксом', function() {
                    var template = new Template('name', {
                        js: false,
                        attrs: function() {
                            return { id: this.id('aaa') };
                        }
                    });
                    assert.equal(template.match({ block: 'name' }).toString(),
                        '<div class="name" id="aaa' + Helpers.idSalt + '2"></div>');
                    assert.equal(template.match({ block: 'name' }).toString(),
                        '<div class="name" id="aaa' + Helpers.idSalt + '3"></div>');
                });

                it('Добавление пользовательских функций-помощников', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.bang(this.sum(this.bemjson.content, 200));
                        }
                    })
                        .helper('sum', function(a, b) {
                            return a + b;
                        })
                        .helper('bang', function(str) {
                            return str + '!';
                        })
                        .match({
                            block: 'name',
                            content: 100
                        }).toString(),
                        '<div class="name">300!</div>'
                    );
                });

                it('Добавление сразу нескольких пользовательских функций-помощников', function() {
                    assert.equal(new Template('name', {
                        content: function() {
                            return this.bang(this.sum(this.bemjson.content, 200));
                        }
                    })
                        .helper({
                            sum: function(a, b) {
                                return a + b;
                            },
                            bang: function(str) {
                                return str + '!';
                            }
                        })
                        .match({
                            block: 'name',
                            content: 100
                        }).toString(),
                        '<div class="name">300!</div>'
                    );
                });

                it('Сохранение функций-помощников при разбивке шаблонов', function() {
                    assert.equal(new Template('a', 'b', {
                        content: function() {
                            return this.sum(this.bemjson.content, 200);
                        }
                    })
                        .split()[0]
                        .helper('sum', function(a, b) {
                            return a + b;
                        })
                        .match({
                            block: 'a',
                            content: 100
                        }).toString(),
                        '<div class="a">300</div>'
                    );
                });

            });

            describe('Входящий параметр в модах.', function() {

                it('Получение заданного содержимого', function() {
                    assert.equal(new Template('name', {
                        content: function(content) {
                            return content + '!';
                        }
                    }).match({ block: 'name', content: 'text' }).toString(),
                        '<div class="name">text!</div>'
                    );
                });

                it('Не указанное в bemjson поле', function() {
                    assert.equal(new Template('name', {
                        tag: function(tag) {
                            return tag + '';
                        }
                    }).match({ block: 'name' }).toString(),
                        '<undefined class="name"></undefined>'
                    );
                });

            });

            describe('Вес шаблона.', function() {

                it('Получить вес шаблона с одним селектором', function() {
                    assert.equal(new Template('name', {}).weight, new Selector('name').weight());
                });

                it('Получить вес шаблона с несколькими селекторами', function() {
                    assert.equal(new Template('name1', 'name2', {}).weight, null);
                });

            });

        });

    });
});
