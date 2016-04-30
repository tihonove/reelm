function containsDot(str) {
    return str.toString().indexOf('.') >= 0;
}

export default (dispatch, ...types) => {
    if (types.length === 0) {
        return dispatch;
    }
    if (types.some(containsDot)) {
        throw new Error('Action type can\'t contain dot');
    }

    const typePrefix = types.join('.');
    return action => dispatch({
        ...action,
        type: `${typePrefix}.${action.type}`,
    });
};
