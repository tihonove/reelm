import React from 'react';
import ReactDom from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import createLogger from 'redux-logger';

import { reelmRunner } from 'reelm';

import reducer from './PairOfCounters.reducer';
import PairOfCounters from './PairOfCounters.view';

const PairOfCountersConnected = connect(state => state)(PairOfCounters);

const store = createStore(reducer,
    compose(reelmRunner(), applyMiddleware(createLogger())));

ReactDom.render(
    <Provider store={store}>
        <PairOfCountersConnected />
    </Provider>,
    document.getElementById('content'));
