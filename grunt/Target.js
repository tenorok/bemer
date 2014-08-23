function Target() {}

Target.definer = function() {

    var modules = [
            'Selector',
            'Tag',
            'Node',
            'Match',
            'classify',
            'Template',
            'Pool',
            'Tree',
            'Helpers',
            'bemer',
            'modules'
        ],

        directories = ['modules/', 'node_modules/molotok/modules/'],
        testDirectories = directories.concat('test/'),
        verbose = ['info', 'error'],
        clean = {
            inherit: 'node_modules/inherit/lib/inherit.js'
        },

        target = {
            release: {
                target: 'release/bemer.js',
                directory: directories,
                verbose: verbose,
                clean: clean,
                jsdoc: {
                    file: 'Template engine. BEMJSON to HTML processor.',
                    copyright: '2014 Artem Kurbatov, tenorok.ru',
                    license: 'MIT license',
                    version: 'package.json',
                    date: true
                }
            },
            main: {
                target: 'test/tmp/main.js',
                directory: testDirectories,
                verbose: verbose,
                clean: clean
            },
            benchmark: {
                target: 'test/tmp/benchmark.js',
                directory: directories.concat('test/helpers/', 'benchmark/'),
                verbose: verbose,
                clean: clean
            }
        };

    modules.forEach(function(moduleName) {
        var testName = moduleName + 'Test';
        target[moduleName] = {
            module: testName,
            target: 'test/tmp/' + testName + '.js',
            directory: testDirectories,
            verbose: verbose,
            clean: clean
        };
    });

    return target;
};

Target.mocha = function(module) {

    var target = { main: { src: ['test/tmp/*'] }};

    if(module !== 'main') {
        target.options = { reporter: 'spec' };
    }

    return target;
};

module.exports = Target;
