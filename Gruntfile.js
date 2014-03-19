module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            githooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*']
        },
        shell: {
            githooks: { command: 'cp .githooks/* .git/hooks/' },
            jsdoc: { command: './node_modules/.bin/jsdoc -d jsdoc modules/' }
        },
        definer: require('./grunt/Target').definer(),
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            main: { src: ['test/tmp/*'] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-definer');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('githooks', ['clean:githooks', 'shell:githooks']);
    grunt.registerTask('jsdoc', ['shell:jsdoc']);

    grunt.registerTask('test', [
        'clean:test',
        'definer:' + (grunt.option('module') || 'main'),
        'mochaTest'
    ]);

};
