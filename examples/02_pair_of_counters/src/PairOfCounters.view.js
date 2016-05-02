import React, { PropTypes } from 'react';
import { forwardTo } from 'reelm';

import Counter from '../../01_counter/src/Counter.view';
import { FirstCounter, SecondCounter } from './PairOfCounters.reducer';

export default function PairOfCounters({ dispatch, firstValue, secondValue }) {
    return (<div>
        <Counter
          dispatch={forwardTo(dispatch, FirstCounter)}
          value={firstValue} />
        <hr />
        <Counter
          dispatch={forwardTo(dispatch, SecondCounter)}
          value={secondValue} />
    </div>);
}
PairOfCounters.propTypes = {
    dispatch: PropTypes.func.isRequired,
    firstValue: PropTypes.number.isRequired,
    secondValue: PropTypes.number.isRequired,
};
