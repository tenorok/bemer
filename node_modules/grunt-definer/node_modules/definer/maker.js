const path = require('path'),
    vm = require('vm'),

    vow = require('vow'),
    walk = require('walk'),
    fs = require('graceful-fs'),
    _ = require('underscore'),
    moment = require('moment'),

    Logger = require('./logger');

/**
 * Сборщик модульной системы Definer
 * @constructor
 * @param {Object} [options] Опции сборки
 */
function Maker(options) {

    /**
     * Отсортированные по зависимостям модули
     * @private
     * @type {Object[]}
     */
    this.modules = [];

    /**
     * Содержимое файлов очищенных модулей
     * @private
     * @type {String[]}
     */
    this.clean = [];

    /**
     * Имена добавленных в отсортированный массив модулей
     * @private
     * @type {String[]}
     */
    this.sortedModuleNames = [];

    /**
     * Модули для собираемого модуля
     * @private
     * @type {Object}
     */
    this.modulesToModule = {};

    /**
     * Строка JSDoc
     * @private
     * @type {String}
     */
    this.jsdoc = '';

    /**
     * Строка замыкания из отсортированного списка модулей
     * @private
     * @type {String}
     */
    this.closure = '';

    /**
     * Путь до сохраняемого файла
     * @private
     * @type {String}
     */
    this.saveFilePath = '';

    /**
     * Необходимые для модулей помощники
     * @private
     * @type {Array}
     */
    this.requireHelpers = [];

    /**
     * Опции сборки
     * @type {{
     * directory: String|String[],
     * module: String|boolean,
     * postfix: String,
     * verbose: Array,
     * clean: Object,
     * jsdoc: Object
     * }}
     */
    this.options = _.defaults(options || {}, {
        directory: '.',
        module: false,
        postfix: 'js',
        verbose: [],
        clean: {},
        jsdoc: {}
    });

    /**
     * Экземпляр для логирования сборки
     * @private
     * @type {Logger}
     */
    this.console = new Logger(this.options.verbose);
}

/**
 * Закешированные файлы
 * @private
 * @type {Object}
 */
Maker.cacheFiles = {};

Maker.prototype = {

    /**
     * Собрать модули
     * @param {String} filePath Путь до сохраняемого файла
     * @returns {Promise}
     */
    make: function(filePath) {

        this.saveFilePath = filePath;

        var promise = vow.promise();

        this.console.start();

        this.getModules()
            .then(this.getCleanFiles.bind(this))
            .then(this.getJSDoc.bind(this))
            .then(function() {
                this.convertToClosure();
                this.saveClosureToFile().then(function(saved) {
                    this.console.finish();
                    promise.fulfill(saved);
                }.bind(this)).done();
            }.bind(this)).done();

        return promise;
    },

    /**
     * Рекурсивно получить список всех файлов в директориях
     * @returns {Promise}
     */
    getFileList: function() {
        var promise = vow.promise(),
            promises = [],
            directories = !Array.isArray(this.options.directory) ? [this.options.directory] : this.options.directory;

        directories.forEach(function(directory) {
            promises.push(this.getDirectoryFileList(directory));
        }, this);

        vow.all(promises).then(function(lists) {
            promise.fulfill(lists.reduce(function(flatList, list) {
                return flatList.concat(list);
            }, []));
        });

        return promise;
    },

    /**
     * Рекурсивно получить список всех файлов в директории
     * @private
     * @param {String} directory Путь до директории
     * @returns {Promise}
     */
    getDirectoryFileList: function(directory) {

        var promise = vow.promise(),
            walker = walk.walk(directory, { followLinks: false }),
            filelist = [];

        walker.on('file', function(root, stat, next) {

            var fileName = stat.name;
            if(this.isValidFilePostfix(fileName)) {
                filelist.push(path.join(root, stat.name));
            }

            next();
        }.bind(this));

        walker.on('end', function() {
            promise.fulfill(filelist);
        });

        return promise;
    },

    /**
     * Проверить, соответствует ли постфикс файлу
     * @private
     * @param {String} fileName Имя файла
     * @returns {boolean}
     */
    isValidFilePostfix: function(fileName) {

        var fileParts = fileName.split('.');
        fileParts.shift();

        return new RegExp(this.options.postfix + '$').test(fileParts.join('.'));
    },

    /**
     * Проверить файл на существование
     * @private
     * @param {String} filePath Путь до файла
     * @returns {Promise} Будет отклонён в случае отсутствия файла
     */
    isFileExists: function(filePath) {
        var promise = vow.promise();
        fs.exists(filePath, function(exists) {
            promise[exists ? 'fulfill' : 'reject']();
        });
        return promise;
    },

    /**
     * Открыть файл
     * @private
     * @param {String} filePath Путь до файла
     * @returns {Promise}
     */
    openFile: function(filePath) {
        var promise = vow.promise();

        if(Maker.cacheFiles[filePath]) {
            promise.fulfill(Maker.cacheFiles[filePath]);
            return promise;
        }

        fs.readFile(filePath, { encoding: 'UTF-8' }, function(err, data) {
            this.console[err ? 'error' : 'log']({ operation: 'open', path: filePath });
            Maker.cacheFiles[filePath] = data = data || '';
            promise.fulfill(data);
        }.bind(this));
        return promise;
    },

    /**
     * Открыть файл, если он существует
     * @private
     * @param {String} filePath Путь до файла
     * @returns {Promise} Будет отклонён в случае отсутствия файла
     */
    openExistsFile: function(filePath) {

        var promise = vow.promise();

        this.isFileExists(filePath).then(

            function() {
                this.openFile(filePath).then(function(data) {
                    promise.fulfill(data);
                });
            }.bind(this),

            function() {
                promise.reject();
            }
        );

        return promise;
    },

    /**
     * Колбек вызывается для каждого открытого файла в методе openFiles
     * @private
     * @callback Maker~openFilesCallback
     * @param {String} file Путь до файла
     * @param {String} data Содержимое файла
     */

    /**
     * Открыть список файлов
     * @private
     * @param {String[]} filesPath Пути до файлов
     * @param {Maker~openFilesCallback} [callback] Колбек вызывается для каждого файла
     * @returns {Promise}
     */
    openFiles: function(filesPath, callback) {

        var promises = [];

        filesPath.forEach(function(file) {

            var filePromise = this.openFile(file);
            promises.push(filePromise);

            filePromise.then(function(data) {
                callback && callback.call(this, file, data);
            }.bind(this)).done();

        }, this);

        return vow.all(promises);
    },

    /**
     * Сохранить строку замыкания в файл
     * @private
     * @returns {Promise}
     */
    saveClosureToFile: function() {

        var promise = vow.promise();

        if(this.closure) {
            fs.writeFile(this.saveFilePath, this.closure, function(err) {
                if(err) return promise.reject(err);
                promise.fulfill(true);
            });
        } else {
            promise.fulfill(false);
        }

        return promise;
    },

    /**
     * Получить находящиеся в файле модули
     * @param {String} filePath Путь до файла
     * @param {String} fileContent Содержимое файла
     * @returns {Object|null} Объект модулей файла или null при их отсутствии
     */
    getFileModules: function(filePath, fileContent) {

        var modules = {};

        var definer = function(name, body, data) {
            data = data || {};

            modules[name] = {
                dependencies: this.getArguments(body),
                body: body,
                export: data.export
            };

            this.console.log({ operation: 'read', path: filePath, description: name });
        }.bind(this);

        definer.clean = function(globals) {
            if(!Array.isArray(globals)) {
                globals = [globals];
            }

            globals.forEach(function(name) {
                modules[name] = {
                    dependencies: [],
                    clean: true
                };
                this.console.log({ operation: 'read-clean', path: filePath, description: name });
            }, this);
        }.bind(this);

        definer.export = function(name, body) {
            definer.call(this, name, body, { export: true });
        }.bind(this);

        this.eval(fileContent, { definer: definer }, { path: filePath });

        return Object.keys(modules).length ? modules : null;
    },

    /**
     * Выполнить код
     * @private
     * @param {String} code Код
     * @param {Object} context Контекст выполнения кода
     * @param {Object} info Дополнительная информация для вывода ошибки
     */
    eval: function(code, context, info) {
        try {
            vm.runInNewContext(code, context);
        } catch(e) {
            this.console.warn({ operation: 'skip', description: e, path: info.path });
        }
    },

    /**
     * Получить массив имён параметров тела модуля
     * @private
     * @returns {String[]}
     */
    getArguments: function(body) {
        var fnStr = body.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
        var args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
        return args || [];
    },

    /**
     * Получить все модули для сборки
     * @private
     * @returns {Promise}
     */
    getModuleList: function() {

        var promise = vow.promise(),
            modules = {};

        this.getFileList().then(function(fileList) {

            if(!fileList.length) {
                return promise.fulfill({});
            }

            this.openFiles(fileList, function(file, data) {
                modules = _.extend(modules, this.getFileModules(file, data));
            }).then(function() {
                promise.fulfill(modules);
            }).done();

        }.bind(this)).done();

        return promise;
    },

    /**
     * Получить все модули для собираемого модуля
     * @private
     * @returns {Promise}
     */
    getModuleListToModule: function() {

        var promise = vow.promise(),
            target = this.options.module;

        this.getModuleList().then(function(modules) {
            var modulesToTarget = this.getModulesByDependencies(target, modules);
            modulesToTarget[target] = modules[target];
            promise.fulfill(modulesToTarget);
        }.bind(this)).done();

        return promise;
    },

    /**
     * Получить список модулей по зависимостям
     * @private
     * @param {String} name Имя модуля
     * @param {Object} modules Все модули
     * @returns {Object}
     */
    getModulesByDependencies: function(name, modules) {

        if(!modules[name]) {
            throw new ReferenceError('module ' + name + ' is not found');
        }

        modules[name].dependencies.forEach(function(dependency) {
            this.modulesToModule[dependency] = modules[dependency];
            this.getModulesByDependencies(dependency, modules);
        }, this);

        return this.modulesToModule;
    },

    /**
     * Получить отсортированные по зависимостям модули
     * @returns {Promise}
     */
    getModules: function() {

        var promise = vow.promise(),
            method = this.options.module ? 'getModuleListToModule' : 'getModuleList';

        this[method]().then(function(modules) {
            promise.fulfill(this.sortModules(modules));
        }.bind(this)).done();

        return promise;
    },

    /**
     * Получить содержимое всех файлов всех очищенных модулей
     * @private
     * @returns {Promise}
     */
    getCleanFiles: function() {

        var promises = [];

        this.getCleanModules().forEach(function(module) {
            var promise = this.openCleanFiles(module.name);
            promises.push(promise);
            promise.then(function(filesContent) {
                if(!filesContent) return;
                this.clean.push(filesContent);
            }.bind(this)).done();
        }, this);

        return vow.all(promises);
    },

    /**
     * Открыть все файлы указанного очищенного модуля
     * @private
     * @param {String} module Имя модуля
     * @returns {Promise}
     */
    openCleanFiles: function(module) {

        var promise = vow.promise();

        if(!this.options.clean.hasOwnProperty(module)) {
            promise.fulfill('');
            return promise;
        }

        var moduleFiles = this.options.clean[module],
            files = Array.isArray(moduleFiles) ? moduleFiles : [moduleFiles];

        this.openFiles(files).then(function(filesContent) {
            promise.fulfill(filesContent.join('\n'));
        });

        return promise;
    },

    /**
     * Сформировать строку замыкания из отсортированного списка модулей
     * @returns {String}
     */
    convertToClosure: function() {

        var length = this.modules.length,
            cleaned = [],
            closure = [
                this.convertClean(),
                this.jsdoc,
                '(function(global, undefined) {\n',
                this.convertHelpers(),
                'var '
            ];

        this.modules.forEach(function(module, index) {

            if(this.isClean(module)) {
                cleaned.push(module.name);
            }

            closure = closure.concat(this.getModuleClosure(module));

            index + 1 < length
                ? closure.push(',')
                : closure.push(';');

            closure.push('\n');
        }, this);

        if(cleaned.length) {
            closure = closure.concat([
                JSON.stringify(cleaned),
                '.forEach(function(g) { delete global[g]; });\n'
            ]);
        }

        closure.push('})(this);');

        // Если был добавлен хотя бы один модуль
        return this.closure = closure.length > 2 ? closure.join('') : '';
    },

    /**
     * Сформировать строку для модуля
     * @private
     * @param {Object} module Информация о модуле
     * @returns {Array}
     */
    getModuleClosure: function(module) {

        if(this.isClean(module)) {
            return this.convertCleanModule(module);
        }

        if(this.isExport(module)) {
            return this.convertExportModule(module);
        }

        return this.convertDefaultModule(module);
    },

    /**
     * Сформировать строку содержимого файлов очищенных модулей
     * @private
     * @returns {String}
     */
    convertClean: function() {
        if(!this.clean.length) return '';

        this.clean.unshift(
            '(function(undefined) {',
            'var exports = undefined, modules = undefined, define = undefined;'
        );

        this.clean.push('}).call(this);');

        return this.clean.join('\n') + '\n';
    },

    /**
     * Тела функций-помощников для собранного файла
     * @private
     * @type {Object}
     */
    helpers: {
        export: 'function(key, value) { ' +
            'return typeof exports === "object" ? module.exports[key] = value : global[key] = value;' +
        ' }'
    },

    /**
     * Сформировать строку помощников
     * @private
     * @returns {String}
     */
    convertHelpers: function() {
        if(!this.requireHelpers.length) return '';

        var helpers = ['var definer = {'];

        this.requireHelpers.forEach(function(name) {
            helpers.push(name + ': ' + this.helpers[name]);
        }, this);

        helpers.push('};');

        return helpers.join('\n') + '\n';
    },

    /**
     * Сформировать строку для обычного модуля
     * @private
     * @param {Object} module Информация о модуле
     * @returns {Array}
     */
    convertDefaultModule: function(module) {

        var closure = [
                module.name,
                ' = (',
                module.body,
                ').call(global'
            ];

        if(module.deps.length) {
            closure.push(', ', module.deps.join(', '));
        }

        closure.push(')');

        return closure;
    },

    /**
     * Сформировать строку для очищенного модуля
     * @private
     * @param {Object} module Информация о модуле
     * @returns {Array}
     */
    convertCleanModule: function(module) {
        return [
            module.name,
            ' = global.',
            module.name
        ];
    },

    /**
     * Сформировать строку для модуля с экспортом данных
     * @private
     * @param {Object} module Информация о модуле
     * @returns {Array}
     */
    convertExportModule: function(module) {

        var closure = [
            module.name,
            ' = ',
            'definer.export("' + module.name + '", ',
            '(',
            module.body,
            ').call(global'
        ];

        if(module.deps.length) {
            closure.push(', ', module.deps.join(', '));
        }

        closure.push('))');

        return closure;
    },

    /**
     * Является ли модуль очищенным
     * @private
     * @param {Object} module Информация о модуле
     * @returns {boolean}
     */
    isClean: function(module) {
        return !!module.clean;
    },

    /**
     * Экспортирует ли модуль данные
     * @private
     * @param {Object} module Информация о модуле
     * @returns {boolean}
     */
    isExport: function(module) {
        return !!module.export;
    },

    /**
     * Получить список очищенных модулей
     * @private
     * @returns {Object[]}
     */
    getCleanModules: function() {
        return this.modules.filter(function(module) {
            return this.isClean(module);
        }, this);
    },

    /**
     * Добавить элемент в массив, если его там ещё нет
     * @param {Array} array Массив
     * @param {*} element Элемент
     * @returns {Array}
     */
    pushOnce: function(array, element) {
        if(!~array.indexOf(element)) {
            array.push(element);
        }
        return array;
    },

    /**
     * Отсортировать полученный список всех модулей для сборки
     * @private
     * @param {Object} modules Список всех модулей
     * @returns {Object[]}
     */
    sortModules: function(modules) {

        Object.keys(modules).forEach(function(name) {

            var info = modules[name],
                dependencies = info.dependencies;

            if(!this.isModuleExist(name)) {

                if(modules[name].export) {
                    this.pushOnce(this.requireHelpers, 'export');
                }

                dependencies.forEach(function(dependency) {
                    this.addModule('push', dependency, modules[dependency]);
                }, this);

                this.addModule('push', name, info);

            } else {

                dependencies.forEach(function(dependency) {
                    this.moveBefore(name, dependency, modules[dependency]);
                }, this);

            }

        }, this);

        return this.modules;
    },

    /**
     * Добавить модуль в отсортированный массив
     * @private
     * @param {String} method Метод для работы с массивом
     * @param {String} name Имя модуля
     * @param {Object} info Информация о модуле
     * @param {String[]} info.dependencies Зависимости модуля
     * @param {Function} info.body Тело модуля
     */
    addModule: function(method, name, info) {
        if(this.isModuleExist(name)) return;

        var log = { operation: 'add', description: name };

        if(!info) {
            return this.console.error(log);
        }

        this.console.info(log);

        this.modules[method]({
            name: name,
            deps: info.dependencies,
            body: info.body,
            clean: info.clean,
            export: info.export
        });

        this.sortedModuleNames.push(name);
    },

    /**
     * Добавлен ли уже модуль в отсортированный массив
     * @private
     * @param {String} name Имя модуля
     * @returns {boolean}
     */
    isModuleExist: function(name) {
        return !!~this.sortedModuleNames.indexOf(name);
    },

    /**
     * Расположить один модуль перед другим
     * @private
     * @param {String} name Имя основного модуля, перед которым будет располагаться модуль-зависимость
     * @param {String} dependency Имя модуля-зависимости
     * @param {Object} info Информация о модуле
     * @param {String[]} info.dependencies Зависимости модуля
     * @param {Function} info.body Тело модуля
     * @returns {*}
     */
    moveBefore: function(name, dependency, info) {

        // Если модуля-зависимости ещё нет в сортируемом массиве
        if(!this.isModuleExist(dependency)) {
            return this.addModule('unshift', dependency, info);
        }

        var moduleIndex = this.getModuleIndex(name),
            dependencyIndex = this.getModuleIndex(dependency);

        // Если модуль-зависимость и так расположен перед основным модулем
        if(dependencyIndex < moduleIndex) return;

        this.moveBeforeIndex(moduleIndex, dependencyIndex);
    },

    /**
     * Получить индекс модуля в сортируемом массиве
     * @private
     * @param {String} name Имя модуля
     * @returns {number}
     */
    getModuleIndex: function(name) {
        var moduleIndex;
        this.modules.every(function(module, index) {
            moduleIndex = index;
            return module.name !== name;
        });
        return moduleIndex;
    },

    /**
     * Подвинуть модуль-зависимость перед основным модулем
     * @private
     * @param {number} moduleIndex Индекс основного модуля
     * @param {number} dependencyIndex Индекс модуля-зависимости
     */
    moveBeforeIndex: function(moduleIndex, dependencyIndex) {
        this.modules.splice(moduleIndex, 0, this.modules[dependencyIndex]); // Скопировать на новое место
        this.modules.splice(dependencyIndex + 1, 1); // Удалить с прошлого места
    },

    /**
     * Получить сформированную строку JSDoc
     * @private
     * @returns {Promise}
     */
    getJSDoc: function() {
        var jsdoc = ['/*!'],
            option = this.options.jsdoc,
            promise = vow.promise(),
            promises = [];

        if(_.isEmpty(option)) {
            promise.fulfill('');
            return promise;
        }

        Object.keys(option).forEach(function(tag) {
            promises.push(this.getJSDocTag(tag, option[tag]));
        }, this);

        vow.all(promises).then(function(lines) {
            this.jsdoc = jsdoc.concat(lines).concat([' */\n']).join('\n');
            promise.fulfill(this.jsdoc);
        }.bind(this));

        return promise;
    },

    /**
     * Получить строку JSDoc тега
     * @private
     * @param {String} tag Имя тега
     * @param {*} value Значение тега
     * @returns {Promise}
     */
    getJSDocTag: function(tag, value) {

        var promise = vow.promise(),
            before = ' * @' + tag + ' ',
            standard = before + value;

        if(tag === 'date' && value === true) {
            promise.fulfill(before + moment().lang('en').format('D MMMM YYYY'));
            return promise;
        }

        this.openExistsFile(value).then(

            function(data) {
                try {
                    var jsonValue = JSON.parse(data)[tag];
                } catch(error) {
                    this.console.warn({
                        operation: 'jsdoc', path: value,
                        description: '@' + tag + ' file must be JSON'
                    });
                    return promise.fulfill(standard);
                }
                promise.fulfill(before + jsonValue);
            }.bind(this),

            function() {
                promise.fulfill(standard);
            }
        );

        return promise;
    }

};

module.exports = Maker;
