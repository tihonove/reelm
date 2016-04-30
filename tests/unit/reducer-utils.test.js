import { spoiled } from '../../src/index';
import { pipeReducers } from '../../src/utils/reducer-utils';

describe('pipeReducers', () => {
    it('should not spoil pure states', () => {
        const reducer = jasmine.createSpy('reducer').and.callFake(state => state);

        const pipedReducer = pipeReducers(reducer);

        expect(pipedReducer('state', 'action')).toEqual('state');
        expect(reducer.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
    });

    it('should pipe reducers result', () => {
        const reducer = jasmine.createSpy('reducer').and.callFake(() => 'pureResult');
        const spoiledReducer1 = jasmine.createSpy('spoiledReducer1')
            .and.callFake(() => spoiled('spoiledResult1', 'effect1'));
        const spoiledReducer2 = jasmine.createSpy('spoiledReducer2')
            .and.callFake(() => spoiled('spoiledResult2', 'effect2'));

        pipeReducers(spoiledReducer1, reducer, spoiledReducer2)('initialState', 'action');

        expect(spoiledReducer1.calls.allArgs()).toEqual([['initialState', 'action']]);
        expect(reducer.calls.allArgs()).toEqual([['spoiledResult1', 'action']]);
        expect(spoiledReducer2.calls.allArgs()).toEqual([['pureResult', 'action']]);
    });

    it('should use original effect when sinlge reducer spoiled', () => {
        const reducer = jasmine.createSpy('reducer').and.callFake(state => state);
        const spoiledReducer = jasmine
            .createSpy('spoiledReducer')
            .and.callFake(state => spoiled(state, 'effect'));

        const pipedReducer = pipeReducers(reducer, spoiledReducer);

        expect(pipedReducer('state', 'action')).toEqual(spoiled('state', 'effect'));

        expect(reducer.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
        expect(spoiledReducer.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
    });

    it('should call each of spoiled reducer', () => {
        const spoiledReducer1 = jasmine
            .createSpy('spoiledReducer1')
            .and.callFake(state => spoiled(state, 'effect1'));

        const spoiledReducer2 = jasmine
            .createSpy('spoiledReducer2')
            .and.callFake(state => spoiled(state, 'effect2'));

        const pipedReducer = pipeReducers(spoiledReducer1, spoiledReducer2);

        pipedReducer('state', 'action');

        expect(spoiledReducer1.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
        expect(spoiledReducer2.calls.allArgs()).toEqual([
            ['state', 'action'],
        ]);
    });

    it('should combine effects from few spoiled reducers into array', () => {
        const spoiledReducer1 = jasmine.createSpy('spoiledReducer1').and.callFake(state => spoiled(state, 'effect1'));
        const spoiledReducer2 = jasmine.createSpy('spoiledReducer2').and.callFake(state => spoiled(state, 'effect2'));

        const pipedReducer = pipeReducers(spoiledReducer1, spoiledReducer2);

        const result = pipedReducer('state', 'action');

        expect(result).toEqual(spoiled('state', ['effect1', 'effect2']));
    });
});
