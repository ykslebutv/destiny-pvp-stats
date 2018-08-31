/* global Config */
import { extendObservable } from 'mobx';
import Utils from '../utils';

class PGCRModel {
    constructor(args) {
        try {
            extendObservable(this, {
                activityId: args.activityId,
            });
        } catch (e) {
            console.log('PGCRModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }
}

export default PGCRModel;
