import { effectType } from './effect-creators';
import { first } from './utils/self-made-actions-observable';
import { effectsToGenerator } from './utils/effects-utils';

class Task {
    constructor(promiseObject) {
        this.promiseObject = promiseObject;
    }

    async join() {
        return await this.promiseObject;
    }
}

async function processPlainSideEffect(
    effect, dispatch, getState, actionObservable) {
    if (effect.then) {
        return await effect;
    }
    if (Array.isArray(effect)) {
        const effectPromises = effect
            .map(x => runEffects(x, dispatch, getState, actionObservable));
        return await Promise.all(effectPromises);
    }
    if (effect.type === effectType.PUT) {
        return dispatch(effect.action);
    }
    if (effect.type === effectType.CALL) {
        return runEffects(
            effect.generator, dispatch, getState, actionObservable);
    }
    if (effect.type === effectType.TAKE) {
        return await actionObservable::first(effect.condition);
    }
    if (effect.type === effectType.SELECT) {
        return effect.selector(getState());
    }
    if (effect.type === effectType.FORK) {
        const resultPromise =
            runEffects(
                effect.generator, dispatch, getState, actionObservable);
        return new Task(resultPromise);
    }
    if (effect.type === effectType.JOIN) {
        return effect.task.join();
    }
    if (effect.type === effectType.NOOP) {
        return undefined;
    }
    throw `Uncatched side effect: ${JSON.stringify(effect)}`;
}

async function runEffects(
    effect, dispatch, getState, actionObservable) {
    const generator = effectsToGenerator(effect)();
    if (generator.then) {
        return await generator;
    }

    let next = generator.next();
    let nextArgument;
    while (!next.done) {
        try {
            nextArgument = await processPlainSideEffect(
                next.value, dispatch, getState, actionObservable);
            next = generator.next(nextArgument);
        }
        catch (exception) {
            next = generator.throw(exception);
        }
    }
    return next.value;
}

export default runEffects;
