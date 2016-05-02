import { defineReducer } from 'reelm/fluent';

export const Increment = 'Increment';
export const Decrement = 'Decrement';

export default defineReducer(0)
    .on(Increment, x => x + 1)
    .on(Decrement, x => x - 1);
