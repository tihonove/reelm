import React from 'react';
import ReactDom from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import createLogger from 'redux-logger';

import { reelmRunner } from 'reelm';

import reducer from './Counter.reducer';
import Counter from './Counter.view';

const CounterConnected = connect(state => ({ value: state }))(Counter);

const store = createStore(
    reducer, compose(reelmRunner(), applyMiddleware(createLogger())));

ReactDom.render(
    <Provider store={store}>
        <CounterConnected />
    </Provider>,
    document.getElementById('content'));
