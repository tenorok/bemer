var path = require('path'),
    fs = require('fs'),
    vow = require('vow'),
    assert = require('chai').assert,
    Maker = require('../../maker.js'),
    helper = require('./helper.js');

describe('Тестирование сборки модулей.', function() {

    var savePromise = vow.promise(),
        saveFilePath = path.join(__dirname, 'modules/all.js');

    it('Сборка', function(done) {

        new Maker({
            directory: path.join(__dirname, 'modules'),
            verbose: ['error']
        }).make(saveFilePath).then(function() {

            fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                assert.equal(data, helper.getClosureString());
                savePromise.fulfill();
            });

            done();
        }).done();
    });

    after(function(done) {
        vow.all([savePromise, helper.unlink(saveFilePath)]).then(function() {
            done();
        });
    });

});
