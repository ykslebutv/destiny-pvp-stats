/* global Config */
import { extendObservable, action } from 'mobx';
import Utils from '../utils';
import { StatHashes } from '../constants';
import ActivityModel from './activityModel.jsx';

const VALOR_HASH = 3882308435;
const GLORY_HASH = 2679551909;
const INFAMY_HASH = 2772425241;

class ProgressionModel {
    constructor(args) {
        try {
            debugger
            extendObservable(this, {
                valor: args[VALOR_HASH],
                glory: args[GLORY_HASH],
                infamy: args[INFAMY_HASH]
            });
        } catch (e) {
            console.log('ProgressionModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }
}

export default ProgressionModel;
