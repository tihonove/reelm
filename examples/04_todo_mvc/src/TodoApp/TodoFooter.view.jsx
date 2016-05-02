import React from 'react';
import classNames from 'classnames';

export default function TodoFooter({ activeCount, completedCount, filter }) {
    return (
        <footer className='footer'>
            <span className='todo-count'>
                <strong>{activeCount}</strong>
                {' '}{pluralize(activeCount, 'item')} left
            </span>
            <ul className='filters'>
                <li>
                    <FilterLink
                      filterType={'All'} text='All'
                      currentFilter={filter} />
                </li>
                <li>
                    <FilterLink
                      filterType={'Active'} text='Active'
                      currentFilter={filter} />
                </li>
                <li>
                    <FilterLink
                      filterType={'Completed'} text='Completed'
                      currentFilter={filter} />
                </li>
            </ul>
            {(completedCount > 0)
                ? <button className='clear-completed'>Clear completed</button>
                : null}
        </footer>
    );
}

// eslint-disable-next-line react/no-multi-comp
function FilterLink({filterType, text, currentFilter}) {
    const className = classNames({ selected: currentFilter === filterType });
    return <a href='#/' className={className}>{text}</a>;
}

function pluralize(count, word) {
    return count === 1 ? word : word + 's';
}
