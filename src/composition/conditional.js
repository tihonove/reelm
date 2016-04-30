import unwrap from './patterns/unwrap';

export default function conditional(pattern) {
    const compiledUnwrap = unwrap(pattern);

    return function conditionalReducerWrapper(reducer) {
        return function conditionalReducer(state, action) {
            if (!action) {
                return state;
            }
            const unwrappedAction = compiledUnwrap(action);
            if (unwrappedAction) {
                return reducer(state, { ...unwrappedAction, match: unwrappedAction.match[pattern] });
            }
            return state;
        };
    };
}
