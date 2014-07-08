definer('SelectorTest', function(assert, Selector) {
    describe('Модуль Selector.', function() {

        it('Получить имя блока', function() {
            var entity = new Selector('block');
            assert.equal(entity.info().block, 'block');
        });

        it('Задать/получить имя блока методом', function() {
            var entity = new Selector();
            assert.equal(entity.block('block').block(), 'block');
        });

        it('Получить имя модификатора блока', function() {
            var entity = new Selector('block_mod');
            assert.equal(entity.info().modName, 'mod');
        });

        it('Задать/получить имя модификатора блока методом', function() {
            var block = new Selector().block('block').mod('mod');
            assert.equal(block.mod().name, 'mod');
            assert.equal(block.modName(), 'mod');
        });

        it('Получить имя и значение модификатора блока', function() {
            var entity = new Selector('block_mod_val');
            assert.equal(entity.info().modName, 'mod');
            assert.equal(entity.info().modVal, 'val');
        });

        it('Задать/получить значение модификатора блока методом', function() {
            var block = new Selector().block('block').mod('mod', 'val');
            assert.equal(block.mod().val, 'val');
            assert.equal(block.modVal(), 'val');
        });

        it('Получить имя элемента', function() {
            var entity = new Selector('block__element');
            assert.equal(entity.info().elem, 'element');
        });

        it('Задать/получить имя элемента методом', function() {
            var block = new Selector();
            assert.equal(block.block('block').elem('element').elem(), 'element');
        });

        it('Получить имя модификатора элемента', function() {
            var entity = new Selector('block__element_elemMod');
            assert.equal(entity.info().elemModName, 'elemMod');
        });

        it('Задать/получить имя модификатора элемента методом', function() {
            var block = new Selector().block('block').elem('element').elemMod('elemMod');
            assert.equal(block.elemMod().name, 'elemMod');
            assert.equal(block.elemModName(), 'elemMod');
        });

        it('Получить имя и значение модификатора элемента', function() {
            var entity = new Selector('block__element_elemMod_elemVal');
            assert.equal(entity.info().elemModName, 'elemMod');
            assert.equal(entity.info().elemModVal, 'elemVal');
        });

        it('Задать/получить значение модификатора элемента методом', function() {
            var block = new Selector().block('block').elem('element').elemMod('elemMod', 'elemVal');
            assert.equal(block.elemMod().val, 'elemVal');
            assert.equal(block.elemModVal(), 'elemVal');
        });

        it('Получить всю информацию о сущности', function() {
            var entity = new Selector('block_mod_val__element_elemMod_elemVal');
            assert.deepEqual(entity.info(), {
                block: 'block',
                modName: 'mod',
                modVal: 'val',
                elem: 'element',
                elemModName: 'elemMod',
                elemModVal: 'elemVal'
            });
        });

        it('Проверить на блок', function() {
            assert.isTrue(new Selector('block').isBlock());
            assert.isTrue(new Selector('block_mod_val').isBlock());
            assert.isFalse(new Selector('block__elem').isBlock());
        });

        it('Проверить на элемент', function() {
            assert.isFalse(new Selector('block').isElem());
            assert.isFalse(new Selector('block_mod_val').isElem());
            assert.isTrue(new Selector('block__elem').isElem());
            assert.isTrue(new Selector('block__elem_mod_val').isElem());
        });

        describe('Произвольная работа с БЭМ-сущностью и преобразование в строку.', function() {

            it('Блок с модификатором', function() {
                var entity = new Selector('block_mod');
                assert.equal(entity.block(), 'block');
                assert.equal(entity.modName(), 'mod');
                assert.equal(entity.toString(), 'block_mod');
                assert.equal(entity.modVal('val').mod().val, 'val');
                assert.equal(entity.elem(), '');
                assert.equal(entity.elem('element').elem(), 'element');
                assert.equal(entity.elemModName('elemMod').elemMod().name, 'elemMod');
                assert.equal(entity.toString(), 'block_mod_val__element_elemMod');
            });

            it('Блок с модификатором и элементом с модификатором', function() {
                var entity2 = new Selector('block_mod__element_mod');
                assert.equal(entity2.elem(), 'element');
                assert.equal(entity2.elemMod('mod2').elemMod().name, 'mod2');
                assert.equal(entity2.elemMod('mod3', 'val3').elemMod().name, 'mod3');
                assert.equal(entity2.elemModVal(), 'val3');
                assert.equal(entity2.toString(), 'block_mod__element_mod3_val3');
            });

            it('Блок и элемент с назначением модификаторов методами', function() {
                assert.equal(new Selector('block').modVal('val').toString(), 'block');
                assert.equal(new Selector('block__element').elemModVal('val').toString(), 'block__element');
                assert.equal(new Selector().block('block').mod('mod', 'val').elemMod('fake').toString(), 'block_mod_val');
            });

            it('Установить булевы модификаторы', function() {
                assert.equal(new Selector().block('block').mod('mod', true).toString(), 'block_mod');
                assert.equal(new Selector().block('block').elem('elem').mod('mod', true).toString(), 'block_mod__elem');
                assert.equal(new Selector().block('block').elem('elem').elemMod('mod', true).toString(), 'block__elem_mod');
                assert.equal(new Selector().block('block').mod('vis', true).elem('elem').elemMod('mod', true).toString(),
                    'block_vis__elem_mod'
                );
            });

            it('Снять булевы модификаторы', function() {
                assert.equal(new Selector().block('block').mod('mod', false).toString(), 'block');
                assert.equal(new Selector().block('block').elem('elem').elemMod('mod', false).toString(), 'block__elem');
            });

            it('Пустое имя', function() {
                assert.equal(new Selector().toString(), '');
            });
        });

        describe('Вычисление веса селектора.', function() {

            it('Установить и получить вес селектора', function() {
                var selector = new Selector().weight(45);
                assert.equal(selector.weight(), 45);
            });

            it('block < block_mod', function() {
                assert.isTrue(new Selector('block').weight() < new Selector('block_mod').weight());
            });

            it('block_mod < block_mod_val', function() {
                assert.isTrue(new Selector('block_mod').weight() < new Selector('block_mod_val').weight());
            });

            it('block_mod_val < block__elem', function() {
                assert.isTrue(new Selector('block_mod_val').weight() < new Selector('block__elem').weight());
            });

            it('block__elem < block__elem_mod', function() {
                assert.isTrue(new Selector('block__elem').weight() < new Selector('block__elem_mod').weight());
            });

            it('block__elem_mod < block__elem_mod_val', function() {
                assert.isTrue(new Selector('block__elem_mod').weight() < new Selector('block__elem_mod_val').weight());
            });

            it('block_mod__elem < block_mod_val__elem', function() {
                assert.isTrue(new Selector('block_mod__elem').weight() < new Selector('block_mod_val__elem').weight());
            });

            it('block_mod_val__elem < block__elem_mod', function() {
                assert.isTrue(new Selector('block_mod_val__elem').weight() < new Selector('block__elem_mod').weight());
            });

            it('* < block', function() {
                assert.isTrue(new Selector('*').weight() < new Selector('block').weight());
            });

            it('block < block_*', function() {
                assert.isTrue(new Selector('block').weight() < new Selector('block_*').weight());
            });

            it('block_mod = block_*_*', function() {
                assert.isTrue(new Selector('block_mod').weight() === new Selector('block_*_*').weight());
            });

            it('block_mod_val < block__*', function() {
                assert.isTrue(new Selector('block_mod_val').weight() < new Selector('block__*').weight());
            });

            it('*_mod_val < *__*', function() {
                assert.isTrue(new Selector('*_mod_val').weight() < new Selector('*__*').weight());
            });

            it('block_*_val < block_*__elem', function() {
                assert.isTrue(new Selector('block_*_val').weight() < new Selector('block_*__elem').weight());
            });

        });

    });
});
