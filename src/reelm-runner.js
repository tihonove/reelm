import ActionsObservable from './utils/self-made-actions-observable';
import spoiled from './spoiled';
import runEffects from './effects-runner';

export default function reelmRunner() {
    return next => (reducer, initialState, enhancer) => {
        const actionsObservable = new ActionsObservable();

        let lastEffects = null;

        const store = next((...args) => {
            const [state, effects] = spoiled.split(reducer(...args));
            lastEffects = effects;
            return state;
        }, initialState, enhancer);

        function dispatch(action) {
            store.dispatch(action);
            actionsObservable.notify(action);
            const effectsPromise =
                runEffects(
                    lastEffects,
                    dispatch,
                    ::store.getState,
                    actionsObservable);
            return effectsPromise;
        }

        return {
            ...store,
            dispatch,
        };
    };
}
