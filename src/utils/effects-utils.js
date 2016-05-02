function flattenRecursive(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            result.push(...flattenRecursive(array[i]));
        }
        else {
            result.push(array[i]);
        }
    }
    return result;
}

export function composeEffects(...effects) {
    const nonEmptyEffects = flattenRecursive(effects)
        .filter(x => Boolean(x));
    if (nonEmptyEffects.length === 0) {
        return null;
    }
    if (nonEmptyEffects.length === 1) {
        return nonEmptyEffects[0];
    }
    return nonEmptyEffects;
}

export function effectsToGenerator(effect = null) {
    if (!effect) {
        return function* emptyGenerator() {};
    }
    if (typeof effect === 'function') {
        return effect;
    }
    return function* singleObjectGenerator() {
        return yield effect;
    };
}
