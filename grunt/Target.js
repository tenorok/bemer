function Target() {}

Target.definer = function() {

    var modules = [
            'Name',
            'Tag',
            'Node',
            'Match',
            'classify',
            'Template',
            'Pool',
            'Tree',
            'Helpers',
            'string',
            'object',
            'is',
            'functions',
            'bemer'
        ],

        directories = ['modules/', 'test/'],
        verbose = ['info', 'error'],
        clean = {
            inherit: 'node_modules/inherit/lib/inherit.js'
        },

        target = {
            main: {
                target: 'test/tmp/main.js',
                directory: directories,
                verbose: verbose,
                clean: clean
            }
        };

    modules.forEach(function(moduleName) {
        var testName = moduleName + 'Test';
        target[moduleName] = {
            module: testName,
            target: 'test/tmp/' + testName + '.js',
            directory: directories,
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
