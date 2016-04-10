import { noop } from './effects'
import { map } from './generator-extensions'

const isEffected = effectedStateOrState => !!effectedStateOrState["@@Effected"]

const lift = effectedStateOrState => isEffected(effectedStateOrState) ? effectedStateOrState : create(effectedStateOrState, noop())

const create = (state, effect = null) =>
    ({
        ["@@Effected"]: true,
        state: state,
        effect: effect || noop()
    });

const getEffect = effectedStateOrState => isEffected(effectedStateOrState) ? effectedStateOrState.effect : noop();

const getState = effectedStateOrState => isEffected(effectedStateOrState) ? effectedStateOrState.state : effectedStateOrState;

function mapEffect(transformer) {
    var effectedStateOrState = this;
    if (isEffected(effectedStateOrState))
        return create(getState(effectedStateOrState), getEffect(effectedStateOrState)::map(transformer))
    else 
        return effectedStateOrState;
}

export default {
    isEffected,
    lift,
    compose,
    create,
    getEffect,
    getState,
    split
};