const _ = require('underscore'),
    clicolor = require('cli-color'),
    moment = require('moment');

/**
 * Класс логгирования сообщений
 * @constructor
 * @param {Array} [types] Разрешённые типы вывода сообщений
 * @param {Object} [colors] Цвета для вывода сообщений
 */
function Logger(types, colors) {

    /**
     * Разрешённые типы вывода сообщений
     * @type {Array}
     */
    this.types = types || [];

    /**
     * Цвета для вывода сообщений
     * @type {Object}
     */
    this.colors = _.defaults(colors || {}, {

        log: 'cyan',
        info: 'green',
        warn: 'yellow',
        error: 'red',

        bracket: 'white',
        time: 'blackBright',
        total: 'red',

        path: 'blueBright',
        text: 'whiteBright',
        description: 'blackBright'
    });
}

Logger.prototype = {

    /**
     * Разрешён ли тип сообщения к выводу
     * @param {String} type Тип сообщения
     * @returns {boolean}
     */
    isAccessMode: function(type) {

        // Если не указан ни один режим, то они все разрешены
        if(!this.types.length) return true;

        return !!~this.types.indexOf(type);
    },

    /**
     * Вывести логирующее сообщение
     * @param {Object} info Информация для вывода
     */
    log: function(info) {
        this.print('log', info);
    },

    /**
     * Вывести информационное сообщение
     * @param {Object} info Информация для вывода
     */
    info: function(info) {
        this.print('info', info);
    },

    /**
     * Вывести предупреждающее сообщение
     * @param {Object} info Информация для вывода
     */
    warn: function(info) {
        this.print('warn', info);
    },

    /**
     * Вывести сообщение об ошибки
     * @param {Object} info Информация для вывода
     */
    error: function(info) {
        this.print('error', info);
    },

    /**
     * Начать отсчёт и вывести соответствующее уведомление
     * @returns {Logger}
     */
    start: function() {
        this.timeStart = moment();
        this.print('log', { text: 'build started' });
        return this;
    },

    /**
     * Завершить отсчёт и вывести время с начала отсчёта
     * @returns {Logger}
     */
    finish: function() {
        this.print('log', {
            text: 'build finished -',
            total: moment() - this.timeStart
        });
        return this;
    },

    /**
     * Напечатать сообщение
     * @param {Object} info Информация для вывода
     * @property {String} [info.operation] Выполняемая операция
     * @property {String} [info.path] Путь до файла или директории
     * @property {String} [info.description] Пояснение к выполняемой операции
     * @property {String} [info.text] Сообщение
     * @property {number} [info.total] Время выполнения операции в миллисекундах
     */
    print: function(type, info) {
        if(!this.isAccessMode(type)) return;

        var colors = this.colors,
            message = [clicolor[colors.time](moment().format('HH:mm:ss.SSS') + ' -')];

        if(info.operation) {
            message = message.concat(this.brackets(clicolor[colors[type]](info.operation)));
        }

        if(info.path) {
            message = message.concat(this.brackets(clicolor[colors.path](info.path)));
        }

        if(info.text) {
            message.push(clicolor[colors.text](info.text));
        }

        if(info.description) {
            message.push(clicolor[colors.description](info.description));
        }

        if(info.total) {
            message.push(clicolor[colors.total](info.total + 'ms'));
        }

        console.log.apply(this, message);
    },

    /**
     * Обрамить строку квадратными скобками
     * @param {String} content Обрамляемая строка
     * @returns {String[]}
     */
    brackets: function(content) {
        return [
            clicolor[this.colors.bracket]('[') +
            content +
            clicolor[this.colors.bracket](']')
        ];
    }

};

module.exports = Logger;
