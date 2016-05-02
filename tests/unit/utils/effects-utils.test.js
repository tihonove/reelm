import {
    composeEffects,
    effectsToGenerator,
} from '../../../src/utils/effects-utils';

describe('composeEffects', () => {
    it('should compose single effect into self', () => {
        expect(composeEffects('effect1'))
            .toEqual('effect1');
    });

    it('should compose two and more effect into array', () => {
        expect(composeEffects('effect1', 'effect2'))
            .toEqual(['effect1', 'effect2']);
    });

    it('should skip null and undefined effects', () => {
        expect(composeEffects())
            .toEqual(null);
        expect(composeEffects('effect1', null, 'effect2'))
            .toEqual(['effect1', 'effect2']);
        expect(composeEffects('effect1', undefined, 'effect2'))
            .toEqual(['effect1', 'effect2']);
        expect(composeEffects('effect1', 'effect2', undefined))
            .toEqual(['effect1', 'effect2']);
        expect(composeEffects('effect1', 'effect2', undefined))
            .toEqual(['effect1', 'effect2']);
    });

    it('should flatten arrays', () => {
        expect(composeEffects(['effect1'], ['effect2']))
            .toEqual(['effect1', 'effect2']);
        expect(composeEffects(['effect1', null], [undefined, 'effect2']))
            .toEqual(['effect1', 'effect2']);
        expect(composeEffects(['effect1', null], [undefined, null]))
            .toEqual('effect1');
    });
});

describe('effectToGenetator', () => {
    it('should save generator result', () => {
        const generator = function* () {
            yield 1;
            yield 2;
            return 3;
        };
        const resultAfterWrap = effectsToGenerator(generator)();

        expect(resultAfterWrap.next())
            .toEqual({ value: 1, done: false });
        expect(resultAfterWrap.next())
            .toEqual({ value: 2, done: false });
        expect(resultAfterWrap.next())
            .toEqual({ value: 3, done: true });
    });

    it('should convert empty value to empty generator', () => {
        const result1 = effectsToGenerator(null)();
        expect(result1.next()).toEqual({ value: undefined, done: true });

        const result2 = effectsToGenerator(undefined)();
        expect(result2.next()).toEqual({ value: undefined, done: true });

        const result3 = effectsToGenerator(false)();
        expect(result3.next()).toEqual({ value: undefined, done: true });

        const result4 = effectsToGenerator(0)();
        expect(result4.next()).toEqual({ value: undefined, done: true });
    });

    it('should convert not empty value to single value generator', () => {
        const result = effectsToGenerator('value')();

        expect(result.next())
            .toEqual({ value: 'value', done: false });
        expect(result.next('yieldedValue'))
            .toEqual({ value: 'yieldedValue', done: true });
    });
});
