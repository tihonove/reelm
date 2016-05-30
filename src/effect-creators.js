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
};

function normalizeTakeCondition(takeArgument) {
    if (typeof takeArgument === 'string') {
        return action => action.type === takeArgument;
    }
    else if (Array.isArray(takeArgument)) {
        return action => takeArgument.indexOf(action.type) >= 0;
    }
    else if (takeArgument instanceof RegExp) {
        return action => takeArgument.test(action.type);
    }
    return takeArgument;
}

export const noop = () => {
    return effect(effectType.NOOP);
};

export const select = (selector = x => x) => {
    return effect(effectType.SELECT, { selector });
};

export const fork = generator => {
    return effect(effectType.FORK, { generator });
};

export const call = generator => {
    return effect(effectType.CALL, { generator });
};

export const join = task => {
    return effect(effectType.JOIN, { task });
};

export const put = action => {
    return effect(effectType.PUT, { action });
};

export const take = conditionObject => {
    return effect(effectType.TAKE, {
        condition: normalizeTakeCondition(conditionObject),
        map: x => x,
    });
};
