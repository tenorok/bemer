BEM.DOM.decl('examples-list', {

    examples: [
        {},

        {
            template: "bemer\n" +
                "    .match('header', {\n" +
                "        tag: 'header',\n" +
                "        content: function() {\n" +
                "            return {\n" +
                "                elem: 'title',\n" +
                "                content: this.bemjson.title\n" +
                "            };\n" +
                "        }\n" +
                "    })\n" +
                "    .match('header__title', {\n" +
                "        tag: 'h1',\n" +
                "        content: function(content) {\n" +
                "            return content + '!';\n" +
                "        }\n" +
                "    });",
            bemjson: "({\n" +
                "    block: 'header',\n" +
                "    title: 'Hello World'\n" +
                "});"
        },

        {
            template: "bemer\n" +
                "    .config({ xhtml: true })\n" +
                "    .match('input_type_*', {\n" +
                "        content: function() {\n" +
                "            return {\n" +
                "                elem: 'control',\n" +
                "                value: this.bemjson.value\n" +
                "            };\n" +
                "        }\n" +
                "    })\n" +
                "    .match('input_disable__control', {\n" +
                "        attrs: { disabled: true }\n" +
                "    })\n" +
                "    .match('input_*_text__control', {\n" +
                "        tag: 'input',\n" +
                "        attrs: function() {\n" +
                "            return {\n" +
                "                placeholder: 'Your name',\n" +
                "                value: this.bemjson.value\n" +
                "            };\n" +
                "        }\n" +
                "    });",
            bemjson: "({\n" +
                "    block: 'input',\n" +
                "    mods: {\n" +
                "        type: 'text',\n" +
                "        disable: true\n" +
                "    },\n" +
                "    value: 'Constantin'\n" +
                "});"
        },

        {
            template: "bemer\n" +
                "    .match('button', {\n" +
                "        mods: { theme: 'normal' }\n" +
                "    })\n" +
                "    .match('button_theme_normal', {\n" +
                "        tag: 'button',\n" +
                "        content: function(content) {\n" +
                "            return {\n" +
                "                elem: 'label',\n" +
                "                content: content\n" +
                "            };\n" +
                "        }\n" +
                "    })\n" +
                "    .match('button_theme_normal__label', {\n" +
                "        elemMods: { size: 'm' }\n" +
                "    })\n" +
                "    .match('button_theme_normal__label_size_m', {\n" +
                "        tag: 'label'\n" +
                "    });",
            bemjson: "({\n" +
                "    block: 'button',\n" +
                "    content: 'Button'\n" +
                "});"
        },

        {
            template: "bemer\n" +
                "    .helper('bang', function(text) {\n" +
                "        return text + '!';\n" +
                "    })\n" +
                "    .match('link', {\n" +
                "        construct: function() {\n" +
                "            this.url = this.setProtocol();\n" +
                "        },\n" +
                "        setProtocol: function() {\n" +
                "            return '//' + this.bemjson.url;\n" +
                "        },\n" +
                "        tag: 'a',\n" +
                "        attrs: function() {\n" +
                "            return { href: this.url };\n" +
                "        },\n" +
                "        content: function(content) {\n" +
                "            return this.bang(content);\n" +
                "        }\n" +
                "    })\n" +
                "    .match('link_https', {\n" +
                "        setProtocol: function() {\n" +
                "            return 'https:' + this.__base();\n" +
                "        },\n" +
                "        attrs: function() {\n" +
                "            return this.__base();\n" +
                "        }\n" +
                "    });",
            bemjson: "({\n" +
                "    block: 'link',\n" +
                "    mods: { https: true },\n" +
                "    url: 'example.com',\n" +
                "    content: 'mylink'\n" +
                "});"
        }
    ],

    selectExample: function(indexOrTemplate, bemjson, data) {
        this.delMod(this.elem('item', 'selected', 'true'), 'selected');

        var index = typeof indexOrTemplate === 'number'
            ? indexOrTemplate
            : this.findExample(indexOrTemplate, bemjson);

        if(index) {
            this.setMod(this.elem('item', 'eq', index), 'selected', true);
            this.trigger('select', {
                index: index,
                template: this.examples[index].template,
                bemjson: this.examples[index].bemjson,
                data: data || {}
            });
            return index;
        }

        return null;
    },

    findExample: function(template, bemjson) {
        var index;
        return this.examples.some(function(example, i) {
            index = i;
            return example.template === template && example.bemjson === bemjson;
        }) ? index : null;
    }

}, {

    live: function() {
        this.liveBindTo('link', 'click', function(e) {
            e.preventDefault();
            this.selectExample(this.elemParams($(e.data.domElem.context))['eq']);
        });
    }

});
