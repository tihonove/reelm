import unwrap from './patterns/unwrap'
import wrap from './patterns/wrap'
import { effectType } from '../effects'

import { map } from '../utils/effects-utils'
import { overEffects, compose } from '../utils/reducer-utils'

function isDynamicPattern(pattern) {
    return pattern.includes('[');
}

function scopedEffectsTransformer(compiledUnwrap, pattern, match) {
    return effects => 
        effects
            ::map(convertPuts(pattern, match))
            ::map(convertTakes(compiledUnwrap, pattern, match));
}

function convertPuts(pattern, match) {
    return function (sideEffect) {
        if (sideEffect.type === effectType.PUT) {
            sideEffect.action = wrap(sideEffect.action, pattern, match)
        }
        return sideEffect;
    }
}

function keysEquals(obj1 = {}, obj2 = {}) {
    return Object
            .getOwnPropertyNames(obj1)
            .reduce((result, prop) => result & obj1[prop] == obj2[prop], true)
        &&
        Object
            .getOwnPropertyNames(obj2)
            .reduce((result, prop) => result & obj1[prop] == obj2[prop], true)
}

function createTakeOrUndefined(compiledUnwrap, pattern, match)  {
    return function (action) {
        const unwrappedAction = compiledUnwrap(action);
        if (unwrappedAction && (unwrappedAction.type !== '' || action.type === pattern)) {
            if (keysEquals(unwrappedAction.match[pattern], match))
                return unwrappedAction;
        }
    }    
}

function convertTakes(compiledUnwrap, pattern, match) {
    var takeOrUndefined = createTakeOrUndefined(compiledUnwrap, pattern);
    return function (sideEffect) {
        if (sideEffect.type === effectType.TAKE) {
            var oldCondition = sideEffect.condition;
            sideEffect.condition = (action) => {
                var unwrapped = takeOrUndefined(action);
                if (!unwrapped)
                    return false;
                return oldCondition(unwrapped);
            }
        }
        return sideEffect;
    }
}

export default function scoped(pattern) {
    var compiledUnwrap = unwrap(pattern);

    return function (reducer) {

        return (state, action) => { 
            var unwrappedAction = compiledUnwrap(action);

            if (unwrappedAction && (unwrappedAction.type || action.type === pattern)) {
                return compose(
                    overEffects(scopedEffectsTransformer(compiledUnwrap, pattern, unwrappedAction.match[pattern])),
                    x => reducer(x, { ...unwrappedAction, match: unwrappedAction.match[pattern] })
                )(state)
            }
            else if (action.type.startsWith('@@') && !isDynamicPattern(pattern)){
                return compose(
                    overEffects(scopedEffectsTransformer(compiledUnwrap, pattern, {})),
                    x => reducer(x, action)
                )(state)
            }
            return state;
        }

    }
}