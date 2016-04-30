import { noop } from '../effects';

export const isSpoiledState = spoiledStateOrState =>
    (spoiledStateOrState !== undefined) && Boolean(spoiledStateOrState['@@Effected']);

export const extractState = spoiledStateOrState =>
    isSpoiledState(spoiledStateOrState) ? spoiledStateOrState.state : spoiledStateOrState;

export const extractEffects = spoiledStateOrState =>
    isSpoiledState(spoiledStateOrState) ? spoiledStateOrState.effect : noop();

export const splitSpoiledState = spoiledStateOrState =>
    [extractState(spoiledStateOrState), extractEffects(spoiledStateOrState)];

export const spoiled = (state, effect = null) => ({
    ['@@Effected']: true,
    state: state,
    effect: effect || noop(),
});
