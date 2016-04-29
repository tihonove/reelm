import conditional from '../composition/conditional'
import scoped from '../composition/scoped'
import over from '../composition/over'

import { map } from '../utils/effects-utils'
import { splitSpoiledState } from '../utils/spoiled-state-utils';
import { pipeReducers, compose, pipe, overEffects } from '../utils/reducer-utils';

export default function defineReducer(initialState) {
    const updaters = [];
    const effectSelectors = [];
    var composedReducer;

    const resultReducer = (state = initialState, action) => {
        if (!composedReducer)
            composedReducer = pipe(pipeReducers(...updaters), overEffects(pipe(...effectSelectors)));

        if (!action)
            return state;
        return composedReducer(state, action);
    }

    resultReducer.on = (pattern, reducer) => {

        updaters.push(conditional(pattern)(reducer));
        return resultReducer;
    }

    resultReducer.always = (reducer) => {
        updaters.push(reducer);
        return resultReducer;
    }

    resultReducer.scopeTo = (pattern, stateSubSetDefinition, reducer) => {
        if (typeof stateSubSetDefinition === 'function') {
            updaters.push(scoped(pattern)( (state, action) => {
                return over(stateSubSetDefinition(action.match))(reducer)(state, action)
            } ));
        }
        else {
            updaters.push(scoped(pattern)(over(stateSubSetDefinition)(reducer)));
        }
        return resultReducer;
    }

    resultReducer.mapEffects = (effectsSelector) => {
        effectSelectors.push(effects => effects::map(effectsSelector));
        return resultReducer;
    }

    return resultReducer;
}
