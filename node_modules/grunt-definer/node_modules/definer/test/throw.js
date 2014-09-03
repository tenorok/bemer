var assert = require('chai').assert,
    definer = require('../definer.js').definer;

describe('Тест на выброс исключения при отсутствии модуля.', function() {

    it('На примере модуля b3', function() {
        assert.throw(function() { definer('b3', function(a3) {}) }, ReferenceError, 'module a3 is not defined');
        var a3 = definer('a3', function() {});
    });

});
