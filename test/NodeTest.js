definer('NodeTest', function(assert, Node) {
    describe('Модуль Node.', function() {

        it('Проверить узел на блок', function() {
            assert.isTrue(new Node({ block: 'name' }).isBlock());
            assert.isTrue(new Node({ block: 'name', js: true }).isBlock());
            assert.isFalse(new Node({ block: 'name', elem: 'elem' }).isBlock());
        });

        it('Проверить узел на элемент', function() {
            assert.isFalse(new Node({ block: 'name' }).isElem());
            assert.isTrue(new Node({ block: 'name', elem: 'elem' }).isElem());
        });

        it('Получить имя базовой БЭМ-сущности', function() {
            assert.equal(new Node({ block: 'name' }).getName().toString(), 'name');
            assert.equal(new Node({ block: 'name', mods: { a: 'b' }}).getName().toString(), 'name');
            assert.equal(new Node({ block: 'name', elem: 'e' }).getName().toString(), 'name__e');
            assert.equal(new Node({ block: 'name', elem: 'e', elemMods: { a: 'b' }}).getName().toString(), 'name__e');
        });

        it('Получить/установить контент', function() {
            assert.equal(new Node({ block: 'name' }).content(), '');
            assert.equal(new Node({ block: 'name' }).content('text').content(), 'text');
        });

        describe('Получить js-параметры узла.', function() {

            it('Блок без инициализации', function() {
                assert.deepEqual(new Node({ block: 'block1' }).getParams(), {});
            });

            it('Блок без параметров', function() {
                assert.deepEqual(new Node({ block: 'block1', js: true }).getParams(), { block1: {}});
            });

            it('Микс', function() {
                assert.deepEqual(new Node({
                    block: 'block1', js: { a: 100 },
                    mix: [{ block: 'block2', js: { b: 200 }}]
                }).getParams(), {
                    block1: { a: 100 },
                    block2: { b: 200 }
                });

                assert.deepEqual(new Node({
                    block: 'block1', js: { a: 100 },
                    mix: [{ block: 'block2', js: true }]
                }).getParams(), {
                    block1: { a: 100 },
                    block2: {}
                });
            });

            it('Микс у элемента', function() {
                assert.deepEqual(new Node({
                    block: 'block1', elem: 'elem1', js: { a: 100 },
                    mix: [
                        { block: 'block2', js: { b: 200, c: 300 }},
                        { block: 'block3', elem: 'elem3', js: { d: 400 }}
                    ]
                }).getParams(), {
                    block1__elem1: { a: 100 },
                    block2: { b: 200, c: 300 },
                    block3__elem3: { d: 400 }
                });
            });

            it('Микс c отменой инициализации', function() {
                assert.deepEqual(new Node({
                    block: 'block1', js: false,
                    mix: [{ block: 'block2', js: true }]
                }).getParams(), {
                    block2: {}
                });

                assert.deepEqual(new Node({
                    block: 'block1', js: false,
                    mix: [{ block: 'block2', js: { a: 100 }}]
                }).getParams(), {
                    block2: { a: 100 }
                });

                assert.deepEqual(new Node({
                    block: 'block1', js: true,
                    mix: [{ block: 'block2', js: false }]
                }).getParams(), {
                    block1: {}
                });
            });
        });

        describe('Получить список классов узла.', function() {

            it('Блок', function() {
                assert.deepEqual(new Node({ block: 'name' }).getClass(), ['name']);
                assert.deepEqual(new Node({ block: 'name', bem: false }).getClass(), []);
            });

            it('Блок с модификаторами', function() {
                assert.deepEqual(new Node({ block: 'name', mods: { size: 'm', theme: 'normal' }}).getClass(),
                    ['name', 'name_size_m', 'name_theme_normal']
                );
            });

            it('Блок с параметрами', function() {
                assert.deepEqual(new Node({ block: 'name', js: true }).getClass(), ['name', 'i-bem']);
                assert.deepEqual(new Node({ block: 'name', js: { a: 100 }}).getClass(), ['name', 'i-bem']);
            });

            it('Микс', function() {
                assert.deepEqual(new Node({
                    block: 'block1', js: false,
                    mix: [{ block: 'block2', js: true }]
                }).getClass(), ['block1', 'i-bem', 'block2']);
            });

            it('Элемент', function() {
                assert.deepEqual(new Node({ block: 'name', elem: 'element' }).getClass(), ['name__element']);
            });

            it('Элемент с модификатором у блока', function() {
                assert.deepEqual(new Node({ block: 'name', mods: { theme: 'normal' }, elem: 'elem' }).getClass(),
                    ['name_theme_normal__elem']
                );
            });

            it('Блок с модификатором элемента при отсутствии самого элемента', function() {
                assert.deepEqual(new Node({ block: 'name', elemMods: { elemtheme: 'normal' }}).getClass(), ['name']);
            });

            it('Элемент с модификатором', function() {
                assert.deepEqual(new Node({ block: 'name', elem: 'elem', elemMods: { elemtheme: 'normal' }}).getClass(),
                    ['name__elem', 'name__elem_elemtheme_normal']
                );
            });

            it('Микс', function() {
                assert.deepEqual(new Node({ block: 'b', mix: [{ block: 'b2' }] }).getClass(), ['b', 'b2']);
                assert.deepEqual(new Node({ block: 'block', elem: 'elem', mix: [
                    { block: 'block2', elem: 'elem2' },
                    { block: 'block3', mods: { size: 's' }}
                ] }).getClass(), ['block__elem', 'block2__elem2', 'block3', 'block3_size_s']);
            });

            it('Произвольные классы', function() {
                assert.deepEqual(new Node({ block: 'block', cls: 'cls1  cls2' }).getClass(), ['cls1', 'cls2', 'block']);
                assert.deepEqual(new Node({ block: 'block', bem: false, cls: 'c1 c2' }).getClass(), ['c1', 'c2']);
            });
        });

        it('Получить информацию о примиксованных сущностях', function() {
            assert.deepEqual(new Node({ block: 'a', mix: [{ block: 'b' }] }).getMix(), [
                { name: 'b', classes: ['b'], params: {}}
            ]);
            assert.deepEqual(new Node({ block: 'a', mix: [{ block: 'b', mods: { c: 'd' }}] }).getMix(), [
                { name: 'b', classes: ['b', 'b_c_d'], params: {}}
            ]);
            assert.deepEqual(new Node({ block: 'a', mix: [
                { block: 'b', elem: 'e', elemMods: { f: 'g', h: 'i' }, js: { a: 1, b: 2 }},
                { block: 'c', js: { c: 3 }}
            ] }).getMix(), [
                { name: 'b__e', classes: ['b__e', 'i-bem', 'b__e_f_g', 'b__e_h_i'], params: { b__e: { a: 1, b: 2 }}},
                { name: 'c', classes: ['c', 'i-bem'], params: { c: { c: 3 }}}
            ]);
        });

        describe('Получить строковое представление БЭМ-сущности.', function() {

            it('Блок', function() {
                assert.equal(new Node({ block: 'name' }).toString(), '<div class="name"></div>');
                assert.equal(new Node({ block: 'name', tag: 'span' }).toString(), '<span class="name"></span>');
                assert.equal(new Node({
                    block: 'name',
                    tag: 'input',
                    attrs: {
                        type: 'text',
                        placeholder: 'example'
                    }
                }).toString(), '<input class="name" type="text" placeholder="example"/>');
            });

            it('Блок с произвольными классами', function() {
                assert.equal(new Node({ block: 'name', cls: 'c1  c2' }).toString(), '<div class="c1 c2 name"></div>');
                assert.equal(new Node({ block: 'my', cls: 'a  b', bem: false }).toString(), '<div class="a b"></div>');
            });

            it('Блок с модификаторами', function() {
                assert.equal(new Node({ block: 'name', mods: { theme: 'normal', size: 's' }}).toString(),
                    '<div class="name name_theme_normal name_size_s"></div>'
                );
            });

            it('Блок с булевым модификатором', function() {
                assert.equal(new Node({ block: 'name', mods: { visible: true }}).toString(),
                    '<div class="name name_visible"></div>'
                );
                assert.equal(new Node({ block: 'name', mods: { visible: false }}).toString(),
                    '<div class="name"></div>'
                );
            });

            it('Блок с параметрами', function() {
                assert.equal(new Node({ block: 'name', js: true }).toString(),
                    '<div class="name i-bem" data-bem="{&quot;name&quot;:{}}"></div>'
                );
                assert.equal(new Node({ block: 'name', js: { a: 1 }}).toString(),
                    '<div class="name i-bem" data-bem="{&quot;name&quot;:{&quot;a&quot;:1}}"></div>'
                );
            });

            it('Микс', function() {
                assert.equal(new Node({ block: 'a', mix: [{ block: 'b' }] }).toString(), '<div class="a b"></div>');
                assert.equal(new Node({ block: 'a', mix: [{ block: 'b', js: true }] }).toString(),
                    '<div class="a i-bem b" data-bem="{&quot;b&quot;:{}}"></div>'
                );
            });

            it('Элемент', function() {
                assert.equal(new Node({ block: 'name', elem: 'el' }).toString(), '<div class="name__el"></div>');
            });

            it('Элемент с пустым списком модификаторов', function() {
                assert.equal(new Node({ block: 'name', elem: 'el', mods: {}}).toString(),
                    '<div class="name__el"></div>'
                );
            });

            it('Элемент с булевым модификатором', function() {
                assert.equal(new Node({ block: 'name', elem: 'element', elemMods: { visible: true }}).toString(),
                    '<div class="name__element name__element_visible"></div>'
                );
                assert.equal(new Node({ block: 'name', elem: 'element', elemMods: { visible: false }}).toString(),
                    '<div class="name__element"></div>'
                );
            });

            it('Элемент с модификатором у блока', function() {
                assert.equal(new Node({
                    block: 'name',
                    mods: { size: 's' },
                    elem: 'element'
                }).toString(),
                    '<div class="name_size_s__element"></div>'
                );
            });

            it('Элемент с несколькими модификаторами у блока', function() {
                assert.equal(new Node({
                    block: 'name',
                    mods: { size: 's', theme: 'dark' },
                    elem: 'element'
                }).toString(),
                    '<div class="name_size_s__element name_theme_dark__element"></div>'
                );
            });

            it('Элемент и блок с модификатором', function() {
                assert.equal(new Node({
                    block: 'name',
                    mods: { size: 's' },
                    elem: 'element',
                    elemMods: { theme: 'normal' }
                }).toString(),
                    '<div class="name_size_s__element name_size_s__element_theme_normal"></div>'
                );
            });

            it('Элемент с модификатором и с несколькими модификаторами у блока', function() {
                assert.equal(new Node({
                    block: 'name',
                    mods: { size: 's', theme: 'dark' },
                    elem: 'element',
                    elemMods: { state: true }
                }).toString(),
                    '<div class="name_size_s__element name_theme_dark__element ' +
                        'name_size_s__element_state name_theme_dark__element_state"></div>'
                );
            });

            it('Элемент с несколькими модификаторами и с несколькими модификаторами у блока', function() {
                assert.equal(new Node({
                    block: 'name',
                    mods: { size: 's', theme: 'dark' },
                    elem: 'element',
                    elemMods: { state: true, side: 'left' }
                }).toString(),
                    '<div class="name_size_s__element name_theme_dark__element ' +
                        'name_size_s__element_state name_size_s__element_side_left ' +
                        'name_theme_dark__element_state name_theme_dark__element_side_left"></div>'
                );
            });

            it('Блок с содержимым', function() {
                assert.equal(new Node({
                    block: 'name',
                    content: 'Параграф текста'
                }).toString(),
                    '<div class="name">Параграф текста</div>'
                );
            });

            it('Блок с вложенным блоком', function() {
                assert.equal(new Node({
                    block: 'name',
                    content: new Node({
                        block: 'inner',
                        content: 'Параграф текста'
                    })
                }).toString(),
                    '<div class="name"><div class="inner">Параграф текста</div></div>'
                );
            });

        });

    });
});
