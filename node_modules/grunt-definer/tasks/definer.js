module.exports = function(grunt) {

    var path = require('path'),
        Maker = require('definer').Maker;

    grunt.registerMultiTask('definer', 'Make modules', function() {

        var done = this.async(),
            cwd = process.cwd(),
            data = this.data,
            target = path.join(cwd, data.target);

        new Maker({
            directory: data.directory,
            module: data.module,
            postfix: data.postfix,
            verbose: data.verbose,
            clean: data.clean,
            jsdoc: data.jsdoc
        }).make(target).then(function(saved) {

            saved
                ? grunt.log.writeln('File "' + target + '" created.')
                : grunt.log.warn('File "' + target + '" not created.');

            done();
        }).done();
    });
};
