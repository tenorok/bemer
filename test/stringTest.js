definer('stringTest', function(assert, string) {
    describe('Модуль string.', function() {

        it('Экранировать строку текста', function() {
            assert.equal(string.escape('\\,"\'\n\r\t\u2028\u2029'), '\\\\,\\"\\\'\\n\\r\\t\\u2028\\u2029');
        });

        it('Экранировать html-строку', function() {
            assert.equal(string.htmlEscape('&<>"\'\/'), '&amp;&lt;&gt;&quot;&#39;\/');
        });

    });
});
