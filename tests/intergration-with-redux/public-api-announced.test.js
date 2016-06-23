const indexFunctions = require('../../index');
const effectsFunctions = require('../../effects');
const fluentFunctions = require('../../fluent');

describe('Public interface', () => {
    it('should have index that contains announced funcitons', () => {
        expect(Object.keys(indexFunctions)).toHaveSameItems([
            'reelmRunner',
            'spoiled',
            'pipeReducers',
            'forwardTo',
            'conditional',
            'over',
            'scoped',
        ], true);

        expect(indexFunctions.reelmRunner).toBeFunction();
        expect(indexFunctions.pipeReducers).toBeFunction();
        expect(indexFunctions.forwardTo).toBeFunction();
        expect(indexFunctions.conditional).toBeFunction();
        expect(indexFunctions.over).toBeFunction();
        expect(indexFunctions.scoped).toBeFunction();

        expect(Object.keys(indexFunctions.spoiled)).toHaveSameItems([
            'split',
            'isSpoiled',
            'extractState',
            'extractEffects',
        ], true);

        expect(indexFunctions.spoiled.split).toBeFunction();
        expect(indexFunctions.spoiled.isSpoiled).toBeFunction();
        expect(indexFunctions.spoiled.extractState).toBeFunction();
        expect(indexFunctions.spoiled.extractEffects).toBeFunction();
    });

    it('should have effects that contains announced funcitons', () => {
        expect(Object.keys(effectsFunctions)).toHaveSameItems([
            'effectType',
            'noop',
            'select',
            'fork',
            'call',
            'join',
            'put',
            'take',
            'map',
            'race',
        ], true);
        expect(effectsFunctions.effectType).toBeObject();

        expect(effectsFunctions.noop).toBeFunction();
        expect(effectsFunctions.select).toBeFunction();
        expect(effectsFunctions.fork).toBeFunction();
        expect(effectsFunctions.call).toBeFunction();
        expect(effectsFunctions.join).toBeFunction();
        expect(effectsFunctions.put).toBeFunction();
        expect(effectsFunctions.take).toBeFunction();
        expect(effectsFunctions.map).toBeFunction();
    });

    it('should have fluent that contains announced funcitons', () => {
        expect(Object.keys(fluentFunctions)).toHaveSameItems([
            'defineReducer',
            'perform',
        ], true);

        expect(fluentFunctions.defineReducer).toBeFunction();
        expect(fluentFunctions.perform).toBeFunction();

        const defineReducerInst = fluentFunctions.defineReducer({});

        expect(Object.keys(defineReducerInst)).toHaveSameItems([
            'on',
            'scopedOver',
            'always',
            'mapEffects',
        ], true);

        expect(defineReducerInst.on).toBeFunction();
        expect(defineReducerInst.scopedOver).toBeFunction();
        expect(defineReducerInst.always).toBeFunction();
        expect(defineReducerInst.mapEffects).toBeFunction();
    });
});
