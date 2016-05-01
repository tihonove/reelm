import { effectType, select } from '../../../src/effects';
import over from '../../../src/composition/over';
import spoiled from '../../../src/spoiled';

const action = { type: 'Action', value: 'value' };

describe('over', () => {
    describe('with path lens', () => {
        it('should focus onto value', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => 'nestedValue');

            const overReducer = over(['nest'])(reducer);
            const result = overReducer({ nest: 'prevValue' }, action);

            expect(result).toEqual({ nest: 'nestedValue' });

            expect(reducer.calls.allArgs()).toEqual([
                ['prevValue', action],
            ]);
        });

        it('should not lost action content', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => 'nestedValue');

            const overReducer = over(['nest'])(reducer);
            overReducer({ nest: 'prevValue' }, action);

            expect(reducer.calls.allArgs()).toEqual([
                ['prevValue', action],
            ]);
        });

        it('should replace undefined', () => {
            const reducer = () => 'nestedValue';

            const overReducer = over(['nest'])(reducer);

            expect(overReducer({ nest: undefined }, action))
                .toEqual({ nest: 'nestedValue' });
        });

        it('should transform effects selector', () => {
            const reducer = x => spoiled(x, function* () {
                yield select(x => x.subNest);
            });

            const overReducer = over(['nest'])(reducer);
            const effects = spoiled.extractEffects(overReducer());
            const effectsGenerator = effects();
            const effect = effectsGenerator.next().value;

            expect(effect.type)
                .toEqual(effectType.SELECT);
            expect(effect.selector({ nest: { subNest: 2 } }))
                .toEqual(2);
        });
    });

    describe('with state subset lens', () => {
        it('should focus on subset', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => ({
                    localNest1: 'newValue1',
                    localNest2: 'newValue2',
                }));

            const overReducer = over({
                localNest1: ['nest1'],
                localNest2: ['nest2'],
            }, {})(reducer);

            const result = overReducer(
                { nest1: 'prevValue1', nest2: 'prevValue2' },
                action);

            expect(result).toEqual({
                nest1: 'newValue1',
                nest2: 'newValue2',
            });

            expect(reducer.calls.allArgs()).toEqual([
                [
                    {
                        localNest1: 'prevValue1',
                        localNest2: 'prevValue2',
                    },
                    action,
                ],
            ]);
        });

        it('should focus on subset and substitute default values', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => ({
                    localNest1: 'newValue1',
                    localNest2: 'newValue2',
                }));

            const overReducer = over({
                localNest1: ['nest1'],
                localNest2: ['nest2'],
            })(reducer);

            overReducer({ nest1: 'prevValue1' }, action);

            expect(reducer.calls.allArgs()).toEqual([
                [],
                [
                    {
                        localNest1: 'prevValue1',
                        localNest2: 'newValue2',
                    },
                    action,
                ],
            ]);
        });

        it('should transform effects selector to selecto subset', () => {
            const reducer = x => spoiled(x, function* () {
                yield select(x => x.localNest1.subNest);
            });

            const overReducer = over({
                localNest1: ['nest1'],
                localNest2: ['nest2'],
            })(reducer);
            const effects = spoiled.extractEffects(overReducer());
            const effectsGenerator = effects();
            const effect = effectsGenerator.next().value;

            expect(effect.type)
                .toEqual(effectType.SELECT);
            expect(effect.selector({ nest1: { subNest: 2 } }))
                .toEqual(2);
        });

        it('should focus back null', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => ({
                    localNest1: 'newValue1',
                    localNest2: null,
                }));

            const overReducer = over({
                localNest1: ['nest1'],
                localNest2: ['nest2'],
            }, {})(reducer);

            const result = overReducer(
                { nest1: 'prevValue1', nest2: { value: 'prevValue2' } },
                action);

            expect(result).toEqual({
                nest1: 'newValue1',
                nest2: null,
            });
        });

        it('should call reducer to get default state', () => {
            const reducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => ({
                    localNest1: 'newValue1',
                    localNest2: 'newValue2',
                }));

            const overReducer = over({
                localNest1: ['nest1'],
                localNest2: ['nest2'],
            })(reducer);

            overReducer({ nest1: 'prevValue1', nest2: 'prevValue2' }, action);

            expect(reducer.calls.allArgs()).toEqual([
                [],
                [
                    {
                        localNest1: 'prevValue1',
                        localNest2: 'prevValue2',
                    },
                    action,
                ],
            ]);
        });
    });
});
