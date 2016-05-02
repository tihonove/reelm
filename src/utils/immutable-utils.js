export const getIn = (obj, path) => path.reduce(getWithFallBack, obj);

export function setIn(target, path, value) {
    if (target && target.setIn) {
        return target.setIn(path, value);
    }
    return immutableSet(target, path, value);
}

function getWithFallBack(obj, prop) {
    if (obj) {
        return obj.get ? obj.get(prop) : obj[prop];
    }
    return undefined;
}

function immutableSet(target, path, value) {
    const [prop, ...rest] = path;
    if (target && prop) {
        const copy = Array.isArray(target) ? [...target] : { ...target };
        copy[prop] = immutableSet(copy[prop], rest, value);
        return copy;
    }
    return path
        .reduceRight((result, prop) => ({ [prop]: result }), value);
}
