import { fork, effectType } from '../effects';

export function composeEffects(...effects) {
    return function* composedGenerator() {
        for (const effect of effects) {
            yield fork(effect);
        }
    };
}

export function effectsToGenerator(effect = null) {
    if (!effect) {
        return function* emptyGenerator() {};
    }
    if (typeof effect === 'function') {
        return effect;
    }
    if (typeof effect === 'object') {
        return function* singleObjectGenerator() {
            yield effect;
        };
    }
    return function* iterableToGenerator() {
        for (const i of effect) {
            yield i;
        }
    };
}

export function map(selector) {
    /* eslint-disable consistent-this */
    /* eslint-disable no-invalid-this */
    const effects = this;
    /* eslint-enable no-invalid-this */
    /* eslint-enable consistent-this */
    return function* mappedGenerator() {
        const generator = effectsToGenerator(effects)();
        if (generator.then) {
            yield generator;
            return undefined;
        }

        let next = generator.next();
        let nextArgument;
        while (!next.done) {
            try {
                if (next.value.type === effectType.FORK || next.value.type === effectType.CALL) {
                    nextArgument = yield { ...next.value, generator: next.value.generator::map(selector) };
                }
                else {
                    nextArgument = yield selector(next.value);
                }
                next = generator.next(nextArgument);
            }
            catch (error) {
                next = generator.throw(error);
            }
        }
        return next.value;
    };
}

export function mapIf(condition, func) {
    /* eslint-disable no-invalid-this */
    return this::map(x => condition(x) ? func(x) : x);
    /* eslint-enable no-invalid-this */
}
