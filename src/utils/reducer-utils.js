import spoiled from '../spoiled';
import { composeEffects } from '../utils/effects-utils';

const assignTo = prevState => nextState => {
    if (!spoiled.isSpoiled(prevState) && !spoiled.isSpoiled(nextState)) {
        return nextState;
    }
    return spoiled(
        spoiled.extractState(nextState),
        composeEffects(
            spoiled.extractEffects(prevState),
            spoiled.extractEffects(nextState))
    );
};

function lift(stateReducer, effectsReducer) {
    return function leftedFunction(spoiledStateOrState) {
        if (spoiled.isSpoiled(spoiledStateOrState)) {
            return spoiled(
                stateReducer(spoiled.extractState(spoiledStateOrState)),
                effectsReducer(spoiled.extractEffects(spoiledStateOrState))
            );
        }
        return stateReducer(spoiledStateOrState);
    };
}

export function compose(...functons) {
    return functons
        .reduce(
            (result, func) => (...args) => result(func(...args)),
            x => x);
}

export function pipe(...functons) {
    return functons
        .reduceRight(
            (result, func) => (...args) => result(func(...args)),
            x => x);
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
            .map(reducer => state =>
                reducer(state, action))
            .map(reducer => state =>
                pipe(spoiled.extractState, reducer, assignTo(state))(state));
        return pipe(...reducersChain)(state);
    };
}
