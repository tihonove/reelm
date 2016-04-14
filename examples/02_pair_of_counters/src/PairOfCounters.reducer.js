import { defineReducer } from 'reelm/composition'

import counterReducer from '../../01_counter/src/Counter.reducer'

export default defineReducer({})
    .scopeTo('FirstCounter', ['firstCounter'], counterReducer)
    .scopeTo('SecondCounter', ['secondCounter'], counterReducer)
