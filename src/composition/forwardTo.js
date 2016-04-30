export default (dispatch, ...types) => {
    if (types.length === 0) {
        return dispatch;
    }

    if (types.some(type => type.toString().indexOf('.') >= 0)) {
        throw new Error('Action type can\'t contain dot');
    }

    return action => dispatch({
        ...action,
        type: `${types.reduce((memo, type) => `${memo}${type}.`, '')}${action.type}`,
    });
};
