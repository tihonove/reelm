import { spoiled } from '../utils/spoiled-state-utils';

export default function perform(effects) {
    return function (state) {
        return spoiled(state, effects)
    }
}