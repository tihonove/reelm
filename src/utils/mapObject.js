/**
 * map over plain object own keys
 *
 * @param {function} mapper
 * @param {Object} obj target object
 */
export const mapObject = (mapper, obj) => Object.keys(obj).reduce(
    (result, key) => Object.assign(obj, { [key]: mapper(obj[key]) }), {}
);
