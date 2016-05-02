import { defineReducer } from 'reelm/fluent';

export const Show = 'Show';
export const Hide = 'Hide';
export const Discard = 'Discard';
export const Confirm = 'Confirm';

export default defineReducer({ show: false })
    .on(Show, (state, { text }) => ({ show: true, text: text }))
    .on(Hide, () => ({ show: false }));

