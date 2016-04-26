function effect(type, data = {}) {
    data.type = type;
    return data;
}

export const effectType = { 
    SELECT: 'SELECT',
    FORK: 'FORK',
    CALL: 'CALL',
    JOIN: 'JOIN',
    PUT: 'PUT',
    TAKE: 'TAKE',
    NOOP: 'NOOP',
    PROMISE: 'PROMISE',    
}

function normalizeTakeCondition(takeArgument) {
    if (typeof takeArgument === 'string') 
        return action => action.type === takeArgument;
    else if (Array.isArray(takeArgument))
        return action => takeArgument.indexOf(action.type) >= 0;
    else if (takeArgument instanceof RegExp)
        return action => takeArgument.test(action.type);
    return takeArgument;
}

export const noop = () => effect(effectType.NOOP)
export const select = (selector = x => x) => effect(effectType.SELECT, { selector })
export const fork = generator => effect(effectType.FORK, { generator })
export const call = generator => effect(effectType.CALL, { generator })
export const join = task => effect(effectType.JOIN, { task })
export const put = action => effect(effectType.PUT, { action })
export const take = conditionObject => effect(effectType.TAKE, { condition: normalizeTakeCondition(conditionObject) })
export const promise = promiseFunc => effect(effectType.PROMISE, { promiseFunc: promiseFunc })

export { map } from './utils/effects-utils'
