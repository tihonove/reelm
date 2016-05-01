import { effectType, put, take } from '../../../src/effects';
import scoped from '../../../src/composition/scoped';
import spoiled from '../../../src/spoiled';

describe('scoped', () => {
    it('should match simple type prefix', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Action' });

        expect(result).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([
            ['state', { type: 'Action', match: {} }],
        ]);
    });

    it('should throw on invalid patter', () => {
        const reducer = x => x;

        expect(() => scoped('.Namespace')(reducer))
            .toThrowError('Invalid pattern provided');
        expect(() => scoped('Namespace.[]')(reducer))
            .toThrowError('Invalid pattern provided');
        expect(() => scoped('Namespace.]zz[')(reducer))
            .toThrowError('Invalid pattern provided');
        expect(() => scoped(']Namespace.[zz]]')(reducer))
            .toThrowError('Invalid pattern provided');
        expect(() => scoped('[Namespace.[zz]]')(reducer))
            .toThrowError('Invalid pattern provided');
        expect(() => scoped('Namespace.Sub.')(reducer))
            .toThrowError('Invalid pattern provided');
    });

    it('should not match action with exactly match', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        scopedReducer('state', { type: 'Namespace.SubNamespace' });

        expect(reducer.calls.any()).toBeFalsy();
    });

    it('should call with global actions when not dynamic parts', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace.Sub')(reducer);
        scopedReducer('state', { type: '@@globalAction' });

        expect(reducer.calls.allArgs()).toEqual([
            ['state', { type: '@@globalAction' }],
        ]);
    });

    it('should ignore global actions when have dynamic parts', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        scopedReducer('state', { type: '@@globalAction' });

        expect(reducer.calls.any()).toBeFalsy();
    });

    it('should match single dynamic prefix', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        scopedReducer('state',
            { type: 'Namespace.SubNamespace.Action' });
        scopedReducer('state',
            { type: 'Namespace.SubNamespace.Action.SubAction' });

        expect(reducer.calls.allArgs()).toEqual([
            [
                'state',
                { type: 'Action', match: { Value1: 'SubNamespace' } },
            ],
            [
                'state',
                { type: 'Action.SubAction', match: { Value1: 'SubNamespace' } },
            ],
        ]);
    });

    it('should match two dynamic prefixes', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace.[Value1].[Value2]')(reducer);
        scopedReducer('state',
            { type: 'Namespace.Sub.SubSub.Action' });
        scopedReducer('state',
            { type: 'Namespace.Sub.SubSub.Action.SubAction' });

        expect(reducer.calls.allArgs()).toEqual([
            ['state', { type: 'Action', match: {
                Value1: 'Sub',
                Value2: 'SubSub',
            } }],
            ['state', { type: 'Action.SubAction', match: {
                Value1: 'Sub',
                Value2: 'SubSub',
            } }],
        ]);
    });

    it('should not lost action content', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace')(reducer);
        scopedReducer('state', { type: 'Namespace.Action', value: 'value' });

        expect(reducer.calls.allArgs()[0][1].value).toEqual('value');
    });

    it('should convert put effects', () => {
        const reducer = state => spoiled(state, function* () {
            yield put({ type: 'YieldedAction' });
        });

        const scopedReducer = scoped('Namespace')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Action' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.PUT);
        expect(effect.action)
            .toEqual({ type: 'Namespace.YieldedAction' });
    });

    it('should convert put with dynamic part', () => {
        const reducer = state => spoiled(state, function* () {
            yield put({ type: 'YieldedAction' });
        });

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Sub.Action' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.PUT);
        expect(effect.action)
            .toEqual({ type: 'Namespace.Sub.YieldedAction' });
    });

    it('should not convert put with dynamic part and global incoming action', () => {
        const reducer = state => spoiled(state, function* () {
            yield put({ type: 'YieldedAction' });
        });

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        const result = scopedReducer('state', { type: '@@globalAction' });
        const effects = spoiled.extractEffects(result);
        expect(effects).toBeNull();
    });

    it('should convert put static parts and global incoming action', () => {
        const reducer = state => spoiled(state, function* () {
            yield put({ type: 'YieldedAction' });
        });

        const scopedReducer = scoped('Namespace.Sub')(reducer);
        const result = scopedReducer('state', { type: '@@globalAction' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.PUT);
        expect(effect.action)
            .toEqual({ type: 'Namespace.Sub.YieldedAction' });
    });


    it('should convert take effects', () => {
        const reducer = state => spoiled(state, function* () {
            yield take(x => x.type === 'ActionToTake');
        });

        const scopedReducer = scoped('Namespace')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Action' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.TAKE);
        expect(effect.condition({ type: 'ActionToTake' }))
            .toBeFalsy();
        expect(effect.condition({ type: 'Namespace.ActionToTake' }))
            .toBeTruthy();
        expect(effect.condition({ type: 'Namespace.Sub.ActionToTake' }))
            .toBeFalsy();
    });

    it('should convert take with dynamic part', () => {
        const reducer = state => spoiled(state, function* () {
            yield take(x => x.type === 'ActionToTake');
        });

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Sub.Action' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.TAKE);
        expect(effect.condition({ type: 'ActionToTake' }))
            .toBeFalsy();
        expect(effect.condition({ type: 'Namespace.ActionToTake' }))
            .toBeFalsy();
        expect(effect.condition({ type: 'Namespace.Sub.ActionToTake' }))
            .toBeTruthy();
        expect(effect.condition({ type: 'Namespace.Sub1.ActionToTake' }))
            .toBeFalsy();
    });

    it('should not convert take with dynamic part and global incoming action', () => {
        const reducer = state => spoiled(state, function* () {
            yield take(x => x.type === 'ActionToTake');
        });

        const scopedReducer = scoped('Namespace.[Value1]')(reducer);
        const result = scopedReducer('state', { type: '@@globalAction' });
        const effects = spoiled.extractEffects(result);
        expect(effects).toBeNull();
    });

    it('should convert take static parts and global incoming action', () => {
        const reducer = state => spoiled(state, function* () {
            yield take(x => x.type === 'ActionToTake');
        });

        const scopedReducer = scoped('Namespace.Sub')(reducer);
        const result = scopedReducer('state', { type: '@@globalAction' });
        const effects = spoiled.extractEffects(result);
        const effectsGenerator = effects();
        const effect = effectsGenerator.next().value;

        expect(effect.type)
            .toEqual(effectType.TAKE);
        expect(effect.condition({ type: 'ActionToTake' }))
            .toBeFalsy();
        expect(effect.condition({ type: 'Namespace.ActionToTake' }))
            .toBeFalsy();
        expect(effect.condition({ type: 'Namespace.Sub.ActionToTake' }))
            .toBeTruthy();
        expect(effect.condition({ type: 'Namespace.Sub1.ActionToTake' }))
            .toBeFalsy();
    });
});
