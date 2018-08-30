import Utils from '../utils';
import { extendObservable, action } from 'mobx';

class ActivityModel {
    constructor(args) {
        try {
            extendObservable(this, {
                period: args.period,
                date: Utils.formatDate(args.period),
                directorActivityHash: args.activityDetails.directorActivityHash,
                instanceId: args.activityDetails.instanceId,
                referenceId: args.activityDetails.referenceId,
                isPrivate: args.activityDetails.isPrivate,
                mode: args.activityDetails.mode,

                duration: args.values.activityDurationSeconds.basic.displayValue,
                completed: args.values.completed.basic.value,
                standingDisp: args.values.standing.basic.displayValue,
                standingVal: args.values.standing.basic.value,
                team: args.values.team.basic.displayValue,

                kills: args.values.kills.basic.value,
                deaths: args.values.deaths.basic.value,
                assists: args.values.assists.basic.value,
                killsDeathsRatio: args.values.killsDeathsRatio.basic.value,
                score: args.values.score.basic.value
            });
        } catch(e) {
            console.log('ActivityModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }
}

export default ActivityModel;
