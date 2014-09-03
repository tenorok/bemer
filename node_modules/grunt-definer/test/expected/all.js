(function(undefined) {
var exports = modules = define = undefined;
(function(global) { global.$ = 'jquery'; })(this);
(function(global) { global.$.ui = 'jquery.ui'; })(this);
(function(global) { global.$.plugin = 'jquery.plugin'; })(this);
(function(global) { global._ = 'underscore'; })(this);
}).call(this);
/*!
 * @file File description
 * @copyright 2014 Artem Kurbatov, tenorok.ru
 * @license MIT license
 * @name grunt-definer
 */
(function(global, undefined) {
var $ = global.$,
_ = global._,
a = (function ($, _) { return 'a'; }).call(global, $, _),
b = (function (a){return a + 'b';}).call(global, a),
c = (function (a, b) {
    return a + b + 'c';
}).call(global, a, b),
d = (function (
        a,
        b,
        c
    ){
        return a + b + 'c';
    }).call(global, a, b, c),
e = (function (d) { return d + 'e'; }).call(global, d),
f = (function () { return 'f'; }).call(global);
["$","_"].forEach(function(g) { delete global[g]; });
})(this);