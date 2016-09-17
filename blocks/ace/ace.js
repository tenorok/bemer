BEM.DOM.decl('ace', {

    onSetMod: {
        js: {
            inited: function() {
                this.editor = ace.edit(this.domElem.attr('id'));
                this.editor.session.setUseWrapMode(true);
                this.editor.session.setUseSoftTabs(false);
                this.editor.renderer.setScrollMargin(6, 6);

                this.editor.setOptions({
                    mode: 'ace/mode/' + this.params.mode,
                    minLines: this.params.minLines || 0,
                    maxLines: this.params.maxLines || Infinity
                });

                this.editor.setTheme('ace/theme/' + (
                    location.hash === '#light'
                        ? this.params.lightTheme
                        : this.params.theme
                ));

                BEM.channel('ace').on('set-light-theme', function() {
                    this.editor.setTheme('ace/theme/' + this.params.lightTheme);
                }, this);
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

}, {

    live: function() {
        $(window).on('hashchange', function() {
            if(location.hash === '#light') {
                BEM.channel('ace').trigger('set-light-theme');
            }
        });
    }

});
