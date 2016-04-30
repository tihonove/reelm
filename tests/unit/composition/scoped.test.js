import scoped from '../../../src/composition/scoped';

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

    it('should not lost action content', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = scoped('Namespace')(reducer);
        scopedReducer('state', { type: 'Namespace.Action', value: 'value' });

        expect(reducer.calls.allArgs()[0][1].value).toEqual('value');
    });
});
