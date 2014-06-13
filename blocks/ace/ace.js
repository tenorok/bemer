BEM.DOM.decl('ace', {

    onSetMod: {
        js: {
            inited: function() {
                this.editor = ace.edit(this.domElem.attr('id'));
                this.editor.setTheme('ace/theme/' + this.params.theme);
                this.editor.getSession().setMode('ace/mode/' + this.params.mode);
            }
        }
    }

});
