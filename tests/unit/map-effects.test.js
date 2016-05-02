import { map } from '../../src/map-effects';

describe('map', () => {
    it('should map plain effect generator', () => {
        const generator = function* () {
            yield 1;
            return 3;
        };
        const mapped = generator::map(x => x + 1)();

        expect(mapped.next()).toEqual({ value: 2, done: false });
        expect(mapped.next()).toEqual({ value: 3, done: true });
    });
});
