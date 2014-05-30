module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var Target = require('./grunt/Target'),
        module = grunt.option('module') || 'main',

        Release = require('./grunt/Release'),
        release = new Release(grunt.option('ver'));

    grunt.initConfig({
        mkdir: {
            release: {
                options: { create: ['release'] }
            }
        },
        uglify: {
            release: {
                options: {
                    preserveComments: 'some'
                },
                files: { 'release/bemer.min.js': 'release/bemer.js' }
            }
        },
        clean: {
            githooks: ['.git/hooks/*'],
            test: ['!test/tmp/.gitkeep', 'test/tmp/*'],
            jsdoc: ['jsdoc'],
            release: ['release']
        },
        shell: {
            githooks: { command: 'cp .githooks/* .git/hooks/' },
            jsdoc: { command: './node_modules/.bin/jsdoc -d jsdoc modules/' },
            release: release.getShell()
        },
        definer: Target.definer(),
        mochaTest: Target.mocha(module)
    });

    grunt.registerTask('githooks', ['clean:githooks', 'shell:githooks']);
    grunt.registerTask('jsdoc', ['shell:jsdoc']);

    grunt.registerTask('test', [
        'clean:test',
        'definer:' + module,
        'mochaTest'
    ]);

    grunt.registerTask('release', function() {
        grunt.task.run('test', 'clean:test');
        grunt.task.run('clean:jsdoc', 'jsdoc');
        grunt.task.run('clean:release', 'mkdir:release', 'definer:release', 'uglify:release');

        release.changeJsonFilesVersion();
        grunt.task.run('shell:release');
    });

};
