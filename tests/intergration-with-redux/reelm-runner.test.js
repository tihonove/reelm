import { createStore } from 'redux'
import { reelmRunner } from '../../src/index'
import { defineReducer, perform } from '../../src/fluent'

describe("ReelmRunner", () => {
    it("should not affect normal reducers", () => {
        var reducer = jasmine.createSpy('reducer');

        var store = createStore(reducer, reelmRunner());
        store.dispatch({ type: 'Action' });
        
        expect(reducer.calls.allArgs()).toEqual([
            [ undefined, { type: '@@redux/INIT' } ],
            [ undefined, { type: 'Action' } ]
        ])
    })

    ait("should returns Promise from dispatch", async () => {
        var reducer = defineReducer({})
            .always(perform(function *() { return 1 }));

        var store = createStore(reducer, reelmRunner());
        var dispatchResult = store.dispatch({ type: 'Action' });
        
        expect(dispatchResult.then).toBeDefined();
        await dispatchResult;
    })

    it("should allow handle exceptions in different levels", () => {
        var reducer = jasmine.createSpy('reducer');

        var store = createStore(reducer, reelmRunner());
        store.dispatch({ type: 'Action' });
        
        expect(reducer.calls.allArgs()).toEqual([
            [ undefined, { type: '@@redux/INIT' } ],
            [ undefined, { type: 'Action' } ]
        ])
    })

})