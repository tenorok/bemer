describe('i-control.', function() {

    describe('Метод getControl.', function() {

        it('Получить контрол', function() {
            var control = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            }).getControl();

            assert.isTrue(control instanceof jQuery);
            assert.equal(control.length, 1);
        });

        it('Получить примиксованный контрол', function() {
            var control = BEM.blocks['i-control'].create({
                block: 'i-control',
                mix: [{ block: 'i-control', elem: 'control' }]
            }).getControl();

            assert.isTrue(control instanceof jQuery);
            assert.equal(control.length, 1);
        });

    });

    describe('Метод name.', function() {

        it('Получить имя контрола', function() {
            var name = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control', attrs: { name: 'login' }}
            }).name();

            assert.equal(name, 'login');
        });

        it('Установить имя контрола', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            }).name('login');

            assert.isTrue(block instanceof BEM.DOM);
            assert.equal(block.elem('control').attr('name'), 'login');
        });

        it('Получить имена нескольких контролов', function() {
            var name = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: [
                    { elem: 'control', attrs: { name: 'login' }},
                    { elem: 'control', attrs: { name: 'password' }}
                ]
            }).name();

            assert.deepEqual(name, ['login', 'password']);
        });

        it('Установить несколько имён нескольких контролов', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: [
                    { elem: 'control' },
                    { elem: 'control' },
                    { elem: 'control' }
                ]
            }).name(['login', 'password']);

            assert.equal($(block.elem('control')[0]).attr('name'), 'login');
            assert.equal($(block.elem('control')[1]).attr('name'), 'password');
            assert.equal($(block.elem('control')[2]).attr('name'), '');
        });

        it('Установить несколько имён одному контролу', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            }).name(['login', 'password']);

            assert.equal(block.elem('control').attr('name'), 'login');
        });

        it('Установить одно имя нескольким контролам', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: [
                    { elem: 'control' },
                    { elem: 'control' }
                ]
            }).name('data');

            assert.isTrue(block instanceof BEM.DOM);
            assert.equal($(block.elem('control')[0]).attr('name'), 'data[]');
            assert.equal($(block.elem('control')[1]).attr('name'), 'data[]');
        });

    });

    describe('Метод val.', function() {

        it('Получить значение контрола', function() {
            var value = getControl(['login']).val();

            assert.equal(value, 'login');
        });

        it('Установить значение контрола', function() {
            var block = getControl(['']).val('login');

            assert.isTrue(block instanceof BEM.DOM);
            assert.equal(block.elem('control').val(), 'login');
        });

        it('Получить значение нескольких контролов', function() {
            var value = getControl(['login', 'password']).val();

            assert.deepEqual(value, ['login', 'password']);
        });

        it('Установить несколько значений нескольких контролов', function() {
            var block = getControl(['', '', '']).val(['login', 'password']);

            assert.equal($(block.elem('control')[0]).val(), 'login');
            assert.equal($(block.elem('control')[1]).val(), 'password');
            assert.equal($(block.elem('control')[2]).val(), '');
        });

        it('Установить значение нескольких контролов', function() {
            var block = getControl(['', '']).val('data');

            assert.isTrue(block instanceof BEM.DOM);
            assert.equal($(block.elem('control')[0]).val(), 'data');
            assert.equal($(block.elem('control')[1]).val(), 'data');
        });

    });

    describe('Событие change.', function() {

        it('Возникновение события change', function(done) {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            });

            block.on('change', function() {
                assert.equal(this.val(), 'data');
                done();
            });

            block.val('data');
        });

        it('Возникновение события change с дополнительными данными', function(done) {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            });

            block.on('change', function(e, data) {
                assert.equal(data.target, 'blank');
                done();
            });

            block.val('data', { target: 'blank' });
        });

        it('Возникновение события change при изменении значения одного из нескольких контролов', function(done) {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: [
                    { elem: 'control', attrs: { value: 'login' }},
                    { elem: 'control', attrs: { value: 'password' }}
                ]
            });

            block.on('change', function() {
                assert.deepEqual(this.val(), ['login', 'login']);
                done();
            });

            block.val('login');
        });

        it('При повторной установке значения событие change не должно инициироваться', function(done) {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            });

            block.on('change', function(e, data) {
                if(data.i === 0) {
                    assert.equal(this.val(), 'data');
                } else if(data.i === 1) {
                    assert.fail('Повторное инициирование change');
                } else if(data.i === 2) {
                    done();
                }
            });

            block
                .val('data', { i: 0 })
                .val('data', { i: 1 })
                .val('other', { i: 2 });
        });

        it('Использование метода jquery.val', function(done) {
            var block = getControl(['']);

            block.on('change', function() {
                assert.equal(this.val(), 'data');
                done();
            });

            block.elem('control').val('data').trigger('change');
        });

    });

    describe('Модификатор disabled.', function() {

        it('Установить модификатор disabled', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: { elem: 'control' }
            });

            assert.isUndefined(block.getControl().prop('disabled'));
            block.setMod('disabled', true);
            assert.isTrue(block.getControl().prop('disabled'));
            block.setMod('disabled', false);
            assert.isFalse(block.getControl().prop('disabled'));
        });

        it('Установить модификатор disabled для нескольких контролов', function() {
            var block = BEM.blocks['i-control'].create({
                block: 'i-control',
                content: [
                    { elem: 'control', attrs: { value: 'login' }},
                    { elem: 'control', attrs: { value: 'password' }}
                ]
            }).setMod('disabled', true);

            block.getControl().each(function() {
                assert.isTrue($(this).prop('disabled'));
            });
        });

    });

    function getControl(values) {
        var control = BEM.blocks['i-control'].create({
            block: 'i-control',
            content: values.reduce(function(inputs, value) {
                inputs.push({
                    elem: 'control',
                    tag: 'input',
                    type: 'text',
                    attrs: { value: value }
                });
                return inputs;
            }, [])
        });
        control.domElem.appendTo('body');
        return control;
    }

});
