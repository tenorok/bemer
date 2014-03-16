function Target() {}

Target.definer = function() {

    var modules = [
            'Name',
            'Tag',
            'Node',
            'Match',
            'classify',
            'Template',
            'string',
            'object',
            'is'
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

module.exports = Target;
