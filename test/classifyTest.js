definer('classifyTest', function(assert, classify) {
    describe('Модуль classify.', function() {

        var A = classify({
            __constructor: function(property) {
                this.property = property;
            },

            getProperty: function() {
                return this.property + ' of instanceA';
            },

            getType: function() {
                return 'A';
            },

            getStaticProperty: function() {
                return this.__self.staticMember;
            }
        }, {
            staticProperty: 'staticA',

            staticMethod: function() {
                return this.staticProperty;
            }
        });

        it('Класс с конструктором и статическими методами', function() {
            var a = new A('Hello');
            assert.equal(a.getProperty(), 'Hello of instanceA');
            assert.equal(a.getType(), 'A');
            assert.equal(A.staticMethod(), 'staticA');
        });

        var B = classify(A, {
            getProperty: function() { // overriding
                return this.property + ' of instanceB';
            },

            getType: function() { // overriding + "super" call
                return this.__base() + 'B';
            }
        }, {
            staticMethod: function() { // static overriding + "super" call
                return this.__base() + ' of staticB';
            }
        });

        it('Унаследованный класс', function() {
            var b = new B('World');
            assert.equal(b.getProperty(), 'World of instanceB');
            assert.equal(b.getType(), 'AB');
            assert.equal(B.staticMethod(), 'staticA of staticB');
        });

        var M = classify({
            getMixedProperty: function() {
                return 'mixed property';
            }
        }),

        // inherited from A with mixin M
        C = classify([A, M], {
            getMixedProperty: function() {
                return this.__base() + ' from C';
            }
        });

        it('Унаследованный и примиксованный класс', function() {
            var c = new C();
            assert.equal(c.getMixedProperty(), 'mixed property from C');
        });

    });
});
