definer('TemplateTest', function(assert, Template) {
    describe('Модуль Template.', function() {

        it('Шаблонизировать простой блок', function() {
            assert.equal(new Template('name', {}).match({ block: 'name' }).toString(),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
            assert.isNull(new Template('name', {}).match({ block: 'name2' }));
        });

        it('Шаблонизировать элемент', function() {
            assert.equal(new Template('name__element', {}).match({
                block: 'name',
                elem: 'element'
            }).toString(), '<div class="name__element i-bem" data-bem="{&quot;name__element&quot;:{}}"></div>');
            assert.isNull(new Template('name__element2', {}).match({ block: 'name', elem: 'element' }));
        });

        it('Шаблонизировать блок с заменой тега', function() {
            assert.equal(new Template('name', {
                tag: 'span'
            }).match({ block: 'name' }).toString(),
                '<span class="name i-bem" data-bem="{&quot;name&quot;:{}}"></span>'
            );
        });

        it('Шаблонизировать элемент с заменой тега', function() {
            assert.equal(new Template('my__*', {
                tag: function() { return 'img'; }
            }).match({ block: 'my', elem: 'image' }).toString(),
                '<img class="my__image i-bem" data-bem="{&quot;my__image&quot;:{}}"/>'
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
                '<img class="picture i-bem" alt="image" src="1.png" data-bem="{&quot;picture&quot;:{}}"/>'
            );
        });

        it('Добавить миксов', function() {
            assert.equal(new Template('picture', {
                tag: 'img',
                mix: [{ block: 'image', js: true }]
            }).match({ block: 'picture', mix: [{ block: 'link' }] }).toString(),
                '<img class="picture i-bem link image" data-bem="{&quot;picture&quot;:{},&quot;image&quot;:{}}"/>'
            );
        });

        it('Шаблонизировать с произвольными классами', function() {
            assert.equal(new Template('name', {
                cls: 'my1 my2'
            }).match({ block: 'name' }).toString(),
                '<div class="my1 my2 name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Шаблонизировать с добавлением модификаторов', function() {
            assert.equal(new Template('name', {
                mods: { theme: 'normal' },
                elemMods: { fake: true }
            }).match({ block: 'name' }).toString(),
                '<div class="name i-bem name_theme_normal" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Шаблонизировать с наследованием модификаторов', function() {
            assert.equal(new Template('name_size_s', {
                mods: { theme: 'normal' }
            }).match({ block: 'name', mods: { size: 's' }}).toString(),
                '<div class="name i-bem name_theme_normal name_size_s" data-bem="{&quot;name&quot;:{}}"></div>'
            );
            assert.equal(new Template('name_size_s', {
                mods: { theme: 'normal' }
            }).match({ block: 'name', mods: { size: 's', theme: 'dark' }}).toString(),
                '<div class="name i-bem name_theme_dark name_size_s" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        it('Шаблонизировать с добавлением модификаторов элементу', function() {
            assert.equal(new Template('name__elem', {
                elemMods: { checked: true }
            }).match({ block: 'name', elem: 'elem' }).toString(),
                '<div class="name__elem i-bem name__elem_checked" data-bem="{&quot;name__elem&quot;:{}}"></div>'
            );
        });

        it('Установить блоку содержимое', function() {
            assert.equal(new Template('name', {
                content: '>>Заэкранированный текст<<'
            }).match({ block: 'name' }).toString(),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}">&gt;&gt;Заэкранированный текст&lt;&lt;</div>'
            );
            assert.equal(new Template('name', {
                content: ['первый', ' и ', 'второй']
            }).match({ block: 'name' }).toString(),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}">первый и второй</div>'
            );
            assert.equal(new Template('name', {
                content: ['один']
            }).match({ block: 'name', content: 'два' }).toString(),
                '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}">два</div>'
            );
        });

        it('Использовать конструктор и кастомную моду', function() {
            assert.equal(new Template('name', {
                __constructor: function(bemjson) {
                    this.bemjson = bemjson;
                },
                isIndex: function() {
                    return this.bemjson.index;
                },
                mods: function() {
                    if(this.isIndex()) {
                        return { theme: 'normal' };
                    }
                }
            }).match({ block: 'name', index: true }).toString(),
                '<div class="name i-bem name_theme_normal" data-bem="{&quot;name&quot;:{}}"></div>'
            );
        });

        describe('Несколько селекторов.', function() {

            it('Несколько блоков', function() {
                assert.equal(new Template('name1', 'name2', 'name3', {}).match({ block: 'name2' }).toString(),
                    '<div class="name2 i-bem" data-bem="{&quot;name2&quot;:{}}"></div>'
                );
                assert.isNull(new Template('name1', 'name2', 'name3', {}).match({ block: 'name4' }));
            });

            it('Блоки с модификаторами', function() {
                assert.equal(new Template('name1', 'name2_mod_val', 'name3', {}).match(
                    { block: 'name2', mods: { mod: 'val' }}
                ).toString(),
                    '<div class="name2 i-bem name2_mod_val" data-bem="{&quot;name2&quot;:{}}"></div>'
                );
            });

            it('Элементы', function() {
                assert.equal(new Template('block', 'block__elem', 'block__elem2', {}).match(
                    { block: 'block', elem: 'elem2' }
                ).toString(),
                    '<div class="block__elem2 i-bem" data-bem="{&quot;block__elem2&quot;:{}}"></div>'
                );
            });

        });

        describe('Наследование шаблонов.', function() {

            it('Одиночное наследование', function() {
                assert.equal(new Template('parent', { mods: function() { return { a: 1 }; }})
                    .extend(new Template('child', { mods: function() { return { a: this.__base().a, b: 2 }; }}))
                    .match({ block: 'child' }).toString(),
                    '<div class="child i-bem child_a_1 child_b_2" data-bem="{&quot;child&quot;:{}}"></div>'
                );
            });

            it('Цепочка наследований', function() {
                assert.equal(new Template('grand', { js: false, mods: function() { return { a: 1 }; }})
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

            it('Блок', function() {
                assert.equal(Template.base({ block: 'a' }).toString(),
                    '<div class="a i-bem" data-bem="{&quot;a&quot;:{}}"></div>'
                );
            });

            it('Блок с модификатором', function() {
                assert.equal(Template.base({ block: 'a', mods: { b: 'c' }}).toString(),
                    '<div class="a i-bem a_b_c" data-bem="{&quot;a&quot;:{}}"></div>'
                );
            });

            it('Элемент', function() {
                assert.equal(Template.base({ block: 'a', elem: 'b' }).toString(),
                    '<div class="a__b i-bem" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

            it('Элемент с модификатором', function() {
                assert.equal(Template.base({ block: 'a', elem: 'b', elemMods: { c: 'd' }}).toString(),
                    '<div class="a__b i-bem a__b_c_d" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

            it('Блок с модификатором и элементом', function() {
                assert.equal(Template.base({ block: 'a', mods: { c: 'd' }, elem: 'b' }).toString(),
                    '<div class="i-bem a_c_d__b" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

            it('Блок с модификатором и элемент с модификатором', function() {
                assert.equal(Template.base({ block: 'a', mods: { c: 'd' }, elem: 'b', elemMods: { e: 'f' }}).toString(),
                    '<div class="i-bem a_c_d__b a_c_d__b_e_f" data-bem="{&quot;a__b&quot;:{}}"></div>'
                );
            });

        });

    });
});
