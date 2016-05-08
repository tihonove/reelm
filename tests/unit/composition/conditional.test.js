import conditional from '../../../src/composition/conditional';

describe('conditional', () => {
    it('should match simple type prefix', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace')(reducer);
        const result = scopedReducer('state', { type: 'Namespace.Action' });

        expect(result).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([
            ['state', { type: 'Action', match: {} }],
        ]);
    });

    it('should not match by prefix without dot', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace')(reducer);
        const result = scopedReducer('state', { type: 'NamespaceAndSuffix' });

        expect(result).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([]);
    });

    it('should not match by prefix without dot with long condition', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace.Action')(reducer);
        const result = scopedReducer('state', {
            type: 'Namespace.ActionAndSuffix' });

        expect(result).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([]);
    });

    it('should match single dynamic prefix', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace.[Value1]')(reducer);
        scopedReducer('state', { type: 'Namespace.Action' });

        expect(reducer.calls.allArgs()).toEqual([
            ['state', { type: undefined, match: { Value1: 'Action' } }],
        ]);
    });

    it('should not lost action content', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace')(reducer);
        scopedReducer('state', { type: 'Namespace.Action', value: 'value' });

        expect(reducer.calls.allArgs()[0][1].value).toEqual('value');
    });

    it('should not throw on empty actions', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace')(reducer);
        scopedReducer('state', undefined);
        scopedReducer('state', null);
        scopedReducer('state', {});

        expect(reducer.calls.any()).toBeFalsy();
    });

    it('should not call reducer on not matched actions', () => {
        const reducer = jasmine
            .createSpy('reducer')
            .and.callFake(state => state);

        const scopedReducer = conditional('Namespace')(reducer);
        scopedReducer('state', { type: 'AnotherNamespace' });
        scopedReducer('state', { type: 'Prefix.Namespace' });

        expect(reducer.calls.any()).toBeFalsy();
    });
});
