var path = require('path'),
    assert = require('chai').assert,
    Maker = require('../../maker.js'),
    helper = require('./helper.js');

describe('Конвертирование модулей в строку без define.', function() {

    it('Конвертирование модулей с файловой системы', function(done) {

        var maker = new Maker({
            directory: path.join(__dirname, 'modules'),
            verbose: ['error']
        });

        maker.getModules().then(function() {

            assert.deepEqual(
                maker.convertToClosure(),
                helper.getClosureString()
            );

            done();
        }).done();
    });

});
