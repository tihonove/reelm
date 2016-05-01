import { defineReducer, perform } from '../../../src/fluent';
import spoiled from '../../../src/spoiled';

describe('defineReducer', () => {
    it('should return default state if action not defined', () => {
        const reducer = defineReducer('initial-state');

        expect(reducer(undefined, undefined))
            .toEqual('initial-state');
        expect(reducer(undefined, null))
            .toEqual('initial-state');
    });

    it('should return state if action not defined', () => {
        const reducer = defineReducer('initial-state');

        expect(reducer('state', undefined))
            .toEqual('state');
        expect(reducer('state', null))
            .toEqual('state');
        expect(reducer('state', {}))
            .toEqual('state');
    });

    describe('on', () => {
        it('should process actions conditionally', () => {
            const nestedReducer = jasmine
                .createSpy('nestedReducer')
                .and.callFake(state => 'modified-' + state);

            const reducer = defineReducer({})
                .on('Action', nestedReducer);

            expect(reducer('state', { type: 'Action' }))
                .toEqual('modified-state');
            expect(reducer('state', { type: 'AnotherAction' }))
                .toEqual('state');

            expect(nestedReducer.calls.allArgs()).toEqual([
                ['state', { type: undefined, match: {} }],
            ]);
        });

        it('should be processed sequentially', () => {
            const nestedReducer1 = jasmine
                .createSpy('nestedReducer1')
                .and.callFake(state => 'modified1-' + state);
            const nestedReducer2 = jasmine
                .createSpy('nestedReducer2')
                .and.callFake(state => 'modified2-' + state);

            const reducer = defineReducer({})
                .on('Action', nestedReducer1)
                .on('Action', nestedReducer2);

            expect(reducer('state', { type: 'Action' }))
                .toEqual('modified2-modified1-state');

            expect(nestedReducer1.calls.allArgs()).toEqual([
                ['state', { type: undefined, match: {} }],
            ]);
            expect(nestedReducer2.calls.allArgs()).toEqual([
                ['modified1-state', { type: undefined, match: {} }],
            ]);
        });
    });

    describe('scopedOver', () => {
        it('should focus onto value and scopes into namespace', () => {
            const nestedReducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => 'nestedValue');

            const reducer = defineReducer({ nest: 'value' })
                .scopedOver('Namespace', ['nest'], nestedReducer);

            const result = reducer(undefined, { type: 'Namespace.Action' });
            expect(result).toEqual({ nest: 'nestedValue' });

            reducer(undefined, { type: 'AnotherNamespace.Action' });

            expect(nestedReducer.calls.allArgs()).toEqual([
                ['value', { type: 'Action', match: {} }],
            ]);
        });

        it('should allow dynamic lens defintion', () => {
            const nestedReducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => 'nestedValue');

            const reducer = defineReducer({ nest: 'value' })
                .scopedOver('Namespace', () => ['nest'], nestedReducer);

            const result = reducer(undefined, { type: 'Namespace.Action' });
            expect(result).toEqual({ nest: 'nestedValue' });

            reducer(undefined, { type: 'AnotherNamespace.Action' });

            expect(nestedReducer.calls.allArgs()).toEqual([
                ['value', { type: 'Action', match: {} }],
            ]);
        });
    });

    describe('always', () => {
        it('should executes always', () => {
            const nestedReducer = jasmine
                .createSpy('reducer')
                .and.callFake(() => 'nestedValue');

            const reducer = defineReducer('state')
                .always(nestedReducer);

            const result1 = reducer(undefined, { type: 'Action' });
            expect(result1).toEqual('nestedValue');
            const result2 = reducer('anotherState', { type: 'Another.Action' });
            expect(result2).toEqual('nestedValue');

            expect(nestedReducer.calls.allArgs()).toEqual([
                ['state', { type: 'Action' }],
                ['anotherState', { type: 'Another.Action' }],
            ]);
        });
    });

    describe('mapEffects', () => {
        it('should should map effects from nested reducers', () => {
            const reducer = defineReducer('state')
                .always(perform(function* () {
                    yield { type: 'Effect' };
                }))
                .mapEffects(() => ({ type: 'MappedEffect' }));

            const result = reducer(undefined, { type: 'Action' });
            const [, effects] = spoiled.split(result);

            expect(effects().next().value).toEqual({ type: 'MappedEffect' });
        });
    });
});
