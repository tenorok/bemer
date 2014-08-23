definer('benchmarkRecursion', function(assert, bemer) {
    var Benchmark = require('benchmark'),
        benchmarks = require('beautify-benchmark');

    describe('Тестирование производительности рекурсии.', function() {
        this.timeout(15000);

        it('Глубокая вложенность', function(done) {
            function construct(obj, depth) {
                if(depth < 5) {
                    obj.content = [
                        construct({ block: 'block' },  depth + 1),
                        construct({ block: 'block' },  depth + 1),
                        construct({ block: 'block' },  depth + 1)
                    ];
                }
                return obj;
            }

            new Benchmark.Suite()
                .add('recursion', function() {
                    bemer(construct({ block: 'block' }, 0));
                })
                .on('cycle', function(event) { benchmarks.add(event.target); })
                .on('complete', function() { benchmarks.log(); done(); })
                .run({ async: true });
        });

    });
});
