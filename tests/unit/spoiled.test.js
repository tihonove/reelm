import spoiled from '../../src/spoiled';

describe('spoiled', () => {
    describe('isSpoiled', () => {
        it('should return false for plain object and null', () => {
            expect(spoiled.isSpoiled(null)).toBeFalsy();
            expect(spoiled.isSpoiled(undefined)).toBeFalsy();
            expect(spoiled.isSpoiled(spoiled('state', 'effect'))).toBeTrue();
        });
    });

    describe('extractState', () => {
        it('should extract same state from pure state', () => {
            expect(spoiled.extractState(null))
                .toEqual(null);
            expect(spoiled.extractState(undefined))
                .toEqual(undefined);
            expect(spoiled.extractState('state'))
                .toEqual('state');

            const stateObj = { state: 1 };
            expect(spoiled.extractState(stateObj))
                .toBe(stateObj);
        });

        it('should extract state from spoiled state', () => {
            expect(spoiled.extractState(spoiled('state', 'effect')))
                .toEqual('state');
            expect(spoiled.extractState(spoiled('state', null)))
                .toEqual('state');
            expect(spoiled.extractState(spoiled('state', undefined)))
                .toEqual('state');

            expect(spoiled.extractState(spoiled(null, 'effect')))
                .toEqual(null);
            expect(spoiled.extractState(spoiled(undefined, 'effect')))
                .toEqual(undefined);
        });
    });

    describe('extractEffects', () => {
        it('should extract null from pure state', () => {
            expect(spoiled.extractEffects(null))
                .toEqual(null);
            expect(spoiled.extractEffects(undefined))
                .toEqual(null);
            expect(spoiled.extractEffects('state'))
                .toEqual(null);
        });

        it('should extract effects from spoiled state', () => {
            expect(spoiled.extractEffects(spoiled('state', 'effect')))
                .toEqual('effect');
            expect(spoiled.extractEffects(spoiled('state', null)))
                .toEqual(null);
            expect(spoiled.extractEffects(spoiled('state', undefined)))
                .toEqual(null);

            expect(spoiled.extractEffects(spoiled(null, 'effect')))
                .toEqual('effect');
            expect(spoiled.extractEffects(spoiled(undefined, 'effect')))
                .toEqual('effect');
        });
    });

    describe('split', () => {
        it('should split to array with null from pure state', () => {
            expect(spoiled.split(null))
                .toEqual([null, null]);
            expect(spoiled.split(undefined))
                .toEqual([undefined, null]);
            expect(spoiled.split('state'))
                .toEqual(['state', null]);
        });

        it('should split to array from spoiled state', () => {
            expect(spoiled.split(spoiled('state', 'effect')))
                .toEqual(['state', 'effect']);
            expect(spoiled.split(spoiled('state', null)))
                .toEqual(['state', null]);
            expect(spoiled.split(spoiled('state', undefined)))
                .toEqual(['state', null]);

            expect(spoiled.split(spoiled(null, 'effect')))
                .toEqual([null, 'effect']);
            expect(spoiled.split(spoiled(undefined, 'effect')))
                .toEqual([undefined, 'effect']);
        });
    });
});
