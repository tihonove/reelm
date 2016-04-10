import { effectType } from './effects'

export function sideEffectToGenerator(sideEffect = null){
    if (!sideEffect)
        return function*() {}
    if (typeof sideEffect === 'function')
        return sideEffect;
    if (typeof sideEffect === 'object')
        return function*() {
            yield sideEffect;
        }
    return function*() {
        for(var i of sideEffect)
            yield i;
    }
}

export function map(transformer) {
    var sideEffect = this;
    return function* () {
        var generator = sideEffectToGenerator(sideEffect)();
        var nextArgument = undefined;
        while(true) {
            var next = generator.next(nextArgument);
            if (next.done)
                return next.value;
            if (next.value.type === effectType.FORK || next.value.type === effectType.CALL)
                nextArgument = yield { ...next.value, generator: next.value.generator::map(transformer) };
            else
                nextArgument = yield transformer(next.value);
        }        
    }
}
