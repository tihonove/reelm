import { createStore } from 'redux';
import { reelmRunner } from '../../src/index';
import { put } from '../../src/effects';
import { defineReducer, perform } from '../../src/fluent';

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
});
