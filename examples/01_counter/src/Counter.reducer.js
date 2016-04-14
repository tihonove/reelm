import { defineReducer } from 'reelm/composition'

export default defineReducer(0)
    .on('Increment', x => x + 1)
    .on('Decrement', x => x - 1);
