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

                this._examplesList = this.findBlockInside('examples-list');

                this._examplesList.on('select', function(e, data) {
                    this.editors.templates.val(data.template);
                    this.editors.bemjson.val(data.bemjson);
                    this.setResult();
                }, this);

                this._examplesList.selectExample(1);
            }
        }
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
