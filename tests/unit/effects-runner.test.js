import { noop, take, select, fork, join, put, call } from '../../src/effect-creators';
import { map } from '../../src/map-effects';
import runEffect from '../../src/effects-runner';
import ActionsObservable from '../../src/utils/self-made-actions-observable';

function mapIf(condition, func) {
    /* eslint-disable no-invalid-this */
    return this::map(x => condition(x) ? func(x) : x);
    /* eslint-enable no-invalid-this */
}

const nextTick = () => new Promise(x => setTimeout(x, 0));
const returnAfter = (tm, value) =>
    new Promise(x => setTimeout(x, tm, value));
const rejectAfter = (tm, value) =>
    new Promise((_, x) => setTimeout(x, tm, value));

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

    ait('should return result from promises in call when mapped', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result = null;

        const effect = function* () {
            result = yield { type: 'WillBeMapped' };
        };
        const mappedEffect = effect::map(x =>
            (x.type === 'WillBeMapped')
                ? call(async () => await returnAfter(10, 'value'))
                : x
        );
        await runEffect(mappedEffect, dispatch);

        expect(result).toEqual('value');
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

    ait('should return value from promises in call via multiple maps', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result = null;

        const effect = function* () {
            result = yield call((function* () {
                return yield call((function* () {
                    return yield call(
                        async () => await returnAfter(10, 'value'));
                })::map(x => x));
            })::map(x => x)::map(x => x));
        };
        await runEffect(effect, dispatch);

        expect(result).toEqual('value');
    });

    ait('should return array value from promises in call via multiple maps', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result1, result2;

        const effect = function* () {
            [result1, result2] = yield call((function* () {
                return yield call((function* () {
                    return yield [
                        call(async () => await returnAfter(10, 'value1')),
                        call(async () => await returnAfter(10, 'value2')),
                    ];
                })::map(x => x));
            })::map(x => x)::map(x => x));
        };
        await runEffect(effect, dispatch);

        expect(result1).toEqual('value1');
        expect(result2).toEqual('value2');
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
                            yield call(async () =>
                                await rejectAfter(10, 'inner-error'));
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

    ait('should execute and combine array of effects', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result1, result2;
        const effect = function* () {
            [result1, result2] = yield [
                call(function* () {
                    return 'value1';
                }),
                call(function* () {
                    return 'value2';
                }),
            ];
        };

        await runEffect(effect, dispatch);

        expect(result1).toEqual('value1');
        expect(result2).toEqual('value2');
    });

    ait('should execute and combine array of effects via mapped effect to array', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result1, result2;
        const effect = function* () {
            [result1, result2] = yield { type: 'MappedToArray' };
        };
        const mappedEffect = effect
            ::mapIf(
                x => x.type === 'MappedToArray',
                () => ([
                    call(function* () {
                        return 'value1';
                    }),
                    call(function* () {
                        return 'value2';
                    }),
                ]));
        await runEffect(mappedEffect, dispatch);

        expect(result1).toEqual('value1');
        expect(result2).toEqual('value2');
    });

    ait('should execute and combine array of effects via mapped effect to call with array', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        let result1, result2;
        const effect = function* () {
            [result1, result2] = yield { type: 'MappedToArray' };
        };
        const mappedEffect = effect
            ::mapIf(
                x => x.type === 'MappedToArray',
                () => call(function* () {
                    return yield [
                        call(function* () {
                            return 'value1';
                        }),
                        call(function* () {
                            return 'value2';
                        }),
                    ];
                }));
        await runEffect(mappedEffect, dispatch);

        expect(result1).toEqual('value1');
        expect(result2).toEqual('value2');
    });

    ait('should process fork asynchronously', async () => {
        const dispatch = jasmine.createSpy('dispatch');

        const effect = function* () {
            const task = yield fork(function* () {
                yield call(async () => returnAfter(10));
                yield put({ type: 'ActionInFork' });
            });
            yield put({ type: 'Action' });
            yield join(task);
            yield put({ type: 'ActionAfterJoin' });
        };
        await runEffect(effect, dispatch);

        expect(dispatch.calls.allArgs()).toEqual([
            [{ type: 'Action' }],
            [{ type: 'ActionInFork' }],
            [{ type: 'ActionAfterJoin' }],
        ]);
    });

    ait('should return value on select state', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        const getState = jasmine
            .createSpy('getState')
            .and.callFake(() => 'value');
        let selectedState = null;

        const effect = function* () {
            selectedState = yield select();
        };
        await runEffect(effect, dispatch, getState);

        expect(getState).toHaveBeenCalled();
        expect(selectedState).toEqual('value');
    });

    ait('should do nothing on noop', async () => {
        const dispatch = jasmine.createSpy('dispatch');
        const getState = jasmine
            .createSpy('getState')
            .and.callFake(() => 'value');

        const effect = function* () {
            yield noop();
        };
        await runEffect(effect, dispatch, getState);

        expect(getState.calls.any()).toBeFalsy();
        expect(dispatch.calls.any()).toBeFalsy();
    });

    ait('should process take by type', async () => {
        const actionObservable = new ActionsObservable();
        let actionTaken = false;

        const effect = function* () {
            yield take('Action');
            actionTaken = true;
        };
        const runEffectPromise = runEffect(effect, null, null, actionObservable);

        actionObservable.notify({ type: 'OtherAction' });
        await returnAfter(10);
        expect(actionTaken).toBeFalsy();

        actionObservable.notify({ type: 'Action' });
        await returnAfter(10);
        expect(actionTaken).toBeTruthy();

        await runEffectPromise;
    });

    ait('should process take by regex', async () => {
        const actionObservable = new ActionsObservable();
        const takenActions = [];

        const effect = function* () {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const action = yield take(/^(The)?Action$/i);
                takenActions.push(action);
            }
        };
        runEffect(effect, null, null, actionObservable);

        // TODO: to pass `await nextTick()` is mandatory. Is this problem?
        actionObservable.notify({ type: 'TheAction' });
        await nextTick();
        actionObservable.notify({ type: 'Action' });
        await nextTick();
        actionObservable.notify({ type: 'AnAction' });
        await nextTick();
        actionObservable.notify({ type: 'THeACtIon' });

        await returnAfter(10);
        expect(takenActions).toEqual([
            { type: 'TheAction' },
            { type: 'Action' },
            { type: 'THeACtIon' },
        ]);
    });

    ait('should process take by regex', async () => {
        const actionObservable = new ActionsObservable();
        const takenActions = [];

        const effect = function* () {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const action = yield take(['TheAction', 'Action']);
                takenActions.push(action);
            }
        };
        runEffect(effect, null, null, actionObservable);

        // TODO: to pass `await nextTick()` is mandatory. Is this problem?
        actionObservable.notify({ type: 'TheAction' });
        await nextTick();
        actionObservable.notify({ type: 'Action' });
        await nextTick();
        actionObservable.notify({ type: 'AnAction' });
        await nextTick();
        actionObservable.notify({ type: 'THeACtIon' });

        await returnAfter(10);
        expect(takenActions).toEqual([
            { type: 'TheAction' },
            { type: 'Action' },
        ]);
    });
});
