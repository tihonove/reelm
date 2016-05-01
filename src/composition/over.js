import { effectType } from '../effect-creators';

import { mapIf } from '../map-effects';
import { compose, overState, overEffects } from '../utils/reducer-utils';
import { getIn, setIn } from '../utils/immutable-utils';

const transformSelect = selector =>
    selectEffect => ({
        ...selectEffect,
        selector: compose(selectEffect.selector, selector),
    });

const isSelect = effect => effect.type === effectType.SELECT;

const lens = (getter, setter) => ({ getter, setter });

function createPropLens(path) {
    return lens(
        target => getIn(target, path),
        target => value => setIn(target, path, value)
    );
}

function createSubsetLens(subsetDef, getInitialState) {
    const subsetPaths = Object
        .getOwnPropertyNames(subsetDef)
        .map(prop => [prop, subsetDef[prop]]);
    return lens(
        state => {
            return subsetPaths
                .map(([prop, path]) => [prop, getIn(state, path)])
                .filter(([, value]) => value !== undefined)
                .reduce((focus, [prop, value]) =>
                    setIn(focus, [prop], value), getInitialState());
        },
        target => value => {
            return subsetPaths
                .reduce((state, [prop, path]) =>
                    setIn(state, path, getIn(value, [prop])),
                    target);
        }
    );
}

function createLens(lensDefintion, getInitialState) {
    if (Array.isArray(lensDefintion)) {
        return createPropLens(lensDefintion);
    }
    return createSubsetLens(lensDefintion, getInitialState);
}

export default function over(lensDefintion, initialState) {
    return function reducerWrapper(reducer) {
        const lens = createLens(
            lensDefintion, initialState ? (() => initialState) : reducer);
        const transformEffects =
            effects => effects::mapIf(isSelect, transformSelect(lens.getter));

        return function overReducer(state, action) {
            return compose(
                overState(lens.setter(state)),
                overEffects(transformEffects),
                x => reducer(x, action),
                lens.getter
                )(state);
        };
    };
}
