import '../node_modules/todomvc-common/base.css';
import '../node_modules/todomvc-app-css/index.css';

import React from 'react';
import ReactDom from 'react-dom';
import { compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { reelmRunner } from 'reelm';


import TodoApp from './TodoApp/TodoApp.view';
import todoAppReducer from './TodoApp/TodoApp.reducer';

const store = createStore(todoAppReducer, compose(
    reelmRunner(),
    window.devToolsExtension ? window.devToolsExtension() : f => f));

const todos = [
    { completed: false, title: 'todo 1', id: 1 },
];

ReactDom.render(
    <Provider store={store}>
        <TodoApp todos={todos}/>
    </Provider>,
    document.getElementById('content'));
