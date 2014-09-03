var assert = require('chai').assert,
    Maker = require('../../maker.js');

describe('Тестирование метода isValidFilePostfix.', function() {

    it('Файл filename.js и постфикс js', function() {
        assert.isTrue(new Maker({ postfix: 'js' }).isValidFilePostfix('filename.js'));
    });

    it('Файл filename.js и постфикс css', function() {
        assert.isFalse(new Maker({ postfix: 'css' }).isValidFilePostfix('filename.js'));
    });

    it('Файл filename.js и постфикс module.js', function() {
        assert.isFalse(new Maker({ postfix: 'module.js' }).isValidFilePostfix('filename.js'));
    });

    it('Файл name.my.module.js и постфикс js', function() {
        assert.isTrue(new Maker({ postfix: 'js' }).isValidFilePostfix('name.my.module.js'));
    });

    it('Файл name.my.module.js и постфикс module.js', function() {
        assert.isTrue(new Maker({ postfix: 'module.js' }).isValidFilePostfix('name.my.module.js'));
    });

    it('Файл name.my.module.js и постфикс my.module.js', function() {
        assert.isTrue(new Maker({ postfix: 'my.module.js' }).isValidFilePostfix('name.my.module.js'));
    });

    it('Файл name.my.module.js и постфикс name.my.module.js', function() {
        assert.isFalse(new Maker({ postfix: 'name.my.module.js' }).isValidFilePostfix('name.my.module.js'));
    });

});
