import conditional from '../composition/conditional';
import scoped from '../composition/scoped';
import over from '../composition/over';

import { map } from '../map-effects';
import { pipeReducers, pipe, overEffects } from '../utils/reducer-utils';

export default function defineReducer(initialState) {
    const updaters = [];
    const effectSelectors = [];
    let composedReducer;

    const resultReducer = (state = initialState, action) => {
        if (!composedReducer) {
            composedReducer = pipe(
                pipeReducers(...updaters),
                overEffects(pipe(...effectSelectors))
            );
        }

        if (!action) {
            return state;
        }
        return composedReducer(state, action);
    };

    resultReducer.on = (pattern, reducer) => {
        updaters.push(conditional(pattern)(reducer));
        return resultReducer;
    };

    resultReducer.always = reducer => {
        updaters.push(reducer);
        return resultReducer;
    };

    resultReducer.scopeTo = (pattern, lensDefintion, reducer) => {
        if (typeof lensDefintion === 'function') {
            updaters.push(scoped(pattern)((state, action) => {
                const overReducer =
                    over(lensDefintion(action.match))(reducer);
                return overReducer(state, action);
            }));
        }
        else {
            updaters.push(scoped(pattern)(over(lensDefintion)(reducer)));
        }
        return resultReducer;
    };

    resultReducer.mapEffects = effectsSelector => {
        effectSelectors.push(effects => effects::map(effectsSelector));
        return resultReducer;
    };

    return resultReducer;
}
