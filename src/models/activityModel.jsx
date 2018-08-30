/* global Config */
import { extendObservable } from 'mobx';
import Utils from '../utils';
import { GameModes, Maps } from '../constants';

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
                standing: args.values.standing ? args.values.standing.basic.displayValue : '???',
                team: args.values.team ? args.values.team.basic.displayValue : '???',

                kills: args.values.kills.basic.value,
                deaths: args.values.deaths.basic.value,
                assists: args.values.assists.basic.value,
                killsDeathsRatio: args.values.killsDeathsRatio.basic.displayValue,
                score: args.values.score.basic.value
            });
        } catch (e) {
            console.log('ActivityModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get gameMode() {
        let gameMode = GameModes[this.mode];
        if (!gameMode) {
            console.log(`Unknown mode ${ this.mode } for directorActivityHash ${ this.directorActivityHash }`);
            gameMode = GameModes[5];
        }
        return gameMode;
    }

    get mapName() {
        return Maps[this.referenceId] || this.referenceId;
    }

    get doesItCount() {
        return this.standing !== '???';
    }

    get isWon() {
        switch (this.standing) {
            case '1':
            case 'Victory':
                return true;
            default:
                return false;
        }
    }
}

export default ActivityModel;
