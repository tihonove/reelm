import { extractState, extractEffects, spoiled, isSpoiledState } from '../utils/spoiled-state-utils';
import { composeEffects } from '../utils/effects-utils';

const assignTo = nextSpoiledState => spoiledState => {
    if (!isSpoiledState(spoiledState) && !isSpoiledState(spoiledState)) {
        return spoiledState;
    }
    return spoiled(
        extractState(spoiledState),
        composeEffects(extractEffects(nextSpoiledState), extractEffects(spoiledState))
    );
};

export function lift(stateReducer, effectsReducer) {
    return function leftedFunction(spoiledStateOrState) {
        if (isSpoiledState(spoiledStateOrState)) {
            return spoiled(
                stateReducer(extractState(spoiledStateOrState)),
                effectsReducer(extractEffects(spoiledStateOrState))
            );
        }
        return stateReducer(spoiledStateOrState);
    };
}

export function compose(...functons) {
    return functons.reduce((result, func) => (...args) => result(func(...args)), x => x);
}

export function pipe(...functons) {
    return functons.reduceRight((result, func) => (...args) => result(func(...args)), x => x);
}

export function overState(stateReducer) {
    return lift(stateReducer, x => x);
}

export function overEffects(effectsReducer) {
    return lift(x => x, effectsReducer);
}

export function pipeReducers(...reducers) {
    return (state, action) => {
        const reducersChain = reducers
            .map(reducer => state => reducer(state, action))
            .map(reducer => state => pipe(extractState, reducer, assignTo(state))(state));
        return pipe(...reducersChain)(state);
    };
}
