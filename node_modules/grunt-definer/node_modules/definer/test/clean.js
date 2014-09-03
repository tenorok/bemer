var fs = require('fs'),
    path = require('path'),
    vm = require('vm'),
    assert = require('chai').assert,
    definer = require('../definer.js').definer,

    file = fs.readFileSync(path.join(__dirname, '../definer.js'), 'utf-8'),

    context = vm.createContext({
        $: function() { return 'jQuery'; },
        _: function() { return 'underscore'; }
    });

vm.runInContext(file, context);

function getModules() {
    return vm.runInContext("definer.getModules()", context);
}

describe('Тест на очистку глобального контекста.', function() {

    it('jQuery', function() {
        vm.runInContext("definer.clean('$')", context);
        var modules = getModules();
        assert.property(modules, '$');
        assert.notProperty(modules, '_');
    });

    it('Underscore', function() {
        vm.runInContext("definer.clean(['$', '_'])", context);
        var modules = getModules();
        assert.property(modules, '$');
        assert.property(modules, '_');
    });

    it('Модуль a зависит от $', function() {
        var a = vm.runInContext("definer('a', function($) { return $() + '!'; })", context);
        assert.equal(a, 'jQuery!');
    });

});
