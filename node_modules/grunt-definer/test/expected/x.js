(function(global, undefined) {
var f = (function () { return 'f'; }).call(global),
x = (function (f) { return 'x'; }).call(global, f);
})(this);