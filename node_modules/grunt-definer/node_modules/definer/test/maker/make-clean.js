var path = require('path'),
    assert = require('chai').assert,
    helper = require('./helper.js'),
    Maker = require('../../maker.js');

describe('Тестирование сборки clean-скриптов в один файл.', function() {

    var cli = new helper.testCLI('./bin/definer -v e -d test/maker/clean/').setTarget('test/maker/clean/all.js');

    it('Сборка всех модулей', function(done) {
        cli.exec('-c test/maker/clean/clean.json', helper.getClosureStringMakeCleanFiles(), done);
    });

    it('Сборка модуля C', function(done) {
        cli.exec('-c test/maker/clean/clean.json -m c', helper.getClosureStringMakeCleanFilesModuleC(), done);
    });

    after(function(done) {
        cli.unlinkAfterExec(done);
    });

});
