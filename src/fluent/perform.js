import spoiled from '../spoiled';

export default function perform(effects) {
    return function reducerWithEffectOnly(state) {
        return spoiled(state, effects);
    };
}
