import SelfMadeActionsObservable, { first }
    from '../../../src/utils/self-made-actions-observable';

describe('SelfMadeActionsObservable', () => {
    it('should return self on Symbol.observable', () => {
        const observable = new SelfMadeActionsObservable();
        expect(observable[Symbol.observable]())
            .toBe(observable);
    });

    it('should do nothing when no subscribers', () => {
        const observable = new SelfMadeActionsObservable();
        observable.notify('value 1');
        observable.notify('value 2');
    });

    it('should notify single subscriber', () => {
        const observer = {
            next: x => x,
        };
        spyOn(observer, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);
        observable.notify('value 1');
        observable.notify('value 2');

        expect(observer.next.calls.allArgs()).toEqual([
            ['value 1'],
            ['value 2'],
        ]);
    });

    it('should not throw if subscriber does not have next function', () => {
        const observer = { };

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.notify('value 1');
        observable.notify('value 2');
    });

    it('should notify two subscribers', () => {
        const observer1 = { next: x => x };
        spyOn(observer1, 'next').and.stub();
        const observer2 = { next: x => x };
        spyOn(observer2, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer1);
        observable.subscribe(observer2);

        observable.notify('value 1');
        observable.notify('value 2');

        expect(observer1.next.calls.allArgs()).toEqual([
            ['value 1'],
            ['value 2'],
        ]);
        expect(observer2.next.calls.allArgs()).toEqual([
            ['value 1'],
            ['value 2'],
        ]);
    });

    it('should not throw if one of subscriber does not have next function', () => {
        const observer1 = {};
        const observer2 = { next: x => x };

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer1);
        observable.subscribe(observer2);

        observable.notify('value 1');
        observable.notify('value 2');
    });

    it('should call complete on observers', () => {
        const observer = { complete: x => x };
        spyOn(observer, 'complete').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.close('value 1');

        expect(observer.complete.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should not call complete twice', () => {
        const observer = { complete: x => x };
        spyOn(observer, 'complete').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.close('value 1');
        observable.close('value 2');

        expect(observer.complete.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should call error on observers', () => {
        const observer = { error: x => x };
        spyOn(observer, 'error').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.throw('value 1');

        expect(observer.error.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should not throw if no error in observer', () => {
        const observer = {};

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.throw('value 1');
    });

    it('should not call error twice', () => {
        const observer = { error: x => x };
        spyOn(observer, 'error').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.throw('value 1');
        observable.throw('value 2');

        expect(observer.error.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should stop notification on close', () => {
        const observer = { next: x => x };
        spyOn(observer, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.notify('value 1');
        observable.close();
        observable.notify('value 2');

        expect(observer.next.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should stop notification on error', () => {
        const observer = { next: x => x, error: () => undefined };
        spyOn(observer, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer);

        observable.notify('value 1');
        observable.throw();
        observable.notify('value 2');

        expect(observer.next.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should stop notification after unsubscribe', () => {
        const observer = { next: x => x, error: () => undefined };
        spyOn(observer, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        const subscription = observable.subscribe(observer);

        observable.notify('value 1');
        subscription.unsubscribe();
        observable.notify('value 2');

        expect(observer.next.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should successfully unsubscribe after close', () => {
        const observer = { next: x => x, error: () => undefined };
        spyOn(observer, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        const subscription = observable.subscribe(observer);

        observable.notify('value 1');
        observable.close();
        subscription.unsubscribe();
        observable.notify('value 2');

        expect(observer.next.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
    });

    it('should subscribe after close and get not results', () => {
        const observer1 = { next: x => x, error: () => undefined };
        spyOn(observer1, 'next').and.stub();
        const observer2 = { next: x => x, error: () => undefined };
        spyOn(observer2, 'next').and.stub();

        const observable = new SelfMadeActionsObservable();
        observable.subscribe(observer1);

        observable.notify('value 1');
        observable.close();
        observable.subscribe(observer2);
        observable.notify('value 2');

        expect(observer1.next.calls.allArgs()).toEqual([
            ['value 1'],
        ]);
        expect(observer2.next.calls.any()).toBeFalsy();
    });
});

describe('SelfMadeActionsObservable::first', () => {
    it('should return promise', () => {
        const observable = new SelfMadeActionsObservable();
        const result = observable::first();
        expect(result.then).toBeFunction();
    });

    ait('should resolve to first item', async () => {
        let result = null;

        const observable = new SelfMadeActionsObservable();
        const nextPromise =
            observable::first().then(x => {
                result = x;
            });
        expect(result).toBeNull();
        observable.notify('value');
        await nextPromise;
        expect(result).toEqual('value');
    });

    ait('should resolve to first item with condition', async () => {
        let result = null;

        const observable = new SelfMadeActionsObservable();
        const nextPromise =
            observable::first(x => x % 2 === 0).then(x => {
                result = x;
            });
        expect(result).toBeNull();
        observable.notify(1);
        observable.notify(2);
        await nextPromise;
        expect(result).toEqual(2);
    });

    ait('should reject on error', async () => {
        let result = null;
        let error = null;

        const observable = new SelfMadeActionsObservable();
        const nextPromise =
            observable::first(x => x % 2 === 0)
                .then(x => {
                    result = x;
                })
                .catch(exception => {
                    error = exception;
                });
        expect(result).toBeNull();
        observable.notify(1);
        observable.throw('error');
        await nextPromise;
        expect(result).toBeNull();
        expect(error).toEqual('error');
    });

    ait('should reject on complete without found items', async () => {
        let result = null;
        let error = null;

        const observable = new SelfMadeActionsObservable();
        const nextPromise =
            observable::first(x => x % 2 === 0)
                .then(x => {
                    result = x;
                })
                .catch(exception => {
                    error = exception;
                });
        expect(result).toBeNull();
        observable.notify(1);
        observable.close('error');
        await nextPromise;
        expect(result).toBeNull();
        expect(error).toEqual('Observable completed without matched elements');
    });
});
