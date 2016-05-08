import spoiled from '../spoiled';

export default function perform(effects) {
    if (typeof effects === 'function') {
        return function reducerWithEffectOnly(state, action) {
            return spoiled(state, function* () {
                return yield* effects(action);
            });
        };
    }
    return function reducerWithEffectOnly(state) {
        return spoiled(state, effects);
    };
}
