import { spoiled } from '../utils/spoiled-state-utils';

export default function justEffects(effects) {
    return function (state) {
        return spoiled(state, effects)
    }
}