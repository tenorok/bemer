definer.export('molotok', /** @exports molotok */ function(
        is, string, number, object, functions
    ) {

    return {
        is: is,
        string: string,
        number: number,
        object: object,
        functions: functions
    };

});
