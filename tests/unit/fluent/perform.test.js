import { perform } from '../../../src/fluent';
import spoiled from '../../../src/spoiled';

describe('perform', () => {
    it('should return reducer that returns spoiled state', () => {
        const returnValue = perform({ type: 'effect' });
        expect(returnValue).toBeFunction();
        const returnValueResult = returnValue('state', 'action');
        expect(spoiled.isSpoiled(returnValueResult)).toBeTruthy();
        const [state, effect] = spoiled.split(returnValueResult);
        expect(state).toEqual('state');
        expect(effect).toEqual({ type: 'effect' });
    });

    it('should pass action into function', () => {
        const spoiledReducer = perform(function* ({ valueFromAction }) {
            yield valueFromAction;
        });
        const [, effects] =
            spoiled.split(
                spoiledReducer('state', { valueFromAction: 'valueFromAction' }));

        expect(effects().next().value).toEqual('valueFromAction');
    });
});
