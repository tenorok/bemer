definer('string', /** @exports string */ function() {

    /**
     * Модуль работы со строками.
     *
     * @class
     */
    function string() {}

    /**
     * Экранирование строки текста.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.escape = function(string) {
        var stringEscapes = {
            '\\': '\\',
            '"': '"',
            '\'': '\'',
            '\n': 'n',
            '\r': 'r',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        return string.replace(/["'\n\r\t\u2028\u2029\\]/g, function(match) {
            return '\\' + stringEscapes[match];
        });
    };

    /**
     * Экранирование html-строки.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.htmlEscape = function(string) {
        var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;'
        };

        return string.replace(/[&<>"']/g, function(match) {
            return htmlEscapes[match];
        });
    };

    /**
     * Обрезать пробелы с начала и конца строки.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.trim = function(string) {
        return string.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Обрезать пробелы с начала строки.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.ltrim = function(string) {
        return string.replace(/^\s+/, '');
    };

    /**
     * Обрезать пробелы с конца строки.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.rtrim = function(string) {
        return string.replace(/\s+$/, '');
    };

    /**
     * Удалить повторяющиеся пробелы.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.collapse = function(string) {
        return string.replace(/\s+/g, ' ');
    };

    /**
     * Удалить HTML-теги.
     *
     * @param {string} string Строка
     * @returns {string}
     */
    string.stripTags = function(string) {
        return string.replace(/<\/?[^>]+>/gi, '');
    };

    return string;

});
