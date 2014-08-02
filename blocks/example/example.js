BEM.DOM.decl('example', {

    onSetMod: {
        js: {
            inited: function() {
                this.editors = {
                    templates: this.findBlockInside(this.elem('templates'), 'ace'),
                    bemjson: this.findBlockInside(this.elem('bemjson'), 'ace'),
                    result: this.findBlockInside(this.elem('result'), 'ace')
                };

                this._templatesValue = '';
                this._bemjsonValue = '';

                this.setDefaultExample();
            }
        }
    },

    setDefaultExample: function() {
        this
            .setDefaultTemplates()
            .setDefaultBEMJSON()
            .setResult();
    },

    setDefaultTemplates: function() {
        this.editors.templates.val(
            "bemer\n" +
            "   .match('header', {\n" +
            "       tag: 'header',\n" +
            "       content: function() {\n" +
            "           return {\n" +
            "               elem: 'title',\n" +
            "               content: this.bemjson.title\n" +
            "           };\n" +
            "       }\n" +
            "   })\n" +
            "   .match('header__title', {\n" +
            "       tag: 'h1',\n" +
            "       content: function(content) {\n" +
            "           return content + '!';\n" +
            "       }\n" +
            "   });"
        );
        return this;
    },

    setDefaultBEMJSON: function() {
        this.editors.bemjson.val(
            "({\n" +
            "   block: 'header',\n" +
            "   title: 'Hello World'\n" +
            "});"
        );
        return this;
    },

    setResult: function() {
        var templatesValue = this.editors.templates.val(),
            bemjsonValue = this.editors.bemjson.val();

        if(this._templatesValue === templatesValue && this._bemjsonValue === bemjsonValue) return;

        this._templatesValue = templatesValue;
        this._bemjsonValue = bemjsonValue;

        bemer.clean();

        try { eval(templatesValue); } catch(e) {
            console.log(e);
        }

        try { eval('window.bemjson = ' + bemjsonValue); } catch(e) {
            console.log(e);
        }

        if(window.bemjson) {
            this.editors.result.val(style_html(bemer(window.bemjson)));
        }

        return this;
    }

}, {

    live: function() {

        this.liveBindTo('templates bemjson', 'keyup', function() {
            this.setResult();
        });

        return false;
    }

});
