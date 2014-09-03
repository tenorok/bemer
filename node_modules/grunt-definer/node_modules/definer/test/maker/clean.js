var path = require('path'),
    fs = require('fs'),
    vow = require('vow'),
    assert = require('chai').assert,
    Maker = require('../../maker.js'),
    helper = require('./helper.js');

describe('Тестирование сборки с глобальными переменными.', function() {

    var savePromise = vow.promise(),
        saveFilePath = path.join(__dirname, 'clean/all.js');

    it('Сборка всех модулей', function(done) {

        new Maker({
            directory: path.join(__dirname, 'clean'),
            verbose: ['error']
        }).make(saveFilePath).then(function() {

            fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                assert.equal(data, helper.getClosureStringClean());
                savePromise.fulfill();
            });

            done();
        }).done();
    });

    it('Сборка модуля C', function(done) {

        new Maker({
            directory: path.join(__dirname, 'clean'),
            module: 'c',
            verbose: ['error']
        }).make(saveFilePath).then(function() {

            fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                assert.equal(data, helper.getClosureStringCleanModuleC());
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
