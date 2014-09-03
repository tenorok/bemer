var path = require('path'),
    assert = require('chai').assert,
    Maker = require('../../maker.js');

describe('Тестирование метода getModuleListToModule. Получение списка модулей, необходимых для работы:', function() {

    it('модуля B', function(done) {
        new Maker({
            directory: path.join(__dirname, 'modules'),
            module: 'b',
            verbose: ['error']
        }).getModuleListToModule().then(function(modules) {

            assert.deepEqual(Object.keys(modules).sort(), ['a', 'b']);

            done();
        }).done();
    });

    it('модуля C', function(done) {
        new Maker({
            directory: path.join(__dirname, 'modules'),
            module: 'c',
            verbose: ['error']
        }).getModuleListToModule().then(function(modules) {

                assert.deepEqual(Object.keys(modules).sort(), ['a', 'b', 'c']);

                done();
            }).done();
    });

    it('модуля A', function(done) {
        new Maker({
            directory: path.join(__dirname, 'modules'),
            module: 'a',
            verbose: ['error']
        }).getModuleListToModule().then(function(modules) {

                assert.deepEqual(Object.keys(modules).sort(), ['a']);

                done();
            }).done();
    });

    it('модуля E', function(done) {
        new Maker({
            directory: path.join(__dirname, 'modules'),
            module: 'e',
            verbose: ['error']
        }).getModuleListToModule().then(function(modules) {

                assert.deepEqual(Object.keys(modules).sort(), ['a', 'b', 'c', 'd', 'e']);

                done();
            }).done();
    });

});
