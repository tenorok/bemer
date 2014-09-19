definer('format', function() {
    return function(number) {
        return 'min ' + (number + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ops/sec';
    };
});
