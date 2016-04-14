import React from 'react'

export default function({dispatch, value}) {
    var onIncrement = () => dispatch({ type: 'Increment' });
    var onDecrement = () => dispatch({ type: 'Decrement' });

    return <div>
        <button onClick={onDecrement}>-</button>
        {value}
        <button onClick={onIncrement}>+</button>
    </div>
}
