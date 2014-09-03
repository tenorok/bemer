var helper = require('./helper.js');

describe('Тестирование CLI.', function() {

    var cli = new helper.testCLI('./bin/definer -v e ').setTarget('test/maker/modules/all.js');

    it('Все модули', function(done) {
        cli.exec('-d test/maker/modules/', helper.getClosureString(), done);
    });

    it('Только модуль c', function(done) {
        cli.exec('-d test/maker/modules/ -m c', helper.getClosureStringModuleC(), done);
    });

    it('Только модуль x', function(done) {
        cli.exec('-d test/maker/modules/,test/maker/modules2/ -m x', helper.getClosureStringModuleX(), done);
    });

    after(function(done) {
        cli.unlinkAfterExec(done);
    });

});
