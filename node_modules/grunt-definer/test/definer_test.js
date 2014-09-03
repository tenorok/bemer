var grunt = require('grunt');

exports.definer = {
    all: function(test) {
        test.expect(1);

        var expect = grunt.file.read('test/expected/all.js'),
            result = grunt.file.read('test/tmp/all.js');

        test.equal(expect, result, 'должны быть собраны все модули');

        test.done();
    },
    c: function(test) {
        test.expect(1);

        var expect = grunt.file.read('test/expected/c.js'),
            result = grunt.file.read('test/tmp/c.js');

        test.equal(expect, result, 'должны быть собраны все модули для модуля c');

        test.done();
    },
    d: function(test) {
        test.expect(1);

        var expect = grunt.file.read('test/expected/d.js'),
            result = grunt.file.read('test/tmp/d.js');

        test.equal(expect, result, 'должны быть собраны все модули для модуля d');

        test.done();
    },
    x: function(test) {
        test.expect(1);

        var expect = grunt.file.read('test/expected/x.js'),
            result = grunt.file.read('test/tmp/x.js');

        test.equal(expect, result, 'должны быть собраны все модули для модуля x');

        test.done();
    }
};
