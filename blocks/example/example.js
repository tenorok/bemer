BEM.DOM.decl('example', {

    onSetMod: {
        js: {
            inited: function() {
                this.editors = {
                    templates: this.findBlockInside(this.elem('templates'), 'ace'),
                    bemjson: this.findBlockInside(this.elem('bemjson'), 'ace'),
                    result: this.findBlockInside(this.elem('result'), 'ace')
                };
            }
        }
    }

}, {

    live: function() {
        this
            .liveBindTo('templates', 'keyup', function() {
                try {
                    eval(this.editors.templates.val());
                } catch(e) {
                    console.log(e);
                }
            })
            .liveBindTo('bemjson', 'keyup', function() {
                try {
                    eval('window.bemjson = ' + this.editors.bemjson.val());
                } catch(e) {
                    console.log(e);
                }

                if(window.bemjson) {
                    this.editors.result.val(bemer(window.bemjson));
                }
            });
    }

});
