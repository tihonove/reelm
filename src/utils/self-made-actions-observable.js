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
        if (typeof this.observer.next === 'function') {
            this.observer.next(value);
        }
    }

    error(errorValue) {
        if (typeof this.observer.error === 'function') {
            this.observer.error(errorValue);
        }
    }

    complete(completeValue) {
        if (typeof this.observer.complete === 'function') {
            this.observer.complete(completeValue);
        }
    }
}

export default class SelfMadeActionsObservable {
    constructor() {
        this.subscriptions = new Set();
    }

    notify(action) {
        if (this.subscriptions) {
            for (const subscription of this.subscriptions) {
                subscription.next(action);
            }
        }
    }

    close(result) {
        if (this.subscriptions) {
            for (const subscription of this.subscriptions) {
                subscription.complete(result);
            }
            this.subscriptions = undefined;
        }
    }

    throw(error) {
        if (this.subscriptions) {
            for (const subscription of this.subscriptions) {
                subscription.error(error);
            }
            this.subscriptions = undefined;
        }
    }

    unsubscribe(subscription) {
        if (this.subscriptions) {
            this.subscriptions.delete(subscription);
        }
    }

    subscribe(observer) {
        if (this.subscriptions) {
            const subscription = new SubscriptionObserver(this, observer);
            this.subscriptions.add(subscription);
            return subscription;
        }
        return undefined;
    }

    [Symbol.observable]() {
        return this;
    }
}

export function first(condition = () => true) {
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
