import { createStore } from 'redux';
import { reelmRunner } from '../../src/index';
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
});
