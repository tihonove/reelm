import { put, call, map } from '../../src/effects'
import runEffect from '../../src/effects-runner'

const returnAfter = (tm, v) => new Promise(r => setTimeout(r, tm, v));
const rejectAfter = (tm, v) => new Promise((_, r) => setTimeout(r, tm, v));

describe("EffectRunner", () => {

    ait("should process put effect in generator", async () => {
        var dispatch = jasmine.createSpy('dispatch');

        var effect = function *() {
            yield put({ type: 'Action' });
        };

        await runEffect(effect, dispatch);

        expect(dispatch.calls.allArgs()).toEqual([
            [{ type: 'Action' }],
        ]);
    })

    ait("should process put nested call generator", async () => {
        var dispatch = jasmine.createSpy('dispatch');

        var effect = function *() {
            yield call(function *() { 
                yield put({ type: 'Action' })
            });
        };

        await runEffect(effect, dispatch);

        expect(dispatch.calls.allArgs()).toEqual([
            [{ type: 'Action' }],
        ]);
    })

    ait("should process catch exceptions in nested call", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var catchedException = null;

        var effect = function *() {
            try {
                yield call(function *() { 
                    throw "error"
                });            
            }
            catch(e) {
                catchedException = e;
            }
        };

        await runEffect(effect, dispatch);

        expect(catchedException).toEqual("error");
    })
    
    ait("should return value from call effect", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var returnValue = null;

        var effect = function *() {
            returnValue = yield call(function *() { 
                return "value";
            });            
        };

        await runEffect(effect, dispatch);

        expect(returnValue).toEqual("value");
    })

    ait("should process promises in call", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var returnValue = null;

        var effect = function *() {
            returnValue = yield call(async function () { 
                return await returnAfter(10, "value");
            });
        };

        await runEffect(effect, dispatch);

        expect(returnValue).toEqual("value");
    })

    ait("should catch exceptions in promises in call", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var catchedException = null;

        var effect = function *() {
            try {
                yield call(async function () { 
                    await rejectAfter(10, "error");
                });            
            }
            catch(e) {
                catchedException = e;
            }
        };

        await runEffect(effect, dispatch);

        expect(catchedException).toEqual("error");
    })

    ait("should catch exceptions in promises in call when mapped", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var catchedException = null;

        var effect = function *() {
            try {
                yield { type: 'WillBeMapped' }
            }
            catch(e) {
                catchedException = e;
            }
        };
        var mappedEffect = effect::map(x => 
            (x.type === 'WillBeMapped')
                ? call(async function () { await rejectAfter(10, "error"); })
                : x);
        await runEffect(mappedEffect, dispatch);

        expect(catchedException).toEqual("error");
    })
    
    ait("should catch exceptions in promises in call via multiple maps", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var catchedException = null;

        var effect = function *() {
            try {
                yield call((function *() {
                    yield call((function * () {
                        yield call(async function () { await rejectAfter(10, "error"); });
                    })::map(x => x))
                })::map(x => x)::map(x => x))
            }
            catch(e) {
                catchedException = e;
            }
        };
        await runEffect(effect, dispatch);

        expect(catchedException).toEqual("error");
    })

    ait("should catch exceptions in promises in different levels", async () => {
        var dispatch = jasmine.createSpy('dispatch');
        var catchedExceptionInner = null;
        var catchedExceptionOuter = null;

        var effect = function *() {
            try {
                yield call((function *() {
                    try {
                        yield call((function * () {
                            yield call(async function () { await rejectAfter(10, "inner-error"); });
                        })::map(x => x))
                    }
                    catch(e) {
                        catchedExceptionInner = e;
                        throw "outer-error";
                    }
                })::map(x => x))
            }
            catch(e) {
                catchedExceptionOuter = e;
            }
        };
        await runEffect(effect, dispatch);

        expect(catchedExceptionInner).toEqual("inner-error");
        expect(catchedExceptionOuter).toEqual("outer-error");
    })

})