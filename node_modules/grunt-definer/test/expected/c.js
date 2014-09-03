(function(global, undefined) {
var $ = global.$,
_ = global._,
a = (function ($, _) { return 'a'; }).call(global, $, _),
b = (function (a){return a + 'b';}).call(global, a),
c = (function (a, b) {
    return a + b + 'c';
}).call(global, a, b);
["$","_"].forEach(function(g) { delete global[g]; });
})(this);