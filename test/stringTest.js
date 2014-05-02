definer('stringTest', function(assert, string) {
    describe('Модуль string.', function() {

        it('Экранировать строку текста', function() {
            assert.equal(string.escape('\\,"\'\n\r\t\u2028\u2029'), '\\\\,\\"\\\'\\n\\r\\t\\u2028\\u2029');
        });

        it('Экранировать html-строку', function() {
            assert.equal(string.htmlEscape('&<>"\'\/'), '&amp;&lt;&gt;&quot;&#39;\/');
        });

        it('Разэкранировать html-строку', function() {
            assert.equal(string.unHtmlEscape('&amp;&lt;&gt;&quot;&#39;\/'), '&<>"\'\/');
        });

        it('Обрезать пробелы с начала и конца строки', function() {
            assert.equal(string.trim('   string   '), 'string');
        });

        it('Обрезать пробелы с начала строки', function() {
            assert.equal(string.ltrim('   string '), 'string ');
        });

        it('Обрезать пробелы с конца строки', function() {
            assert.equal(string.rtrim(' string   '), ' string');
        });

        it('Удалить повторяющиеся пробелы', function() {
            assert.equal(string.collapse('Just   text  in    paragraph.'), 'Just text in paragraph.');
        });

        it('Удалить HTML-теги', function() {
            assert.equal(string.stripTags('<p>Text and <a href="#">link</a>.</p>'), 'Text and link.');
        });

    });
});
