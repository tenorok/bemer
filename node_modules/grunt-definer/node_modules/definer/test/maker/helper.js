const exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),

    assert = require('chai').assert,
    vow = require('vow'),
    _ = require('underscore'),
    moment = require('moment');

var binding = {

    exec: function(command) {

        var promise = vow.promise();

        exec(command, function(err, stdout) {
            if(err) return promise.reject(err);
            // Удаление последнего лишнего переноса строки
            promise.fulfill(stdout.slice(0, -1));
        });

        return promise;
    },

    readFile: function(file) {

        var promise = vow.promise();

        fs.readFile(file, { 'encoding': 'utf-8' }, function(err, data) {
            if(err) return promise.reject(err);
            promise.fulfill(data);
        });

        return promise;
    },

    exists: function(path) {

        var promise = vow.promise();

        fs.exists(path, function(exists) {
            promise.fulfill(exists);
        });

        return promise;
    },

    unlink: function(path) {

        return vow
            .when(this.exists(path), function(exists) {
                return exists;
            })
            .then(function(exists) {

                var promise = vow.promise();
                if(!exists) return promise.fulfill();

                fs.unlink(path, function(err) {
                    if(err) return promise.reject(err);
                    promise.fulfill();
                });

                return promise;
            });
    }

};

function testCLI(bin) {
    this.bin = bin;
}

testCLI.prototype = {

    setBin: function(bin) {
        this.bin = bin;
        return this;
    },

    setTarget: function(target) {
        this.target = target;
        return this;
    },

    exec: function(options, standard, done) {

        var promise = vow.promise();

        binding.exec([this.bin, options, this.target].join(' '))
            .then(function(stdout) {
                console.log(stdout);
                return vow.all([stdout, binding.readFile(this.target)]);
            }.bind(this))
            .spread(function(stdout, savedFileContent) {
                assert.equal(savedFileContent, standard);
                promise.fulfill(stdout);
                done && done();
            })
            .done();

        return this.execPromise = promise;
    },

    unlinkAfterExec: function(done, base) {
        vow.all([
            this.execPromise,
            binding.unlink(path.join(base || '', this.target))
        ]).then(function() {
            this.execPromise = undefined;
            done && done();
        }.bind(this));
    },

    changeCWD: function(newCWD, options, callback, done) {

        var cwd = process.cwd(),
            bin = this.bin,
            target = this.target;

        process.chdir(newCWD);

        if(options.bin) this.bin = options.bin;
        if(options.target) this.target = options.target;

        callback.call(this).then(function() {
            this.unlinkAfterExec(undefined, newCWD);
            process.chdir(cwd);
            this.bin = bin;
            this.target = target;
            done();
        }.bind(this));

        return this;
    }

};

var closure = {

    getClosureString: function() {
        return '(function(global, undefined) {\n' +
            'var a = (function () { return \'a\'; }).call(global),\n' +
            'b = (function (a){return a + \'b\';}).call(global, a),\n' +
            'c = (function (a, b) {\n' +
            '    return a + b + \'c\';\n' +
            '}).call(global, a, b),\n' +
            'd = (function (\n' +
            '        a,\n' +
            '        b,\n' +
            '        c\n' +
            '    ){\n' +
            '        return a + b + \'c\';\n' +
            '    }).call(global, a, b, c),\n' +
            'e = (function (d) { return d + \'e\'; }).call(global, d),\n' +
            'f = (function () { return \'f\'; }).call(global);\n' +
            '})(this);';
    },

    getClosureStringModuleC: function() {
        return '(function(global, undefined) {\n' +
            'var a = (function () { return \'a\'; }).call(global),\n' +
            'b = (function (a){return a + \'b\';}).call(global, a),\n' +
            'c = (function (a, b) {\n' +
            '    return a + b + \'c\';\n' +
            '}).call(global, a, b);\n' +
            '})(this);';
    },

    getClosureStringModuleX: function() {
        return '(function(global, undefined) {\n' +
            'var a = (function () { return \'a\'; }).call(global),\n' +
            'x = (function (a) { return \'x\'; }).call(global, a);\n' +
            '})(this);';
    },

    getClosureStringClean: function() {
        return '(function(global, undefined) {\n' +
            'var _ = global._,\n' +
            '$ = global.$,\n' +
            'b = (function ($, _) { return \'b\'; }).call(global, $, _),\n' +
            'c = (function ($) { return \'c\'; }).call(global, $),\n' +
            'a = (function (b, c) { return \'a\' + b + c; }).call(global, b, c);\n' +
            '["_","$"].forEach(function(g) { delete global[g]; });\n' +
            '})(this);';
    },

    getClosureStringCleanModuleC: function() {
        return '(function(global, undefined) {\n' +
            'var $ = global.$,\n' +
            'c = (function ($) { return \'c\'; }).call(global, $);\n' +
            '["$"].forEach(function(g) { delete global[g]; });\n' +
            '})(this);';
    },

    getClosureStringMakeCleanFiles: function() {
        return '(function(undefined) {\n' +
            'var exports = undefined, modules = undefined, define = undefined;\n' +
            '(function(global) { global._ = \'underscore\'; })(this);\n' +
            '(function(global) { global.$ = \'jquery\'; })(this);\n' +
            '(function(global) { global.$.ui = \'jquery.ui\'; })(this);\n' +
            '(function(global) { global.$.plugin = \'jquery.plugin\'; })(this);\n' +
            '}).call(this);\n' +
            '(function(global, undefined) {\n' +
            'var _ = global._,\n' +
            '$ = global.$,\n' +
            'b = (function ($, _) { return \'b\'; }).call(global, $, _),\n' +
            'c = (function ($) { return \'c\'; }).call(global, $),\n' +
            'a = (function (b, c) { return \'a\' + b + c; }).call(global, b, c);\n' +
            '["_","$"].forEach(function(g) { delete global[g]; });\n' +
            '})(this);';
    },

    getClosureStringMakeCleanFilesModuleC: function() {
        return '(function(undefined) {\n' +
            'var exports = undefined, modules = undefined, define = undefined;\n' +
            '(function(global) { global.$ = \'jquery\'; })(this);\n' +
            '(function(global) { global.$.ui = \'jquery.ui\'; })(this);\n' +
            '(function(global) { global.$.plugin = \'jquery.plugin\'; })(this);\n' +
            '}).call(this);\n' +
            '(function(global, undefined) {\n' +
            'var $ = global.$,\n' +
            'c = (function ($) { return \'c\'; }).call(global, $);\n' +
            '["$"].forEach(function(g) { delete global[g]; });\n' +
            '})(this);';
    },

    getClosureStringMakeJSDoc: function() {
        return '/*!\n' +
            ' * @file File description\n' +
            ' * @copyright 2014 Artem Kurbatov, tenorok.ru\n' +
            ' * @license MIT license\n' +
            ' * @date ' + moment().lang('en').format('D MMMM YYYY') + '\n' +
            ' * @version 0.0.7\n' +
            ' */\n' +
            '(function(global, undefined) {\n' +
            'var a = (function () { return \'a\'; }).call(global);\n' +
            '})(this);';
    },

    getClosureStringExportModuleZ: function() {
        return '(function(global, undefined) {\n' +
            'var definer = {\n' +
            'export: function(key, value) { return typeof exports === "object" ? module.exports[key] = value : global[key] = value; }\n' +
            '};\n' +
            'var z = definer.export("z", (function () { return { nameZ: \'valueZ\' }; }).call(global));\n' +
            '})(this);';
    },

    getClosureStringExportModuleY: function() {
        return '(function(global, undefined) {\n' +
            'var definer = {\n' +
            'export: function(key, value) { return typeof exports === "object" ? module.exports[key] = value : global[key] = value; }\n' +
            '};\n' +
            'var z = definer.export("z", (function () { return { nameZ: \'valueZ\' }; }).call(global)),\n' +
            'y = (function (z) { return \'z\'; }).call(global, z);\n' +
            '})(this);';
    },

    getClosureStringExportModuleW: function() {
        return '(function(global, undefined) {\n' +
            'var definer = {\n' +
            'export: function(key, value) { return typeof exports === "object" ? module.exports[key] = value : global[key] = value; }\n' +
            '};\n' +
            'var z = definer.export("z", (function () { return { nameZ: \'valueZ\' }; }).call(global)),\n' +
            'w = definer.export("w", (function (z) { return \'w\'; }).call(global, z));\n' +
            '})(this);';
    }

};

module.exports = _.extend({ testCLI: testCLI }, binding, closure);
