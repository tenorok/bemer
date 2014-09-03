(function(global) {

    /**
     * Конструктор
     * @constructor
     * @name Definer
     * @param {String} name Имя модуля
     * @param {Function} body Тело модуля
     */
    function Definer(name, body) {

        this.name = name;
        this.body = body;

        this.toPool();
    }

    /**
     * Объект для хранения всех объявленных модулей
     * @type {Object}
     */
    Definer.pool = {};

    /**
     * Перевести свойства из глобального контекста в модули
     * @param {String|String[]} modules Имя свойства или массив имён
     * @returns {Definer}
     */
    Definer.clean = function(modules) {
        if(!Array.isArray(modules)) {
            modules = [modules];
        }

        modules.forEach(function(module) {
            if(!global[module]) return;

            new Definer(module, global[module]).clean();
            delete global[module];
        });

        return this;
    };

    /**
     * Экспортировать результат модуля в зависимости от среды
     * @param {String} name Имя модуля
     * @param {*} value Результат выполнения тела модуля
     * @returns {*}
     */
    Definer.export = function(name, value) {
        return typeof exports === 'object'
            ? module.exports[name] = value
            : global[name] = value;
    };

    Definer.prototype = {

        /**
         * Добавить модуль в объект для хранения всех объявленных модулей
         */
        toPool: function() {
            Definer.pool[this.name] = {
                body: this.body
            };
        },

        /**
         * Получить массив имён параметров тела модуля
         * @returns {String[]}
         */
        getArguments: function() {
            var fnStr = this.body.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
            var args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
            return this.arguments = args || [];
        },

        /**
         * Получить массив зависимостей в виде выполненных тел модулей
         * @returns {Array}
         */
        getDependencies: function() {
            var dependencies = [];
            this.getArguments().forEach(function(argument) {
                dependencies.push(this.getDependency(argument));
            }, this);
            return dependencies;
        },

        /**
         * Получить выполненное тело зависимости
         * @param {String} name Имя зависимости
         * @returns {*}
         */
        getDependency: function(name) {
            var dependency = Definer.pool[name];
            if(!dependency) {
                this.throwDependency(name);
            }
            return dependency.export;
        },

        /**
         * Сообщить об отсутствии подключаемой зависимости
         * @param {String} name Имя зависимости
         */
        throwDependency: function(name) {
            throw new ReferenceError('module ' + name + ' is not defined');
        },

        /**
         * Выполнить тело модуля
         * @returns {*}
         */
        define: function() {
            return Definer.pool[this.name].export = this.body.apply(global, this.getDependencies());
        },

        /**
         * Обозначить модуль глобальным
         * @returns {*}
         */
        clean: function() {
            var module = Definer.pool[this.name];
            module.clean = true;
            return module.export = this.body;
        }

    };

    /**
     * Задекларировать модуль
     * @param {String} name Имя модуля
     * @param {Function} body Тело модуля
     * @returns {*}
     */
    global.definer = function(name, body) {
        return new Definer(name, body).define();
    };

    /**
     * Перевести свойства из глобального контекста в модули
     * @param {String|String[]} modules Имя свойства или массив имён
     * @returns {Definer}
     */
    global.definer.clean = Definer.clean;

    /**
     * Экспортировать результат модуля в зависимости от среды
     * @param {String} name Имя модуля
     * @param {Function} body Тело модуля
     * @returns {*}
     */
    global.definer.export = function(name, body) {
        return Definer.export(name, new Definer(name, body).define());
    };

    /**
     * Получить список всех объявленных модулей
     * @returns {Object}
     */
    global.definer.getModules = function() {
        return Definer.pool;
    };

})(this);
