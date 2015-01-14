describe('tabs.', function() {

    describe('HTML.', function() {

        describe('tabs.', function() {

            it('Тег', function() {
                assert.equal($(bemer({ block: 'tabs', items: [] }))[0].tagName, 'UL');
            });

        });

        describe('__item.', function() {

            var items = $(bemer({
                block: 'tabs',
                name: 'colors',
                items: [
                    { value: 'red', content: 'красный' },
                    { value: 'blue', content: 'синий', checked: true }
                ]
            })).children('.tabs__item');

            it('Тег', function() {
                assert.equal(items[0].tagName, 'LI');
            });

            describe('_checked', function() {

                it('Наличие модификатора', function() {
                    assert.isTrue(items.eq(1).hasClass('tabs__item_checked'));
                });

            });

            describe('__label.', function() {

                it('Тег', function() {
                    assert.equal(items.children('.tabs__label')[0].tagName, 'LABEL');
                });

                describe('__control.', function() {
                    var control = items.children('.tabs__label').children('.tabs__control');

                    it('Тег', function() {
                        assert.equal(control[0].tagName, 'INPUT');
                    });

                    it('Атрибут type', function() {
                        assert.equal(control.attr('type'), 'radio');
                    });

                    it('Атрибут name', function() {
                        assert.equal(control.attr('name'), 'colors');
                    });

                    it('Атрибут value', function() {
                        assert.equal(control.eq(0).attr('value'), 'red');
                        assert.equal(control.eq(1).attr('value'), 'blue');
                    });

                    it('Атрибут checked', function() {
                        assert.isUndefined(control.eq(0).attr('checked'));
                        assert.equal(control.eq(1).attr('checked'), 'checked');

                        assert.isFalse(control.eq(0).prop('checked'));
                        assert.isTrue(control.eq(1).prop('checked'));
                    });

                    describe('Без полей name и value.', function() {
                        var control = $(bemer({
                            block: 'tabs',
                            items: [
                                { content: 'красный' },
                                { content: 'синий' }
                            ]
                        })).children('.tabs__item').children('.tabs__label').children('.tabs__control');

                        it('Атрибут name должен существовать', function() {
                            assert.isDefined(control.attr('name'));
                        });

                        it('Атрибуты name обоих табов должны быть идентичны', function() {
                            assert.isTrue(control.eq(0).attr('name') === control.eq(1).attr('name'));
                        });

                        it('Атрибут value должен отсутствовать', function() {
                            assert.isUndefined(control.attr('value'));
                        });
                    });

                });

                describe('__text.', function() {
                    var text = items.children('.tabs__label').children('.tabs__text');

                    it('Тег', function() {
                        assert.equal(text[0].tagName, 'SPAN');
                    });

                    it('Содержимое', function() {
                        assert.equal(text.eq(0).text(), 'красный');
                        assert.equal(text.eq(1).text(), 'синий');
                    });

                });

            });

        });

    });

    describe('Методы и события.', function() {
        var tabs,
            precheckedTabs;

        beforeEach(function() {
            tabs = BEM.DOM.append(BEM.DOM.scope, bemer({
                block: 'tabs',
                name: 'shapes',
                items: [
                    { value: 'circle', content: 'круг' },
                    { value: 'square', content: 'квадрат' }
                ]
            })).bem('tabs');

            precheckedTabs = BEM.DOM.append(BEM.DOM.scope, bemer({
                block: 'tabs',
                name: 'shapes',
                items: [
                    { value: 'circle', content: 'круг' },
                    { value: 'square', content: 'квадрат', checked: true }
                ]
            })).bem('tabs');
        });

        afterEach(function() {
            BEM.DOM.destruct(tabs.domElem);
            BEM.DOM.destruct(precheckedTabs.domElem);
        });

        describe('Метод val.', function() {

            it('Получить значение табов', function() {
                assert.isUndefined(tabs.val());
                assert.equal(precheckedTabs.val(), 'square');
            });

            it('Установить несуществующее значение', function() {
                assert.isUndefined(tabs.val('foo').val());
                assert.isFalse(tabs.elem('item').eq(0).hasClass('tabs__item_checked'));
                assert.isFalse(tabs.elem('item').eq(1).hasClass('tabs__item_checked'));
            });

            it('Установить значение табам', function() {
                assert.equal(tabs.val('circle').val(), 'circle');
                assert.isTrue(tabs.elem('item').eq(0).hasClass('tabs__item_checked'));
                assert.isFalse(tabs.elem('item').eq(1).hasClass('tabs__item_checked'));
            });

            it('Изменить значение предустановленных табов', function() {
                assert.equal(precheckedTabs.val('circle').val(), 'circle');
                assert.isTrue(precheckedTabs.elem('item').eq(0).hasClass('tabs__item_checked'));
                assert.isFalse(precheckedTabs.elem('item').eq(1).hasClass('tabs__item_checked'));
            });

        });

        describe('Метод reset.', function() {

            it('Сброс выделенных табов', function() {
                assert.equal(precheckedTabs.val(), 'square');
                assert.deepEqual(precheckedTabs.reset(), precheckedTabs);
                assert.isUndefined(precheckedTabs.val());

                var control = precheckedTabs.elem('control');
                assert.isUndefined(control.attr('checked'));
                assert.isFalse(control.prop('checked'));

                assert.isFalse(precheckedTabs.elem('item').hasClass('tabs__item_checked'));
            });

        });

        describe('Событие change.', function() {

            it('При установке несуществующего значения событие не должно возникать', function(done) {
                tabs.on('change', function() {
                    throw new Error('Event change should not be triggered.');
                });

                tabs.val('foo');
                setTimeout(done, 10);
            });

            it('Инициирование события change методом val', function(done) {
                tabs.on('change', function(e, data) {
                    assert.deepEqual(data, {
                        value: 'square',
                        item: tabs.elem('item').eq(1)
                    });
                    done();
                });

                tabs.val('square');
            });

            it('Инициирование события change кликом мыши', function(done) {
                tabs.on('change', function(e, data) {
                    var item = tabs.elem('item').eq(0);

                    assert.deepEqual(data, {
                        value: 'circle',
                        item: item
                    });
                    assert.equal(tabs.val(), 'circle');
                    assert.isTrue(item.hasClass('tabs__item_checked'));
                    done();
                });

                simulant.fire(tabs.elem('label').eq(0)[0], 'click');
            });

        });

    });

});
