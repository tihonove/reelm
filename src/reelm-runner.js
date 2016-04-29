import ActionsObservable from './utils/self-made-actions-observable'
import { splitSpoiledState } from './utils/spoiled-state-utils'
import runEffectGenerator from './effects-runner'

export default function reelmRunner() {
    return (next) => (reducer, initialState, enhancer) => {
        var lastEffect = null;
        var actionsObservable = new ActionsObservable();

        var store = next((...args) => { 
            var [state, effects] = splitSpoiledState(reducer(...args));
            lastEffect = effects;
            return state;
        }, initialState, enhancer);

        function dispatch(action) {
            store.dispatch(action);
            actionsObservable.notify(action)
            return runEffectGenerator(lastEffect, dispatch, ::store.getState, actionsObservable);
        }

        return {
            ...store,
            dispatch
        }
    }
}