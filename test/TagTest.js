definer('TagTest', function(assert, Tag) {
    describe('Модуль Tag.', function() {

        it('Получить имя тега', function() {
            var div = new Tag();
            assert.equal(div.name(), 'div');

            var poly = new Tag('span');
            assert.equal(poly.name(), 'span');
            assert.equal(poly.name('img').name(), 'img');
        });

        it('Добавить/удалить классы, проверить на наличие и получить их список', function() {
            var tag = new Tag();
            assert.deepEqual(tag.addClass('block').addClass('block').getClass(), ['block']);
            assert.deepEqual(tag.addClass('block2').getClass(), ['block', 'block2']);
            assert.isTrue(tag.hasClass('block'));
            assert.deepEqual(tag.delClass('block').delClass('unexpect').getClass(), ['block2']);
            assert.isFalse(tag.hasClass('block'));
            assert.deepEqual(tag.addClass(['block3', 'block4']).getClass(), ['block2', 'block3', 'block4']);
        });

        it('Проверить на одиночный тег', function() {
            var tag = new Tag('img');
            assert.isTrue(tag.single());
            assert.isFalse(tag.name('table').single());
            assert.isTrue(tag.single(true).single(), 'принудительное указание одиночного тега');
            assert.isTrue(tag.name('b').single(), 'после смены тега принудительное указание не сбрасывается');
            assert.isFalse(tag.single(false).single());

            assert.isTrue(new Tag().single('br'), 'проверка указанного тега');
        });

        it('Добавить/удалить атрибуты, получить атрибут и список всех атрибутов', function() {
            var tag = new Tag('input');
            assert.deepEqual(tag.attr('id', 10).attr('id', 100).attr('type', 'checkbox').attr(), {
                id: 100,
                type: 'checkbox'
            });
            assert.deepEqual(tag.delAttr('type').delAttr('unexpect').attr(), { id: 100 });
            assert.equal(tag.attr('id'), 100);
            assert.isUndefined(tag.attr('type'));
            assert.isUndefined(tag.attr('id', false).attr('id'));
        });

        it('Добавить атрибут со сложным значением', function() {
            var tag = new Tag();

            tag.attr('data-bem', { myblock: { a: 100, b: 200 }});
            tag.attr('data-bem').myblock.a += 10;

            assert.deepEqual(tag.attr('data-bem'), { myblock: { a: 110, b: 200 }});
            assert.deepEqual(tag.attr('data-list', [100, true, 'third', { b: 200 }]).attr('data-list'),
                [100, true, 'third', { b: 200 }]
            );
        });

        it('Установить список атрибутов', function() {
            assert.deepEqual(new Tag('input').attr('id', 100).attr({
                type: 'text',
                placeholder: 'example',
                'data-bem': { my: { a: 1 }}
            }).attr(), {
                id: 100,
                type: 'text',
                placeholder: 'example',
                'data-bem': { my: { a: 1 }}
            });
        });

        it('Установить/добавить и получить содержимое тега', function() {
            var tag = new Tag();
            assert.deepEqual(tag.content('Первый').content(), ['Первый']);
            assert.deepEqual(tag.addContent('Второй').addContent('Третий').content(), ['Первый', 'Второй', 'Третий']);
            assert.deepEqual(tag.content('').content(), ['']);
            assert.deepEqual(new Tag().addContent('1').addContent(['2', '3']).content(), ['1', '2', '3']);
        });

        it('Содержимое тега хранится в чистом виде', function() {
            assert.deepEqual(new Tag().content('&<>"\'').content(), ['&<>"\'']);
        });

        it('Значение атрибута хранится в чистом виде', function() {
            assert.equal(new Tag().attr('src', '&<>"\'').attr('src'), '&<>"\'');
        });

        it('Получить строковое представление тега', function() {
            var tag = new Tag('span');
            assert.equal(tag.toString(), '<span></span>');
            assert.equal(tag.addContent('Строка ').addContent('содержимого.').toString(),
                '<span>Строка содержимого.</span>'
            );
            assert.equal(tag.addClass('block').addClass('block_mod_val').toString(),
                '<span class="block block_mod_val">Строка содержимого.</span>'
            );
            assert.equal(tag.attr('id', 'i100').attr('data-info', 'text').toString(),
                '<span class="block block_mod_val" id="i100" data-info="text">Строка содержимого.</span>'
            );
            assert.equal(tag.addContent(new Tag().content('Вложенный блок.')).toString(),
                '<span class="block block_mod_val" id="i100" data-info="text">' +
                    'Строка содержимого.' +
                    '<div>Вложенный блок.</div>' +
                '</span>'
            );
            assert.equal(tag.single(true).toString(), '<span class="block block_mod_val" id="i100" data-info="text">');
            assert.equal(tag.attr({
                disabled: true,
                id: false,
                'data-info': false
            }).toString(),
                '<span class="block block_mod_val" disabled>'
            );
        });

        it('При получении строкового представления cодержимое тега по умолчанию экранируется', function() {
            assert.equal(new Tag().content('&<>"\'').toString(), '<div>&amp;&lt;&gt;&quot;&#39;</div>');
            assert.equal(new Tag().content([100, true]).toString(), '<div>100true</div>',
                'не должно быть проблем с любыми типами');
        });

        it('При получении строкового представления значение атрибута по умолчанию экранируется', function() {
            assert.equal(new Tag().attr('src', '&<>"\'').toString(), '<div src="&amp;&lt;&gt;&quot;&#39;"></div>');
            assert.equal(new Tag().attr({ a: 100, b: 20.5 }).toString(), '<div a="100" b="20.5"></div>',
                'не должно быть проблем с любыми типами');
        });

        it('Получить строковое представление атрибута со сложным значением', function() {
            assert.equal(new Tag().attr('data-bem', { myblock: { a: 100, b: 200 }}).toString(),
                '<div data-bem="{&quot;myblock&quot;:{&quot;a&quot;:100,&quot;b&quot;:200}}"></div>'
            );
            assert.equal(new Tag().attr('data-list', [100, true, 'third', { b: 200 }]).toString(),
                '<div data-list="[100,true,&quot;third&quot;,{&quot;b&quot;:200}]"></div>'
            );
        });

        describe('Получить строковое представление тега с заданными опциями.', function() {

            it('Изменение стандартного имени тега', function() {
                var tag = new Tag();
                assert.equal(tag.toString({ defaultName: 'br' }), '<br>');
                assert.equal(tag.toString(), '<div></div>');
            });

            it('Принудительное указание одиночного тега и изменение стандартного имени', function() {
                assert.equal(new Tag(true).single(true).toString({ defaultName: 'span' }), '<span>');
            });

            it('Изменение флага автоповтора булева атрибута', function() {
                var tag = new Tag().attr('checked', true);
                assert.equal(tag.toString({ repeatBooleanAttr: true }), '<div checked="checked"></div>');
                assert.equal(tag.toString(), '<div checked></div>');
            });

            it('Изменение флага закрытия одиночного тега', function() {
                var tag = new Tag('input');
                assert.equal(tag.toString({ closeSingleTag: true }), '<input/>');
                assert.equal(tag.toString(), '<input>');
            });

            describe('Изменение флага автоматического экранирования.', function() {

                it('Содержимое', function() {
                    var tag = new Tag().content('&<>"\'');
                    assert.equal(tag.toString({ escapeContent: false }), '<div>&<>"\'</div>');
                    assert.equal(tag.toString(), '<div>&amp;&lt;&gt;&quot;&#39;</div>');
                });

                it('Атрибут', function() {
                    var tag = new Tag().attr('src', '<>');
                    assert.equal(tag.toString({ escapeAttr: false }), '<div src="<>"></div>');
                    assert.equal(tag.toString(), '<div src="&lt;&gt;"></div>');
                });

                it('Содержимое и атрибут', function() {
                    var tag = new Tag().attr('src', '<').content('&');
                    assert.equal(tag.toString({ escapeContent: false, escapeAttr: false }), '<div src="<">&</div>');
                    assert.equal(tag.toString({ escapeContent: true, escapeAttr: false }), '<div src="<">&amp;</div>');
                    assert.equal(tag.toString({ escapeContent: false, escapeAttr: true }), '<div src="&lt;">&</div>');
                    assert.equal(tag.toString(), '<div src="&lt;">&amp;</div>');
                });

                it('Сложный атрибут всегда экранируется', function() {
                    assert.equal(new Tag()
                        .attr('data-bem', { myblock: { a: true, b: 200 }})
                        .toString({ escapeAttr: false }),
                        '<div data-bem="{&quot;myblock&quot;:{&quot;a&quot;:true,&quot;b&quot;:200}}"></div>'
                    );
                });

            });

        });

        describe('Булево значение вместо имени тега.', function() {

            it('Тег по умолчанию', function() {
                assert.equal(new Tag(true).name(), 'div');
                assert.equal(new Tag(false).name(true).name(), 'div');

                assert.equal(new Tag(true).toString(), '<div></div>');
                assert.equal(new Tag().name(true).toString(), '<div></div>');
            });

            it('Без содержимого', function() {
                assert.equal(new Tag(false).toString(), '');
                assert.equal(new Tag().name(false).toString(), '');
            });

            it('С содержимым', function() {
                assert.equal(new Tag(false).content(new Tag('span').content('содержимое')).toString(),
                    '<span>содержимое</span>');
            });

            it('Вложенные анонимные теги', function() {
                assert.equal(new Tag().name(false).content(
                    new Tag('span').content(
                        new Tag(false).content('содержимое')
                    )
                ).toString(),
                    '<span>содержимое</span>');
            });

        });

        describe('Изменение настроек XHTML.', function() {

            afterEach(function() {
                Tag.repeatBooleanAttr = false;
                Tag.closeSingleTag = false;
            });

            it('Повторять булевы атрибуты', function() {
                Tag.repeatBooleanAttr = true;
                assert.equal(new Tag().attr('checked', true).toString(), '<div checked="checked"></div>');
            });

            it('Закрывать одиночные теги', function() {
                Tag.closeSingleTag = true;
                assert.equal(new Tag('img').toString(), '<img/>');
            });

        });

    });
});
