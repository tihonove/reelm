import unwrap from './patterns/unwrap';
import wrap from './patterns/wrap';
import { effectType } from '../effects';

import { map } from '../map-effects';
import { overEffects, compose } from '../utils/reducer-utils';

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
    return function effectSelector(sideEffect) {
        if (sideEffect.type === effectType.PUT) {
            sideEffect.action = wrap(sideEffect.action, pattern, match);
        }
        return sideEffect;
    };
}

function keysEquals(obj1 = {}, obj2 = {}) {
    return (
        Object
            .getOwnPropertyNames(obj1)
            .map(prop => obj1[prop] === obj2[prop])
            .reduce((x, y) => x && y, true) &&
        Object
            .getOwnPropertyNames(obj2)
            .map(prop => obj1[prop] === obj2[prop])
            .reduce((x, y) => x && y, true)
    );
}

function createTakeOrUndefined(compiledUnwrap, pattern, match) {
    return function effectSelector(action) {
        const unwrappedAction = compiledUnwrap(action);
        const matches = unwrappedAction &&
            (unwrappedAction.type !== '' || action.type === pattern);
        if (matches) {
            if (keysEquals(unwrappedAction.match[pattern], match)) {
                return unwrappedAction;
            }
        }
        return undefined;
    };
}

function convertTakes(compiledUnwrap, pattern, match) {
    const takeOrUndefined = createTakeOrUndefined(
        compiledUnwrap, pattern, match);
    return function effectSelector(sideEffect) {
        if (sideEffect.type === effectType.TAKE) {
            const oldCondition = sideEffect.condition;
            sideEffect.condition = action => {
                const unwrapped = takeOrUndefined(action);
                if (!unwrapped) {
                    return false;
                }
                return oldCondition(unwrapped);
            };
        }
        return sideEffect;
    };
}

function isGloablAction(action) {
    return action.type && action.type.startsWith('@@');
}

export default function scoped(pattern) {
    const compiledUnwrap = unwrap(pattern);

    return function reducerWrapper(reducer) {
        return (state, action) => {
            const unwrappedAction = compiledUnwrap(action);
            const matches = unwrappedAction &&
                (unwrappedAction.type || action.type === pattern);

            if (matches) {
                const scopedAction = {
                    ...unwrappedAction,
                    match: unwrappedAction.match[pattern],
                };
                const trasformEffects = scopedEffectsTransformer(
                    compiledUnwrap, pattern, unwrappedAction.match[pattern]);
                return compose(
                    overEffects(trasformEffects),
                    state => reducer(state, scopedAction)
                )(state);
            }
            else if (isGloablAction(action) && !isDynamicPattern(pattern)) {
                const trasformEffects = scopedEffectsTransformer(
                    compiledUnwrap, pattern, {});
                return compose(
                    overEffects(trasformEffects),
                    state => reducer(state, action)
                )(state);
            }
            return state;
        };
    };
}
