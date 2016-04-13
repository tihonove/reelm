function update(host, spec) {
  // If any of the branches of an object changed, then than object changed too: clone it.
  // The type of the copy is inferred.
  const copy = host
    ? Array.isArray(host) ? host.slice() : clone(host)
    : Array.isArray(spec) ? [] : {};

  for (let key in spec) {
    const specValue = spec[key];

    if (isObject(specValue)) {
      copy[key] = update(copy[key], specValue);
    }
    // Leaf update
    else {
      const newValue = (typeof specValue === 'function')
        ? specValue(copy[key])
        : specValue;

      copy[key] = newValue;
    }
  }

  return copy;
}

// Single path string update like: update(obj, 'path1.path2.name', 'John');
function immutableUpdate(host, paths, value) {
  const spec = {};
  let currentObj = spec;

  paths.forEach((path, index) => {
    if (index === paths.length - 1) currentObj[path] = value;
    else currentObj[path] = currentObj = {};
  });

  return update(host, spec);
}

function clone(obj) {
  const result = {};
  Object.keys(obj).forEach(key => { result[key] = obj[key] });
  return result;
}

function isObject(x) { return x && typeof x === 'object' && !Array.isArray(x) }


export function get(obj, prop) {
    return obj.getIn ? obj.getIn([prop]) : obj[prop];
}

export function getIn(obj, path) {
    if (!Array.isArray(path)) 
        path = path.split('.');
    return path.reduce(get, obj);
}

export function updateIn(target, path, updater) {
    if (target.updateIn) {
        return target.updateIn(path, subState => updater(subState));
    }
    else {
        return immutableUpdate(target, path, updater);
    }
}

