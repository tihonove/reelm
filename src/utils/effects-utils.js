import { fork, effectType } from '../effects'

export function composeEffects(...effects) {
    return function* () {
        for(var effect of effects) {
            yield fork(effect);
        }
    }
}

export function effectsToGenerator(effect = null){
    if (!effect)
        return function*() {}
    if (typeof effect === 'function')
        return effect;
    if (typeof effect === 'object')
        return function*() {
            yield effect;
        }
    return function*() {
        for(var i of effect)
            yield i;
    }
}

export function map(selector) {
    var effects = this;
    return function* () {
        var generator = effectsToGenerator(effects)();
        var nextArgument = undefined;
        while(true) {
            var next = generator.next(nextArgument);
            if (next.done)
                return next.value;
            if (next.value.type === effectType.FORK || next.value.type === effectType.CALL)
                nextArgument = yield { ...next.value, generator: next.value.generator::map(selector) };
            else
                nextArgument = yield selector(next.value);
        }        
    }
}

export function mapIf(condition, func) {
    return this::map(x => condition(x) ? func(x) : x);
}
