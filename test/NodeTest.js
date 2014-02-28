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

        it('Получить список классов узла', function() {
            assert.deepEqual(new Node({ block: 'name' }).getClass(), ['name']);
            assert.deepEqual(new Node({ block: 'name', bem: false }).getClass(), []);
            assert.deepEqual(new Node({ block: 'name', js: true }).getClass(), ['name', 'i-bem']);
            assert.deepEqual(new Node({ block: 'name', js: { a: 100 }}).getClass(), ['name', 'i-bem']);
            assert.deepEqual(new Node({ block: 'name', elem: 'element' }).getClass(), ['name__element']);
            assert.deepEqual(new Node({ block: 'name', mods: { size: 'm', theme: 'normal' }}).getClass(),
                ['name', 'name_size_m', 'name_theme_normal']
            );
            assert.deepEqual(new Node({ block: 'name', elem: 'elem', mods: { theme: 'normal' }}).getClass(),
                ['name__elem', 'name_theme_normal__elem']
            );
            assert.deepEqual(new Node({ block: 'name', elemMods: { elemtheme: 'normal' }}).getClass(), ['name']);
            assert.deepEqual(new Node({ block: 'name', elem: 'elem', elemMods: { elemtheme: 'normal' }}).getClass(),
                ['name__elem', 'name__elem_elemtheme_normal']
            );
            assert.deepEqual(new Node({ block: 'block', mix: [{ block: 'block2' }] }).getClass(), ['block', 'block2']);
            assert.deepEqual(new Node({ block: 'block', elem: 'elem', mix: [
                { block: 'block2', elem: 'elem2' },
                { block: 'block3', mods: { size: 's' }}
            ] }).getClass(), ['block__elem', 'block2__elem2', 'block3', 'block3_size_s']);

            assert.deepEqual(new Node({ block: 'block', cls: 'cls1  cls2' }).getClass(), ['cls1', 'cls2', 'block']);
            assert.deepEqual(new Node({ block: 'block', bem: false, cls: 'cls1 cls2' }).getClass(), ['cls1', 'cls2']);
        });

        it('Получить js-параметры узла', function() {
            assert.deepEqual(new Node({
                block: 'block1', js: { a: 100 },
                mix: [{ block: 'block2', js: { b: 200 }}]
            }).getParams(), {
                block1: { a: 100 },
                block2: { b: 200 }
            });

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

    });
});
