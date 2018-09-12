/* global Config */
import { extendObservable, computed } from 'mobx';
import Utils from '../utils';
import destiny2 from '../destiny2';
import { GameModes, Maps } from '../constants';
import PGCRModel from './pgcrModel.jsx';

class ActivityModel {
    constructor(args) {
        try {
            extendObservable(this, {
                period: args.period,
                date: Utils.formatDate(args.period),
                dateTime: Utils.formatDate(args.period, true),
                directorActivityHash: args.activityDetails.directorActivityHash,
                instanceId: args.activityDetails.instanceId,
                referenceId: args.activityDetails.referenceId,
                isPrivate: args.activityDetails.isPrivate,
                mode: args.activityDetails.mode,

                pcgr: null
            });

            if (args.values) {
                extendObservable(this, {
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
            }
        } catch (e) {
            console.log('ActivityModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    @computed get gameMode() {
        let gameMode = GameModes[this.mode];
        if (!gameMode) {
            console.log(`Unknown mode ${ this.mode } for directorActivityHash ${ this.directorActivityHash }`);
            gameMode = GameModes[5];
        }
        return gameMode;
    }

    get gameModeName() {
        return this.gameMode.displayName;
    }

    get gameModeIcon() {
        return `${ Config.baseUrl }${ this.gameMode.icon }`;
    }

    get gameModeIconClass() {
        return this.mode === 14 ? 'trials_icon' : 'activity_icon';
    }

    get mapName() {
        return Maps[this.referenceId] || this.referenceId;
    }

    get title() {
        return `${ this.gameModeName } on ${ this.mapName }, ${ this.dateTime }`;
    }

    @computed get url() {
        return `/game/${ this.instanceId }`;
    }

    get doesItCount() {
        return this.standing !== '???';
    }

    get isWon() {
        switch (this.standing) {
            case 'Victory':
            case '1':
            case '2':
            case '3':
                return true;
            default:
                return false;
        }
    }

    loadPCGR() {
        return destiny2.getPostGame(this.instanceId).then(data => {
            this.pcgr = new PGCRModel(data);
        });
    }
}

export default ActivityModel;
