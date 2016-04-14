import React from 'react'
import { forwardTo } from 'reelm/composition'
import Counter from '../../01_counter/src/Counter.view'

export default function({ dispatch, firstCounter, secondCounter }) {
    return <div>
        <Counter dispatch={ forwardTo(dispatch, 'FirstCounter') } value={ firstCounter } />
        <hr />
        <Counter dispatch={ forwardTo(dispatch, 'SecondCounter') } value={ secondCounter } />
    </div>
}
