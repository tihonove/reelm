import { createStore } from 'redux';
import { reelmRunner, spoiled, scoped } from '../../src/index';
import { put, take } from '../../src/effects';
import { defineReducer, perform } from '../../src/fluent';

const nextTick = () => new Promise(x => setTimeout(x, 0));

describe('ReelmRunner', () => {
    it('should not affect normal reducers', () => {
        const reducer = jasmine.createSpy('reducer');

        const store = createStore(reducer, reelmRunner());
        store.dispatch({ type: 'Action' });

        expect(reducer.calls.allArgs()).toEqual([
            [undefined, { type: '@@redux/INIT' }],
            [undefined, { type: 'Action' }],
        ]);
    });

    ait('should returns Promise from dispatch', async () => {
        const reducer = defineReducer({})
            .always(perform(function* () {
                return 1;
            }));

        const store = createStore(reducer, reelmRunner());
        const dispatchResult = store.dispatch({ type: 'Action' });

        expect(dispatchResult.then).toBeDefined();
        await dispatchResult;
    });

    it('should allow handle exceptions in different levels', () => {
        const reducer = jasmine.createSpy('reducer');

        const store = createStore(reducer, reelmRunner());
        store.dispatch({ type: 'Action' });

        expect(reducer.calls.allArgs()).toEqual([
            [undefined, { type: '@@redux/INIT' }],
            [undefined, { type: 'Action' }],
        ]);
    });

    ait('should execute mapped perform with single effect', async () => {
        const nestedReducer = defineReducer({})
            .on('Action', perform(put({ type: 'PostAction' })));
        const reducer = jasmine.createSpy('reducer')
            .and.callFake(defineReducer({})
            .scopedOver('Namespace', ['value'], nestedReducer));

        const store = createStore(reducer, reelmRunner());

        await store.dispatch({ type: 'Namespace.Action' });

        expect(reducer.calls.allArgs()).toEqual([
            [undefined, { type: '@@redux/INIT' }],
            [{ value: {} }, { type: 'Namespace.Action' }],
            [{ value: {} }, { type: 'Namespace.PostAction' }],
        ]);
    });

    ait('should return convert action from take effects', async () => {
        let yieldedAction = null;
        const reducer = (state, action) => spoiled(state, function* () {
            if (action.type === 'SomeAction') {
                yieldedAction = yield take(x => x.type === 'ActionToTake');
            }
        });

        const store = createStore(scoped('Namespace')(reducer), reelmRunner());

        store.dispatch({ type: 'Namespace.SomeAction' });
        await nextTick();
        store.dispatch({ type: 'Namespace.ActionToTake' });
        await nextTick();

        expect(yieldedAction).toEqual({ type: 'ActionToTake', match: { Namespace: { } } });
    });

    ait('should return convert action from take effects with double scoped', async () => {
        let yieldedAction = null;
        const reducer = (state, action) => spoiled(state, function* () {
            if (action.type === 'SomeAction') {
                yieldedAction = yield take(x => x.type === 'ActionToTake');
            }
        });

        const store = createStore(scoped('Namespace1')(scoped('Namespace2')(reducer)), reelmRunner());

        store.dispatch({ type: 'Namespace1.Namespace2.SomeAction' });
        await nextTick();
        store.dispatch({ type: 'Namespace1.Namespace2.ActionToTake' });
        await nextTick();

        expect(yieldedAction).toEqual({ type: 'ActionToTake', match: { Namespace1: {}, Namespace2: {} } });
    });

    ait('should return convert action from take effects with dynamic scopes', async () => {
        let yieldedAction = null;
        const reducer = (state, action) => spoiled(state, function* () {
            if (action.type === 'SomeAction') {
                yieldedAction = yield take(x => x.type === 'ActionToTake');
            }
        });

        const store = createStore(scoped('Namespace1')(scoped('Namespace2.[Value].Namespace3')(reducer)), reelmRunner());

        store.dispatch({ type: 'Namespace1.Namespace2.2.Namespace3.SomeAction' });
        await nextTick();
        store.dispatch({ type: 'Namespace1.Namespace2.2.Namespace3.ActionToTake' });
        await nextTick();

        expect(yieldedAction).toEqual({ type: 'ActionToTake', match: { Namespace1: {}, ['Namespace2.[Value].Namespace3']: { Value: '2' } } });
    });
});
