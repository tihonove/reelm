import React from 'react';
import { connect } from 'react-redux';
import { forwardTo } from 'reelm';

import TodoItem from './TodoItem.view';
import TodoFooter from './TodoFooter.view';

const ENTER_KEY = 13;

const TodoFilter = {
    All: 'All',
    Active: 'Active',
    Completed: 'Completed',
};

function TodoApp({ todos,
    newTodoText, activeTodoCount,
    completedTodoCount, currentTodoFilter,
    dispatch }) {
    const onNewTodoChange = text => dispatch({
        type: 'NewTodo.Change',
        text: text });
    const onCreateTodo = text => dispatch({
        type: 'CreateTodo',
        text: text });

    return (
        <div>
            <header className='header'>
                <h1>todos</h1>
                <input
                  className='new-todo'
                  placeholder='What needs to be done?'
                  value={newTodoText}
                  onKeyDown={onKey({
                    [ENTER_KEY]: e => onCreateTodo(e.target.value),
                  })}
                  onChange={e => onNewTodoChange(e.target.value)}
                  autoFocus />
            </header>
            <section className='main'>
                <input
                  className='toggle-all'
                  type='checkbox'
                  checked />
                <ul className='todo-list'>
                    {todos.map((todo, index) => (
                        (<TodoItem
                          key={index}
                          todo={todo}
                          dispatch={forwardTo(dispatch, 'TodoItems', index)}
                          editing={false}/>)))}
                </ul>
            </section>
            <TodoFooter
              activeCount={activeTodoCount}
              completedCount={completedTodoCount}
              filter={currentTodoFilter} />
        </div>);
}

function onKey(keyMap) {
    return function(e, ...args) {
        if (keyMap[e.keyCode]) {
            keyMap[e.keyCode](e, ...args);
        }
    };
}

function TodoAppSelector(state) {
    return ({
        todos: state.get('todoItems').toJS(),
        activeTodoCount: state.get('todoItems').toJS().filter(x => !x.completed).length,
        completedTodoCount: state.get('todoItems').toJS().filter(x => x.completed).length,
        currentTodoFilter: TodoFilter.All,
        newTodoText: state.get('newTodoText'),
    });
}

export default connect(TodoAppSelector)(TodoApp);
