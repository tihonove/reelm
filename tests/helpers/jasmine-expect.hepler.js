require('jasmine-expect');

const matchers = require('jasmine-immutable-matchers');

beforeEach(() => {
    jasmine.addMatchers(matchers);
});
