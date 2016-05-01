import unwrap from './patterns/unwrap';

export default function conditional(pattern) {
    const compiledUnwrap = unwrap(pattern);

    return function conditionalReducerWrapper(reducer) {
        return function conditionalReducer(state, action) {
            if (!action || action.type === undefined) {
                return state;
            }
            const unwrappedAction = compiledUnwrap(action);
            if (!unwrappedAction) {
                return state;
            }
            const actionWithMatch = {
                ...unwrappedAction,
                match: unwrappedAction.match[pattern],
            };
            return reducer(state, actionWithMatch);
        };
    };
}
