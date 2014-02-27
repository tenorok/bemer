definer('NameTest', function(assert, Name) {
    describe('Модуль Name.', function() {

        it('Получить имя блока', function() {
            var entity = new Name('block');
            assert.equal(entity.info().block, 'block');
        });

        it('Задать/получить имя блока методом', function() {
            var entity = new Name();
            assert.equal(entity.block('block').block(), 'block');
        });

        it('Получить имя модификатора блока', function() {
            var entity = new Name('block_mod');
            assert.equal(entity.info().modName, 'mod');
        });

        it('Задать/получить имя модификатора блока методом', function() {
            var block = new Name().block('block').mod('mod');
            assert.equal(block.mod().name, 'mod');
            assert.equal(block.modName(), 'mod');
        });

        it('Получить имя и значение модификатора блока', function() {
            var entity = new Name('block_mod_val');
            assert.equal(entity.info().modName, 'mod');
            assert.equal(entity.info().modVal, 'val');
        });

        it('Задать/получить значение модификатора блока методом', function() {
            var block = new Name().block('block').mod('mod', 'val');
            assert.equal(block.mod().val, 'val');
            assert.equal(block.modVal(), 'val');
        });

        it('Получить имя элемента', function() {
            var entity = new Name('block__element');
            assert.equal(entity.info().elem, 'element');
        });

        it('Задать/получить имя элемента методом', function() {
            var block = new Name();
            assert.equal(block.block('block').elem('element').elem(), 'element');
        });

        it('Получить имя модификатора элемента', function() {
            var entity = new Name('block__element_elemMod');
            assert.equal(entity.info().elemModName, 'elemMod');
        });

        it('Задать/получить имя модификатора элемента методом', function() {
            var block = new Name().block('block').elem('element').elemMod('elemMod');
            assert.equal(block.elemMod().name, 'elemMod');
            assert.equal(block.elemModName(), 'elemMod');
        });

        it('Получить имя и значение модификатора элемента', function() {
            var entity = new Name('block__element_elemMod_elemVal');
            assert.equal(entity.info().elemModName, 'elemMod');
            assert.equal(entity.info().elemModVal, 'elemVal');
        });

        it('Задать/получить значение модификатора элемента методом', function() {
            var block = new Name().block('block').elem('element').elemMod('elemMod', 'elemVal');
            assert.equal(block.elemMod().val, 'elemVal');
            assert.equal(block.elemModVal(), 'elemVal');
        });

        it('Получить всю информацию о сущности', function() {
            var entity = new Name('block_mod_val__element_elemMod_elemVal');
            assert.deepEqual(entity.info(), {
                block: 'block',
                modName: 'mod',
                modVal: 'val',
                elem: 'element',
                elemModName: 'elemMod',
                elemModVal: 'elemVal'
            });
        });

    });
});
