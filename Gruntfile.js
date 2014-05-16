module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var Target = require('./grunt/Target'),
        module = grunt.option('module') || 'main';

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
            release: ['release']
        },
        shell: {
            githooks: { command: 'cp .githooks/* .git/hooks/' },
            jsdoc: { command: './node_modules/.bin/jsdoc -d jsdoc modules/' }
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
        grunt.task.run('test');
        grunt.task.run(['clean:release', 'mkdir:release', 'definer:release', 'uglify:release']);
    });

};
