const path = require('path'),
    fs = require('fs'),

    commander = require('commander'),
    _ = require('underscore'),

    Maker = require('./maker'),
    Logger = require('./logger'),

    defaultConfigFile = 'definer.json';

commander
    .version('0.0.4')
    .usage('[options] <file>')
    .option('-d, --directory <path1,path2>', 'directory of modules, comma delimited', '.')
    .option('-m, --module <name>', 'target module name')
    .option('-p, --postfix <postfix>', 'postfix to find files')
    .option('-v, --verbose <modes>', 'l - log, i - info, w - warn, e - error', function(modes) { return modes.split(''); })
    .option('-c, --config <file>', 'json format config', defaultConfigFile)
    .parse(process.argv);

/**
 * Конструктор
 * @constructor
 */
function Cli(filePath, options) {

    var verbose = this.resolveVerboseTypes(options.verbose || []);
    this.console = new Logger(verbose);

    this.saveFilePath = this.getAbsolutePath(filePath);

    this.options = _.extend(this.getConfig(options.config), this.cleanObject({
        directory: this.getAbsolutePath(options.directory.split(',')),
        module: options.module,
        postfix: options.postfix,
        verbose: verbose
    }));
}

Cli.prototype = {

    /**
     * Current working directory
     * @private
     * @type {String}
     */
    cwd: process.cwd(),

    /**
     * Получить абсолютный путь из относительного
     * @private
     * @param {String|String[]} relativePaths Относительный путь или массив путей
     * @returns {String|String[]}
     */
    getAbsolutePath: function(relativePaths) {
        return Array.isArray(relativePaths)
            ? relativePaths.map(function(relativePath) {
                return path.join(this.cwd, relativePath);
            }, this)
            : path.join(this.cwd, relativePaths);
    },

    /**
     * Удалить из объекта все неопределённые поля
     * @private
     * @param {Object} object Объект
     * @returns {Object}
     */
    cleanObject: function(object) {
        Object.keys(object).forEach(function(key) {
            if(!_.isUndefined(object[key])) return;
            delete object[key];
        });
        return object;
    },

    /**
     * Получить конфигурационный объект из файла
     * @private
     * @param {String} file Относительный путь до файла
     * @returns {Object}
     */
    getConfig: function(file) {
        var configPath = path.join(this.cwd, file),
            configExists = fs.existsSync(configPath),
            config = configExists
                ? JSON.parse(fs.readFileSync(configPath, { encoding: 'UTF-8' }))
                : {};

        if(!configExists) {
            if(file !== defaultConfigFile) {
                this.console.error('Missed config', [configPath]);
            }
            return config;
        }

        return this.propertyModifier(['clean', 'jsdoc'], path.dirname(configPath), config);
    },

    /**
     * Модифицировать поля конфигурационного объекта
     * @private
     * @param {String[]} properties Поля к модификации
     * @param {String} basePath Абсолютный путь до директории с конфигурационным файлом
     * @param {Object} config Конфигурационный объект
     * @returns {*}
     */
    propertyModifier: function(properties, basePath, config) {
        properties.forEach(function(property) {
            if(!config.hasOwnProperty(property)) return;

            Object.keys(config[property]).forEach(function(key) {
                config[property][key] = this.modifyProperty[property].call(
                    this, key, config[property][key], basePath
                );
            }, this);
        }, this);

        return config;
    },

    /**
     * Методы модификации полей опций конфигурационного объекта
     * @private
     * @type {Function[]}
     */
    modifyProperty: {

        /**
         * Модифицировать поля опции clean
         * @param {String} module Имя модуля
         * @param {String|Array} value Путь до файла или нескольких файлов
         * @param {String} basePath Абсолютный путь до директории с конфигурационным файлом
         * @returns {Array} Абсолютные пути до файлов модуля
         */
        clean: function(module, value, basePath) {
            var files = Array.isArray(value) ? value : [value],
                filesFullPath = [];

            files.forEach(function(file) {
                filesFullPath.push(path.join(basePath, file));
            });

            return filesFullPath;
        },

        /**
         * Модифицировать поля опции jsdoc
         * @param {String} tag Имя тега
         * @param {*} value Значение тега
         * @param {String} basePath Абсолютный путь до директории с конфигурационным файлом
         * @returns {String|boolean} Абсолютный путь до файла или поле без изменения
         */
        jsdoc: function(tag, value, basePath) {
            if(!_.isString(value)) return value;

            var file = path.join(basePath, value);

            return fs.existsSync(file) ? file : value;
        }

    },

    /**
     * Соответствие сокращённых и полных имён типов сообщений
     * @private
     * @type {Object}
     */
    verboseAliases: {
        l: 'log',
        i: 'info',
        w: 'warn',
        e: 'error'
    },

    /**
     * Развернуть сокращённые типы сообщений в полные
     * @private
     * @param {String[]} verbose Сокращённые типы сообщений
     * @returns {String[]}
     */
    resolveVerboseTypes: function(verbose) {
        return verbose.map(function(type) {
            return this.verboseAliases[type];
        }.bind(this));
    },

    /**
     * Запустить выполнение
     */
    run: function() {
        new Maker({
            directory: this.options.directory,
            module: this.options.module,
            postfix: this.options.postfix,
            verbose: this.options.verbose,
            clean: this.options.clean,
            jsdoc: this.options.jsdoc
        }).make(this.saveFilePath).then(function(saved) {
            var log = { operation: 'save', path: this.saveFilePath };
            saved ? this.console.info(log) : this.console.error(log);
        }.bind(this)).done();
    }
};

module.exports.run = function() {

    if(!commander.args.length) {
        return commander.outputHelp();
    }

    new Cli(commander.args[0], {
        directory: commander.directory,
        module: commander.module,
        postfix: commander.postfix,
        verbose: commander.verbose,
        config: commander.config
    }).run();
};
