module.exports = function(grunt) {

    var module = grunt.option('module') || 'main';

    grunt.initConfig({
        clean: {
            hooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*']
        },
        shell: {
            hooks: {
                command: 'cp .githooks/* .git/hooks/'
            }
        },
        definer: {
            main: {
                target: 'test/tmp/main.js',
                directory: ['modules/', 'test/']
            },
            name: {
                module: 'NameTest',
                target: 'test/tmp/name.js',
                directory: ['modules/', 'test/']
            }
        },
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

    grunt.registerTask('test', ['clean:test', 'definer:' + module, 'mochaTest']);

};
