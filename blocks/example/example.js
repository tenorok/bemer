BEM.DOM.decl('example', {

    onSetMod: {
        js: {
            inited: function() {
                this.editors = {
                    templates: this.findBlockInside(this.elem('templates'), 'ace'),
                    bemjson: this.findBlockInside(this.elem('bemjson'), 'ace'),
                    result: this.findBlockInside(this.elem('result'), 'ace')
                };

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
            "bemer.match('header', {\n" +
            "   tag: 'header'\n" +
            "});"
        );
        return this;
    },

    setDefaultBEMJSON: function() {
        this.editors.bemjson.val(
            "({ block: 'header' });"
        );
        return this;
    },

    setResult: function() {
        try { eval(this.editors.templates.val()); } catch(e) {
            console.log(e);
        }

        try { eval('window.bemjson = ' + this.editors.bemjson.val()); } catch(e) {
            console.log(e);
        }

        if(window.bemjson) {
            this.editors.result.val(bemer(window.bemjson));
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
