import { createStore } from 'redux';

// public api imports
import {
    reelmRunner,
    pipeReducers,
    //over,
    //scoped,
    //conditional,
} from '../../index';

import {
    defineReducer,
    perform,
} from '../../fluent';

describe('Public interface', () => {
    ait('should contain reelmRunner that should not call reducers', async () => {
        const reducer = jasmine.createSpy('reducer');

        const store = createStore(reducer, reelmRunner());
        await store.dispatch({ type: 'Action' });

        expect(reducer.calls.allArgs()).toEqual([
            [undefined, { type: '@@redux/INIT' }],
            [undefined, { type: 'Action' }],
        ]);
    });

    ait('should contain reelmRunner that should returns Promise from dispatch', async () => {
        const reducer = defineReducer({})
            .always(perform(function* effect() {
                return 1;
            }));

        const store = createStore(reducer, reelmRunner());
        const dispatchResult = store.dispatch({ type: 'Action' });

        expect(dispatchResult.then).toBeDefined();
        await dispatchResult;
    });

    it('should contain pipeReducers', async () => {
        const reducer = jasmine
        .createSpy('reducer')
        .and.callFake(state => state);

        const pipedReducer = pipeReducers(reducer);

        expect(pipedReducer('state', 'action')).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
    });
});
