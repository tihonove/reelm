import unwrap from './patterns/unwrap'

export default function conditional(pattern) {
    var compiledUnwrap = unwrap(pattern);

    return function (reducer) {
        return function conditionalReducer(state, action) {
            if (!action)
                return state;
            var unwrappedAction = compiledUnwrap(action);
            if (unwrappedAction)
                return reducer(state, { ...unwrappedAction, match: unwrappedAction.match[pattern] })
            return state;
        }
    }
}