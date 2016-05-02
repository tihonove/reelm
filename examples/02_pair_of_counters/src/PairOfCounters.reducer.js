import { defineReducer } from 'reelm/fluent';

import counterReducer from '../../01_counter/src/Counter.reducer';

export const FirstCounter = 'FirstCounter';
export const SecondCounter = 'SecondCounter';

export default defineReducer({})
    .scopedOver(FirstCounter, ['firstValue'], counterReducer)
    .scopedOver(SecondCounter, ['secondValue'], counterReducer);
