var path = require('path'),
    assert = require('chai').assert,
    Maker = require('../../maker.js');

function getModuleNames(modules) {
    return modules.map(function(module) { return module.name });
}

describe('Тестирование сортировки модулей по зависимостям.', function() {

    it('Сортировка модулей с файловой системы', function(done) {
        new Maker({
            directory: path.join(__dirname, 'modules'),
            verbose: ['error']
        }).getModules().then(function(modules) {

            // Модули должны быть отсортированы в порядке, определяемом зависимостями
            assert.deepEqual(
                getModuleNames(modules),
                ['a', 'b', 'c', 'd', 'e', 'f']
            );

            done();
        }).done();
    });

    it('Сортировка аналогичных файловой системе модулей в другом порядке', function() {
        var modules = new Maker({
            verbose: ['error']
        }).sortModules({
            e: { dependencies: ['d'] },
            d: { dependencies: ['b', 'a', 'c'] },
            f: { dependencies: [] },
            c: { dependencies: ['b', 'a'] },
            b: { dependencies: ['a'] },
            a: { dependencies: [] }
        });

        assert.deepEqual(
            getModuleNames(modules),
            ['a', 'b', 'c', 'd', 'e', 'f']
        );
    });

    it('Сортировка закрученных модулей', function() {
        var modules = new Maker({
            verbose: ['error']
        }).sortModules({
            b: { dependencies: ['a', 'c'] },
            a: { dependencies: ['f', 'e'] },
            d: { dependencies: ['a', 'b'] },
            e: { dependencies: ['d', 'f', 'a'] },
            c: { dependencies: ['f'] },
            f: { dependencies: ['a'] }
        });

        assert.deepEqual(
            getModuleNames(modules),
            ['d', 'a', 'f', 'e', 'c', 'b']
        );
    });

});
