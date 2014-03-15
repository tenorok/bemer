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

        it('Шаблонизировать блок и элемент с заменой тега', function() {
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

    });
});
