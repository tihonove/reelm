import { Map } from 'immutable';
import { List } from 'immutable';
import { spoiled } from 'reelm';
import { put } from  'reelm/effects';
import { defineReducer } from 'reelm/fluent';


export const Change = 'Change';
export const Add = 'Add';
export const Delete = 'Delete';
export const TodoItems = 'TodoItems';

const todoItemReducer = defineReducer(Map({}))
    .on(Change, (state, { data }) => state.mergeDeep(data));

const todoItemListReducer = defineReducer(List())
    .scopedOver('[Index]', ({ Index }) => ([Index]), todoItemReducer)
    .on('Add', (list, { item }) => list.push(Map(item)))
    .on('[Index].Delete', (list, { match: { Index } }) => list.delete(Index));

export default defineReducer(Map({ newTodoText: '' }))
    .scopedOver(TodoItems, ['todoItems'], todoItemListReducer)
    .on('NewTodo.Clear', state => state.set('newTodoText', ''))
    .on('NewTodo.Change', (state, { text }) => state.set('newTodoText', text))
    .on('CreateTodo', (state, { text }) => spoiled(state, function* () {
        yield put({ type: 'TodoItems.Add', item: { title: text, completed: false } });
        yield put({ type: 'NewTodo.Clear' });
    }));

