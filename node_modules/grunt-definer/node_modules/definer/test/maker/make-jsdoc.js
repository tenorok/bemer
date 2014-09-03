var helper = require('./helper.js');

describe('Тестирование сборки с опцией jsdoc.', function() {

    var cli = new helper.testCLI('./bin/definer -v e -d test/maker/modules/').setTarget('test/maker/modules/all.js');

    it('Сборка всех модулей', function(done) {
        cli.exec('-c test/maker/modules/jsdoc.json', helper.getClosureStringMakeJSDoc(), done);
    });

    after(function(done) {
        cli.unlinkAfterExec(done);
    });

});
