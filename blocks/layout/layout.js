BEM.DOM.decl('layout', {

    onSetMod: {
        js: {
            inited: function() {
                this._tabs = this.findBlockInside('tabs');
                this._example = this.findBlockInside('example');
                this._video = this.findBlockInside('video');

                var viewDomElems = this._example.domElem.add(this._video.domElem);

                this._tabs.on('change', function(e, data) {
                    viewDomElems.hide();
                    this['_' + data.value].domElem.show();
                }, this);
            }
        }
    }

});
