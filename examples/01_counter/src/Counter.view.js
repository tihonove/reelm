import React, { PropTypes } from 'react';

import { Increment, Decrement } from './Counter.reducer';

export default function Counter({ dispatch, value }) {
    const onIncrement = () => dispatch({ type: Increment });
    const onDecrement = () => dispatch({ type: Decrement });

    return (<div>
        <button onClick={onDecrement}>-</button>
        {value}
        <button onClick={onIncrement}>+</button>
    </div>);
}

Counter.propTypes = {
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
};
