module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            hooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*']
        },
        shell: {
            hooks: {
                command: 'cp .githooks/* .git/hooks/'
            },
            jsdoc: {
                command: './node_modules/.bin/jsdoc -d jsdoc modules/'
            }
        },
        definer: require('./grunt/Target').definer(),
        mochaTest: {
            main: {
                src: ['test/tmp/*']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-definer');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('install-hooks', ['clean:hooks', 'shell:hooks']);
    grunt.registerTask('jsdoc', ['shell:jsdoc']);

    grunt.registerTask('test', [
        'clean:test',
        'definer:' + (grunt.option('module') || 'main'),
        'mochaTest'
    ]);

};
