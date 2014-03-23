module.exports = function(grunt) {

    var Target = require('./grunt/Target'),
        module = grunt.option('module') || 'main';

    grunt.initConfig({
        clean: {
            githooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*']
        },
        shell: {
            githooks: { command: 'cp .githooks/* .git/hooks/' },
            jsdoc: { command: './node_modules/.bin/jsdoc -d jsdoc modules/' }
        },
        definer: Target.definer(),
        mochaTest: Target.mocha(module)
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-definer');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('githooks', ['clean:githooks', 'shell:githooks']);
    grunt.registerTask('jsdoc', ['shell:jsdoc']);

    grunt.registerTask('test', [
        'clean:test',
        'definer:' + module,
        'mochaTest'
    ]);

};
