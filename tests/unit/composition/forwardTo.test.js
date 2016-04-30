import forwardTo from '../../../src/composition/forwardTo';

describe('forwardTo', () => {
    it('should combine types', () => {
        const dispatch = jasmine.createSpy('dispatch');

        forwardTo(dispatch, 'Type1')({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: 'Type1.Action' }]]);
        dispatch.calls.reset();

        forwardTo(dispatch, 'Type1', 'Type2')({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: 'Type1.Type2.Action' }]]);
        dispatch.calls.reset();
    });

    it('should combine non string', () => {
        const dispatch = jasmine.createSpy('dispatch');

        forwardTo(dispatch, 'Type1', 1)({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: 'Type1.1.Action' }]]);
        dispatch.calls.reset();

        forwardTo(dispatch, 0)({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: '0.Action' }]]);
        dispatch.calls.reset();

        forwardTo(dispatch, true, false)({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: 'true.false.Action' }]]);
        dispatch.calls.reset();

        forwardTo(dispatch, { value: 'value' })({ type: 'Action' });
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: '[object Object].Action' }]]);
        dispatch.calls.reset();
    });

    it('should throw on types with dot', () => {
        const dispatch = jasmine.createSpy('dispatch');

        expect(() => forwardTo(dispatch, 'Type1.Type2'))
            .toThrow();

        expect(() => forwardTo(dispatch, 'Type', 'Type1.Type2'))
            .toThrow();
    });

    it('should not lost action content', () => {
        const dispatch = jasmine.createSpy('dispatch');

        const action = { type: 'Action', value: 'value' };
        forwardTo(dispatch, 'Type1', 'Type2')(action);
        expect(dispatch.calls.allArgs())
            .toEqual([[{ type: 'Type1.Type2.Action', value: 'value' }]]);
        dispatch.calls.reset();
    });
});
