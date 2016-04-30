import over from '../../../src/composition/over';

describe('scoped', () => {
    it('should lens into plain object field', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(() => 'nestedValue');

        const overReducer = over(['nest'])(reducer);
        const result = overReducer({ nest: 'prevValue' }, { type: 'Action' });

        expect(result).toEqual({ nest: 'nestedValue' });

        expect(reducer.calls.allArgs()).toEqual([
            ['prevValue', { type: 'Action' }],
        ]);
    });

    it('should not lost action content', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(() => 'nestedValue');

        const overReducer = over(['nest'])(reducer);
        overReducer({ nest: 'prevValue' }, { type: 'Action', value: 'value' });

        expect(reducer.calls.allArgs()).toEqual([
            ['prevValue', { type: 'Action', value: 'value' }],
        ]);
    });
});
