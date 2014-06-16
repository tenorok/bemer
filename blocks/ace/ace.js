BEM.DOM.decl('ace', {

    onSetMod: {
        js: {
            inited: function() {
                this.editor = ace.edit(this.domElem.attr('id'));
                this.editor.setTheme('ace/theme/' + this.params.theme);
                this.editor.getSession().setMode('ace/mode/' + this.params.mode);
                this.editor.getSession().setUseWrapMode(true);

                this.editor.setOptions({
                    maxLines: Infinity
                });
            }
        }
    },

    val: function(value) {
        if(value) {
            this.editor.setValue(value, 1);
            return this;
        }

        return this.editor.getValue();
    }

});
