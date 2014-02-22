module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            hooks: ['.git/hooks/*']
        },
        shell: {
            hooks: {
                command: 'cp .githooks/* .git/hooks/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('install-hooks', ['clean:hooks', 'shell:hooks']);

};
