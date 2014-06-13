describe('i-component.', function() {

    var component;

    beforeEach(function() {
        component = BEM.blocks['i-component'].create({
            block: 'i-component',
            content: {
                elem: 'control',
                tag: 'input',
                attrs: { type: 'text' }
            }
        });
        component.domElem.appendTo('body');
    });

    afterEach(function() {
        BEM.DOM.destruct(component.domElem);
    });

    describe('Модификатор focus.', function() {

        it('Беспрепятственная установка модификатора', function() {
            assert.isTrue(component.setMod('focus', true).hasMod('focus'));
        });

        it('Должен устанавливаться при получении настоящего фокуса', function() {
            component.elem('control').focus();
            assert.isTrue(component.hasMod('focus'));
        });

        it('Должен сбрасываться при потере настоящего фокуса', function() {
            component.elem('control').focus().blur();
            assert.isFalse(component.hasMod('focus'));
        });

    });

    describe('Модификатор disabled.', function() {

        it('При заблокированном компоненте не должен устанавливаться модификатор focus', function() {
            assert.isFalse(component.setMod('disabled', true).setMod('focus', true).hasMod('focus'));
        });

        it('Должен сбросить модификатор focus при установке модификатора disabled', function() {
            assert.isFalse(component.setMod('focus', true).setMod('disabled', true).hasMod('focus'));
        });

    });

});
