import {
    getIn,
    setIn,
} from '../../../src/utils/immutable-utils';

import {
    fromJS,
    Map,
} from 'immutable';

/* eslint-disable id-length */
describe('getIn', () => {
    it('should get value from plain objects', () => {
        expect(getIn(
            { a: 1 },
            ['a']))
            .toEqual(1);
        expect(getIn(
            { a: { b: 2 } },
            ['a', 'b']))
            .toEqual(2);
        expect(getIn(
            { a: { b: [11, 12, 13] } },
            ['a', 'b', 1]))
            .toEqual(12);
        expect(getIn(
            { a: { b: [11, { c: 2 }, 13] } },
            ['a', 'b', 1, 'c']))
            .toEqual(2);
    });

    it('should get value from full immutable objects', () => {
        expect(getIn(
            fromJS({ a: 1 }),
            ['a']))
            .toEqual(1);
        expect(getIn(
            fromJS({ a: { b: 2 } }),
            ['a', 'b']))
            .toEqual(2);
        expect(getIn(
            fromJS({ a: { b: [11, 12, 13] } }),
            ['a', 'b', 1]))
            .toEqual(12);
        expect(getIn(
            fromJS({ a: { b: [11, { c: 2 }, 13] } }),
            ['a', 'b', 1, 'c']))
            .toEqual(2);
    });

    it('should get value from partially immutable objects', () => {
        expect(getIn(
            fromJS({ a: 1 }),
            ['a']))
            .toEqual(1);
        expect(getIn(
            { a: fromJS({ b: 2 }) },
            ['a', 'b']))
            .toEqual(2);
        expect(getIn(
            { a: { b: fromJS([11, 12, 13]) } },
            ['a', 'b', 1]))
            .toEqual(12);
        expect(getIn(
            { a: { b: fromJS([11, { c: 2 }, 13]) } },
            ['a', 'b', 1, 'c']))
            .toEqual(2);
    });

    it('should get value from undefined in plain objects', () => {
        expect(getIn(
            undefined, ['a']))
            .toEqual(undefined);
        expect(getIn(
            null, ['a']))
            .toEqual(undefined);
        expect(getIn(
            { a: undefined },
            ['a', 'b']))
            .toEqual(undefined);
        expect(getIn(
            { a: { b: null } },
            ['a', 'b']))
            .toEqual(null);
        expect(getIn(
            { a: { b: [0] } },
            ['a', 'b', 1]))
            .toEqual(undefined);
        expect(getIn(
            { a: { b: [11, { c: 2 }, 13] } },
            ['a', 'b', 3, 'c']))
            .toEqual(undefined);
    });

    it('should get value from undefined in immutable objects', () => {
        expect(getIn(
            Map({}), ['a']))
            .toEqual(undefined);
        expect(getIn(
            fromJS({ a: undefined }),
            ['a', 'b']))
            .toEqual(undefined);
        expect(getIn(
            fromJS({ a: { b: null } }),
            ['a', 'b']))
            .toEqual(null);
        expect(getIn(
            fromJS({ a: { b: [0] } }),
            ['a', 'b', 1]))
            .toEqual(undefined);
        expect(getIn(
            fromJS({ a: { b: [11, { c: 2 }, 13] } }),
            ['a', 'b', 3, 'c']))
            .toEqual(undefined);
    });
});

describe('setIn', () => {
    it('should not change objects', () => {
        const target = { a: 1 };
        setIn(target, ['a'], 2);
        expect(target).toEqual({ a: 1 });
    });

    it('should treat value exactly as value', () => {
        const updated = setIn({ a: 1 }, ['a'], x => x);
        expect(updated.a).toBeFunction();

        const immutableUpdated = setIn(fromJS({ a: 1 }), ['a'], x => x);
        expect(immutableUpdated.get('a')).toBeFunction();
    });

    it('should return updated object', () => {
        const target = { a: 1 };

        const updated = setIn(target, ['a'], 2);

        expect(updated)
            .toEqual({ a: 2 });
    });

    it('should update null and undefined object', () => {
        expect(
            setIn(null, ['a'], 'new'))
            .toEqual({ a: 'new' });
        expect(
            setIn(undefined, ['a'], 'new'))
            .toEqual({ a: 'new' });
        expect(
            setIn({ a: null }, ['a', 'b'], 'new'))
            .toEqual({ a: { b: 'new' } });
    });

    it('should deep update plain objects', () => {
        expect(
            setIn(
                { a: { b: 'prev' } },
                ['a', 'b'], 'new'))
            .toEqual({ a: { b: 'new' } });
        expect(
            setIn(
                { a: { b: { c: 'prev' } } },
                ['a', 'b', 'c'], 'new'))
            .toEqual({ a: { b: { c: 'new' } } });
        expect(
            setIn(
                { a: { b: [0, 'prev', 2] } },
                ['a', 'b', 1], 'new'))
            .toEqual({ a: { b: [0, 'new', 2] } });
        expect(
            setIn(
                { a: { b: [0, { c: 'prev' }, 2] } },
                ['a', 'b', 1, 'c'], 'new'))
            .toEqual({ a: { b: [0, { c: 'new' }, 2] } });
    });

    it('should deep update immutable objects', () => {
        expect(
            setIn(
                fromJS({ a: { b: 'prev' } }),
                ['a', 'b'], 'new'))
            .toEqualImmutable(fromJS({ a: { b: 'new' } }));
        expect(
            setIn(
                fromJS({ a: { b: { c: 'prev' } } }),
                ['a', 'b', 'c'], 'new'))
            .toEqualImmutable(fromJS({ a: { b: { c: 'new' } } }));
        expect(
            setIn(
                fromJS({ a: { b: [0, 'prev', 2] } }),
                ['a', 'b', 1], 'new'))
            .toEqualImmutable(fromJS({ a: { b: [0, 'new', 2] } }));
        expect(
            setIn(
                fromJS({ a: { b: [0, { c: 'prev' }, 2] } }),
                ['a', 'b', 1, 'c'], 'new'))
            .toEqualImmutable(fromJS({ a: { b: [0, { c: 'new' }, 2] } }));
    });
});
