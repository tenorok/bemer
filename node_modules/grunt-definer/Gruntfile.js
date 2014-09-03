module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            test: [
                '!test/tmp/.gitkeep',
                'test/tmp/*'
            ]
        },
        definer: {
            all: {
                target: 'test/tmp/all.js',
                directory: 'test/modules/',
                clean: {
                    $: [
                        'test/libs/jquery/jquery.js',
                        'test/libs/jquery/jquery.ui.js',
                        'test/libs/jquery/plugin.jquery.js'
                    ],
                    _: 'test/libs/underscore.js'
                },
                jsdoc: {
                    "file": "File description",
                    "copyright": "2014 Artem Kurbatov, tenorok.ru",
                    "license": "MIT license",
                    "name": "package.json"
                }
            },
            c: {
                target: 'test/tmp/c.js',
                directory: 'test/modules/',
                module: 'c',
                verbose: ['info']
            },
            d: {
                target: 'test/tmp/d.js',
                directory: 'test/modules/',
                module: 'd',
                postfix: 'js',
                verbose: ['warn', 'error']
            },
            x: {
                target: 'test/tmp/x.js',
                directory: [
                    'test/modules/',
                    'test/modules2/'
                ],
                module: 'x'
            }
        },
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('default', ['clean', 'definer']);
    grunt.registerTask('test', ['clean', 'definer', 'nodeunit']);

};
