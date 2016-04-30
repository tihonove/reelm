function update(host, spec) {
    let copy;

    if (host) {
        copy = Array.isArray(host) ? host.slice() : clone(host);
    }
    else {
        copy = Array.isArray(spec) ? [] : {};
    }

    for (const key in spec) {
        if (spec.hasOwnProperty(key)) {
            const specValue = spec[key];

            if (isObject(specValue)) {
                copy[key] = update(copy[key], specValue);
            }
            else {
                const newValue = (typeof specValue === 'function')
                    ? specValue(copy[key])
                    : specValue;
                copy[key] = newValue;
            }
        }
    }

    return copy;
}

// Single path string update like: update(obj, 'path1.path2.name', 'John');
function immutableUpdate(host, paths, value) {
    const spec = {};
    let currentObj = spec;

    paths.forEach((path, index) => {
        if (index === paths.length - 1) {
            currentObj[path] = value;
        }
        else {
            currentObj[path] = currentObj = {};
        }
    });

    return update(host, spec);
}

function clone(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        result[key] = obj[key];
    });
    return result;
}

function isObject(x) {
    return x && typeof x === 'object' && !Array.isArray(x);
}

export function get(obj, prop) {
    return obj.getIn ? obj.getIn([prop]) : obj[prop];
}

export function getIn(obj, path) {
    let splitPath = path;
    if (!Array.isArray(splitPath)) {
        splitPath = splitPath.split('.');
    }
    return splitPath.reduce(get, obj);
}

export function updateIn(target, path, updater) {
    if (target.updateIn) {
        return target.updateIn(path, subState => updater(subState));
    }
    return immutableUpdate(target, path, updater);
}
