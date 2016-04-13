import { extractState, extractEffects, spoiled, isSpoiledState } from '../utils/spoiled-state-utils'
import { composeEffects } from '../utils/effects-utils'

export const assignTo = nextSpoiledState => spoiledState => {
    return spoiled(
        extractState(spoiledState),
        composeEffects(extractEffects(spoiledState), extractEffects(nextSpoiledState))
    );
}

export function lift(stateReducer, effectsReducer) {
 return function (spoiledStateOrState) {
     if (isSpoiledState(spoiledStateOrState)) {
         return spoiled(
             stateReducer(extractState(spoiledStateOrState)),
             effectsReducer(extractEffects(spoiledStateOrState))
         );             
     }    
     else {
         return stateReducer(spoiledStateOrState);
     }
 }    
}

export function compose(...functons) {
    return functons.reduce((r, f) => (...args) => r(f(...args)), x => x);
}

export function pipe(...functons) {
    return functons.reduceRight((r, f) => (...args) => r(f(...args)), x => x);
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
            .map(r => s => r(s, action))
            .map(r => s => pipe(extractState, r, assignTo(s))(s));
        return pipe(...reducersChain)(state);
    }
}
