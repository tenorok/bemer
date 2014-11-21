definer('bemerBenchmark', function(assert, format, bemer) {
    var Benchmark = require('benchmark'),
        benchmarks = require('beautify-benchmark');

    describe('Тестирование производительности рекурсии.', function() {
        var ops = {}, name;
        this.timeout(15000);

        name = 'recursion';
        ops[name] = 50;
        it('Глубокая вложенность / ' + format(ops[name]), function(done) {
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
                .add(name, function() {
                    bemer(construct({ block: 'block' }, 0));
                })
                .on('cycle', function(event) { benchmarks.add(event.target); })
                .on('complete', function(result) {
                    benchmarks.log();

                    result.target.hz < ops[name]
                        ? done(new Error('Slower than ' + format(ops[name])))
                        : done();
                })
                .run({ async: true });
        });

    });
});
