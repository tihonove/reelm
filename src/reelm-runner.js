import { noop, effectType } from './effects'
import ActionsObservable, { first } from './self-made-actions-observable'
import { splitSpoiledState } from './utils/spoiled-state-utils'
import { effectsToGenerator } from './utils/effects-utils'

class Task {
    constructor(promiseObject) {
        this.promiseObject = promiseObject;
    }

    async join() {
        return await this.promiseObject;
    }
}

async function processPlainSideEffect(effect, dispatch, getState, actionObservable) {
    if (effect.type === effectType.PUT) {
        return dispatch(effect.action);
    }
    if (effect.type === effectType.TAKE) {
        return await actionObservable::first(effect.condition);
    }
    if (effect.type === effectType.PROMISE) {
        return await effect.promiseFunc();
    }
    if (effect.type === effectType.SELECT) {
        return effect.selector(getState());
    }
    if (effect.type === effectType.FORK) {
        return new Task(runEffectGenerator(effect.generator, dispatch, getState, actionObservable));
    }
    if (effect.type === effectType.JOIN) {
        return effect.task.join();
    } 
    if (effect.type === effectType.CALL) {
        return runEffectGenerator(effect.generator, dispatch, getState, actionObservable);
    }
    if (effect.type === effectType.NOOP) {
        return;
    }
    throw "Uncatched side effect: " + JSON.stringify(effect);
}

async function runEffectGenerator(effect, dispatch, getState, actionObservable) {
    effect = effectsToGenerator(effect);
    var generator = effect();
    
    if (generator.then)
        return await generator;

    var next = generator.next();
    var nextArgument;
    while(true) {
        if (next.done)
            return next.value;
        try {
            nextArgument = await processPlainSideEffect(next.value, dispatch, getState, actionObservable);
            next = generator.next(nextArgument)
        }
        catch(e) {
            next = generator.throw(e);
        }        
    }
}

export function reelmRunner() {
    return (next) => (reducer, initialState, enhancer) => {
        var lastEffect = null;
        var actionsObservable = new ActionsObservable();

        var store = next((...args) => { 
            var [state, effects] = splitSpoiledState(reducer(...args));
            lastEffect = effects;
            return state;
        }, initialState, enhancer);

        function dispatch(action) {
            var result = store.dispatch(action);
            actionsObservable.notify(action)
            runEffectGenerator(lastEffect, ::store.dispatch, ::store.getState, actionsObservable);
            return result;
        }

        return {
            ...store,
            dispatch
        }
    }
}