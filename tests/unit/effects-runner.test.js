import { put, call, map } from '../../src/effects';
import runEffect from '../../src/effects-runner';

const returnAfter = (tm, value) => new Promise(x => setTimeout(x, tm, value));
const rejectAfter = (tm, value) => new Promise((_, x) => setTimeout(x, tm, value));

describe('EffectRunner', () => {
    ait('should process put effect in generator', async () => {
        const dispatch = jasmine.createSpy('dispatch');

        const effect = function* () {
            yield put({ type: 'Action' });
        };

        await runEffect(effect, dispatch);

        expect(dispatch.calls.allArgs()).toEqual([
            [{ type: 'Action' }],
        ]);
    });

    ait('should process put nested call generator', async () => {
        const dispatch = jasmine.createSpy('dispatch');

        const effect = function* () {
            yield call(function* () {
                yield put({ type: 'Action' });
            });
        };

        await runEffect(effect, dispatch);

        expect(dispatch.calls.allArgs()).toEqual([
            [{ type: 'Action' }],
        ]);
    });

    ait('should process catch exceptions in nested call', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let catchedException = null;

        const effect = function* () {
            try {
                yield call(function* () {
                    throw 'error';
                });
            }
            catch (error) {
                catchedException = error;
            }
        };

        await runEffect(effect, dispatch);

        expect(catchedException).toEqual('error');
    });

    ait('should return value from call effect', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let returnValue = null;

        const effect = function* () {
            returnValue = yield call(function* () {
                return 'value';
            });
        };

        await runEffect(effect, dispatch);

        expect(returnValue).toEqual('value');
    });

    ait('should process promises in call', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let returnValue = null;

        const effect = function* () {
            returnValue = yield call(async function () {
                return await returnAfter(10, 'value');
            });
        };

        await runEffect(effect, dispatch);

        expect(returnValue).toEqual('value');
    });

    ait('should catch exceptions in promises in call', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let catchedException = null;

        const effect = function* () {
            try {
                yield call(async function () {
                    await rejectAfter(10, 'error');
                });
            }
            catch (error) {
                catchedException = error;
            }
        };

        await runEffect(effect, dispatch);

        expect(catchedException).toEqual('error');
    });

    ait('should catch exceptions in promises in call when mapped', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let catchedException = null;

        const effect = function* () {
            try {
                yield { type: 'WillBeMapped' };
            }
            catch (error) {
                catchedException = error;
            }
        };
        const mappedEffect = effect::map(x =>
            (x.type === 'WillBeMapped')
                ? call(async () => await rejectAfter(10, 'error'))
                : x
        );
        await runEffect(mappedEffect, dispatch);

        expect(catchedException).toEqual('error');
    });

    ait('should catch exceptions in promises in call via multiple maps', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let catchedException = null;

        const effect = function* () {
            try {
                yield call((function* () {
                    yield call((function* () {
                        yield call(async () => await rejectAfter(10, 'error'));
                    })::map(x => x));
                })::map(x => x)::map(x => x));
            }
            catch (error) {
                catchedException = error;
            }
        };
        await runEffect(effect, dispatch);

        expect(catchedException).toEqual('error');
    });

    ait('should catch exceptions in promises in different levels', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let catchedExceptionInner = null;
        let catchedExceptionOuter = null;

        const effect = function* () {
            try {
                yield call((function* () {
                    try {
                        yield call((function* () {
                            yield call(async () => await rejectAfter(10, 'inner-error'));
                        })::map(x => x));
                    }
                    catch (error) {
                        catchedExceptionInner = error;
                        throw 'outer-error';
                    }
                })::map(x => x));
            }
            catch (error) {
                catchedExceptionOuter = error;
            }
        };
        await runEffect(effect, dispatch);

        expect(catchedExceptionInner).toEqual('inner-error');
        expect(catchedExceptionOuter).toEqual('outer-error');
    });
});
