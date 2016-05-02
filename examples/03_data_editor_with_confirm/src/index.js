import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import { reelmRunner } from 'reelm';

import SinlgePersonEditApplication
    from './containers/SinlgePersonEditApplication';
import singlePersonEditReducer from './reducers/singlePersonEditReducer';

const store = createStore(singlePersonEditReducer,
    compose(reelmRunner(), applyMiddleware(createLogger())));

ReactDom.render(
    <Provider store={store}>
        <SinlgePersonEditApplication />
    </Provider>,
    document.getElementById('content'));
