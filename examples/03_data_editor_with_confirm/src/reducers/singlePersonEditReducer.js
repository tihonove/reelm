import { defineReducer } from 'reelm/fluent';
import { put, take, call } from 'reelm/effects';


import personReducer from './personReducer';
import confirmationReducer, { Show, Hide, Confirm, Discard }
    from './confirmationReducer';

export const Person = 'Person';
export const Confirmation = 'Confirmation';

export default defineReducer({})
    .scopedOver(Confirmation, ['confirmation'], confirmationReducer)
    .scopedOver(Person, ['person'], personReducer)
    .mapEffects(effect => {
        if (effect.type === 'RequestConfirmation') {
            return call(function* () {
                yield put({
                    type: `${Confirmation}.${Show}`,
                    text: effect.text,
                });
                const resultAction = yield take([
                    `${Confirmation}.${Confirm}`,
                    `${Confirmation}.${Discard}`,
                ]);
                yield put({ type: `${Confirmation}.${Hide}` });
                return resultAction.type === `${Confirmation}.${Confirm}`;
            });
        }
        return effect;
    });
