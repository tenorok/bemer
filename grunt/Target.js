function Target() {}

Target.definer = function() {

    var modules = [
            'Name',
            'Tag',
            'string',
            'Node'
        ],

        directories = ['modules/', 'test/'],

        target = {
            main: {
                target: 'test/tmp/main.js',
                directory: directories
            }
        };

    modules.forEach(function(moduleName) {
        var testName = moduleName + 'Test';
        target[moduleName] = {
            module: testName,
            target: 'test/tmp/' + testName + '.js',
            directory: ['modules/', 'test/']
        };
    });

    return target;
};

module.exports = Target;
