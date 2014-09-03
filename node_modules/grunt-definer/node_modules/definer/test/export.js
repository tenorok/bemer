var assert = require('chai').assert,
    definer = require('../definer.js').definer;

describe('Метод экспорта данных.', function() {

    it('Модуль a', function() {
        var a = definer.export('a', function() { return 'a'; });
        assert.equal(a, 'a');
    });

});
