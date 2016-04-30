global.ait = (spec, fn) =>
    it(spec, done => {
        return fn().then(done, error => {
            fail(error);
            done();
        });
    });
