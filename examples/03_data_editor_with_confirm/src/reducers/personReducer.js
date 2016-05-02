import { spoiled } from 'reelm';
import { put } from 'reelm/effects';
import { defineReducer } from 'reelm/fluent';

export const Change = 'Change';
export const Clear = 'Clear';
export const ConfirmedClear = 'ConfirmedClear';

const initialState = {};

export default defineReducer(initialState)
    .on(Change, (person, { data }) => ({ ...person, ...data }))
    .on(Clear, () => initialState)
    .on(ConfirmedClear,
        state => spoiled(state, function* () {
            const confirmed = yield { type:
                'RequestConfirmation',
                text: 'Clean person?',
            };
            if (confirmed) {
                yield put({ type: Clear });
            }
        }));
