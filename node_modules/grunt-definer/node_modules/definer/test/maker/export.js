var path = require('path'),
    fs = require('fs'),
    vow = require('vow'),
    assert = require('chai').assert,
    Maker = require('../../maker.js'),
    helper = require('./helper.js');

describe('Тестирование функции экспорта.', function() {

    var savePromise = vow.promise(),
        saveFilePath = path.join(__dirname, 'modules/all.js');

    it('Сборка одного модуля z', function(done) {

        new Maker({
            directory: path.join(__dirname, 'modules2'),
            module: 'z',
            verbose: ['error']
        }).make(saveFilePath).then(function() {

                fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                    assert.equal(data, helper.getClosureStringExportModuleZ());
                    savePromise.fulfill();
                });

                done();
            }).done();
    });

    it('Сборка модуля z из зависимости', function(done) {

        new Maker({
            directory: path.join(__dirname, 'modules2'),
            module: 'y',
            verbose: ['error']
        }).make(saveFilePath).then(function() {

                fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                    assert.equal(data, helper.getClosureStringExportModuleY());
                    savePromise.fulfill();
                });

                done();
            }).done();
    });

    it('Сборка двух модулей с экспортом', function(done) {

        new Maker({
            directory: path.join(__dirname, 'modules2'),
            module: 'w',
            verbose: ['error']
        }).make(saveFilePath).then(function() {

                fs.readFile(saveFilePath, { encoding: 'UTF-8' }, function(err, data) {
                    assert.equal(data, helper.getClosureStringExportModuleW());
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
