definer('Tree', /** @exports Tree */ function() {

    /**
     * Модуль работы с BEMJSON-деревом.
     *
     * @class
     */
    function Tree(tree) {

        /**
         * Дерево.
         *
         * @private
         * @type {object}
         */
        this._tree = tree;
    }

    Tree.prototype = {

        expand: function() {}

    };

    return Tree;

});
