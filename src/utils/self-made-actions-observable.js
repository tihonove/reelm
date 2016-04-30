class Subscription {
    constructor(source) {
        this.source = source;
    }

    unsubscribe() {
        this.source.unsubscribe(this);
    }
}

class SubscriptionObserver extends Subscription {
    constructor(source, observer) {
        super(source);
        this.observer = observer;
    }

    next(value) {
        this.observer.next(value);
    }

    error(errorValue) {
        this.observer.error(errorValue);
    }

    complete(completeValue) {
        this.observer.complete(completeValue);
    }

}

export default class SelfMadeActionsObservable {
    constructor() {
        this.subscriptions = new Set();
    }

    notify(action) {
        for (const subscription of this.subscriptions) {
            subscription.next(action);
        }
    }

    unsubscribe(subscription) {
        this.subscriptions.delete(subscription);
    }

    subscribe(observer) {
        const subscription = new SubscriptionObserver(this, observer);
        this.subscriptions.add(subscription);
        return subscription;
    }

    [Symbol.observable]() {
        return this;
    }
}

export function first(condition) {
    /* eslint-disable no-invalid-this */
    return new Promise((resolve, reject) => {
        const subscription = this.subscribe({
            next(value) {
                if (condition(value)) {
                    subscription.unsubscribe();
                    resolve(value);
                }
            },
            complete() {
                reject('Observable completed without matched elements');
            },
            error(...args) {
                reject(...args);
            },
        });
    });
    /* eslint-enable no-invalid-this */
}
