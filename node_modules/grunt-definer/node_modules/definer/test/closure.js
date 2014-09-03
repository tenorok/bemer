var assert = require('chai').assert,
    definer = require('../definer.js').definer;

describe('Тест работы модулей с замыканиями.', function() {

    it('Модуль a2', function() {
        var a2 = definer('a2', function() {
            function getA() { return 1; }
            function getB() { return 2; }
            return function(c) { return getA() + getB() + (c || 0) };
        });
        assert.equal(a2(), 3);
        assert.equal(a2(2), 5);
    });

    it('Модуль b2', function() {
        var b2 = definer('b2', function() {
            function getT() { return true; }
            function getF() { return false; }
            return { getT: getT, f: getF() };
        });
        assert.equal(b2.getT(), true);
        assert.equal(b2.f, false);
    });

    it('Модуль c2', function() {
        var c2 = definer('c2', function(a2, b2) {
            return [
                a2(2) + 2,
                b2.getT(),
                !b2.f
            ];
        });
        assert.deepEqual(c2, [7, true, true]);
    });

});
