var path = require('path'),
    assert = require('chai').assert,
    Maker = require('../../maker.js');

describe('Тестирование метода openFiles.', function() {

    var directory = path.join(__dirname, 'clean/libs');

    function getFullPath(file) {
        return path.join(directory, file);
    }

    function getFileList() {
        return [
            getFullPath('jquery.js'),
            getFullPath('jquery.ui.js'),
            getFullPath('plugins/plugin.jquery.js'),
            getFullPath('underscore.js')
        ];
    }

    it('Проверка результирующего массива содержимого файлов', function(done) {

        var standardResult = "(function(global) { global.$ = 'jquery'; })(this);" +
            "(function(global) { global.$.ui = 'jquery.ui'; })(this);" +
            "(function(global) { global.$.plugin = 'jquery.plugin'; })(this);" +
            "(function(global) { global._ = 'underscore'; })(this);";

        new Maker({
            directory: directory,
            verbose: ['error']
        })
            .openFiles(getFileList())
            .then(function(content) {
                assert.equal(content.join(''), standardResult);
                done();
            }).done();
    });

    it('Проверка работы колбека', function(done) {

        var filesData = {};

        new Maker({
            directory: directory,
            verbose: ['error']
        })
            .openFiles(getFileList(), function(file, data) {
                filesData[file] = data;
            })
            .then(function() {
                assert.deepEqual(Object.keys(filesData).sort(), getFileList().sort());
                done();
            }).done();
    });

});
