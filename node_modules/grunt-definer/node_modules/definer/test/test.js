var assert = require('chai').assert,
    definer = require('../definer.js').definer;

describe('Простой тест работы модулей.', function() {

    it('Модуль a', function() {
        var a = definer('a', function() { return 'a'; });
        assert.equal(a, 'a');
    });

    it('Модуль b', function() {
        var b = definer('b', function(a) { return a + 'b'; });
        assert.equal(b, 'ab');
    });

    it('Модуль c', function() {
        var c = definer('c', function(a, b) { return a + b + 'c'; });
        assert.equal(c, 'aabc');
    });

    it('Модуль d', function() {
        var d = definer('d', function(c) { return c + '!'; });
        assert.equal(d, 'aabc!');
    });

});
