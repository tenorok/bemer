var path = require('path'),
    assert = require('chai').assert,
    helper = require('./helper.js'),
    Maker = require('../../maker.js');

describe('Тестирование правильного формирования опций с конфигурационным файлом.', function() {

    var cli = new helper.testCLI('./bin/definer -v e -d test/maker/modules/').setTarget('test/maker/modules/all.js');

    it('Сборщик должен автоматически применять файл definer.json, лежащий в той же директории', function(done) {
        cli.changeCWD(path.join(__dirname, 'clean'), {
            bin: '../../../bin/definer -v e -d ../modules/',
            target: 'all.js'
        }, function() {
            return this.exec('', helper.getClosureStringModuleC());
        }, done);
    });

    it('Модуль C указан в конфигурационном файле', function(done) {
        cli.exec('-c test/maker/clean/definer.json', helper.getClosureStringModuleC(), done);
    });

    it('Модуль C указан в команде и переопределяет модуль A, указанный в конфигурационном файле', function(done) {
        cli.exec('-c test/maker/clean/modulea.json -m c', helper.getClosureStringModuleC(), done);
    });

    after(function(done) {
        cli.unlinkAfterExec(done);
    });

});
