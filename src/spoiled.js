const spoiledToken = '@@Spoiled';

function spoiled(state, effect = null) {
    return {
        [spoiledToken]: true,
        state: state,
        effect: effect,
    };
}

spoiled.isSpoiled = spoiledStateOrState =>
    (spoiledStateOrState !== undefined) &&
    (spoiledStateOrState !== null) &&
    Boolean(spoiledStateOrState[spoiledToken]);

spoiled.extractState = spoiledStateOrState =>
    spoiled.isSpoiled(spoiledStateOrState)
        ? spoiledStateOrState.state
        : spoiledStateOrState;

spoiled.extractEffects = spoiledStateOrState =>
    spoiled.isSpoiled(spoiledStateOrState)
        ? spoiledStateOrState.effect
        : null;

spoiled.split = spoiledStateOrState =>
    [
        spoiled.extractState(spoiledStateOrState),
        spoiled.extractEffects(spoiledStateOrState),
    ];

export default spoiled;
