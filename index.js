import { reelmRunner } from './src/reelm-runner'
export default reelmRunner;

import { default as effectedFactory } from './src/effected'
export const effected = effectedFactory.create;
export const splitEffected = effectedFactory.split;