import React from 'react';
import classNames from 'classnames';

const ENTER = 13;
const ESCAPE = 27;


export default function TodoItem({ todo, editing, dispatch }) {
    const onToggle = () => dispatch({ type: 'Change',
        data: { completed: !todo.completed } });
    const onEdit = text => dispatch({ type: 'Change', data: { title: text } });
    const onDelete = () => dispatch({ type: 'Delete' });
    const onBeginEdit = () => dispatch({ type: 'BeginEdit' });
    const onSubmitEdit = () => dispatch({ type: 'SubmitEdit' });
    const onCancelEdit = () => dispatch({ type: 'CancelEdit' });

    return (
        <li className={classNames({
            completed: todo.completed,
            editing: editing,
        })}>
            <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  checked={todo.completed}
                  onChange={onToggle} />
                <label onDoubleClick={onBeginEdit}>
                    {todo.title}
                </label>
                <button className='destroy' onClick={onDelete} />
            </div>
            <input
              className='edit'
              value={todo.title}
              onBlur={onSubmitEdit}
              onChange={onEdit}
              onKeyDown={onKey({
                  [ENTER]: onSubmitEdit,
                  [ESCAPE]: onCancelEdit,
              })} />
        </li>);
}

function onKey(keyMap) {
    return function(e, ...args) {
        if (keyMap[e.keyCode]) {
            keyMap[e.keyCode](e, ...args);
        }
    };
}
