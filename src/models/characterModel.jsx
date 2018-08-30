import { extendObservable, action } from 'mobx';
import ActivityModel from './activityModel.jsx';

class CharacterModel {
    constructor(args) {
        try {
            extendObservable(this, {
                characterId: args.characterId,
                klass: args.classType,
                gender: args.genderType,
                race: args.raceType,
                emblem: args.emblemBackgroundPath,
                level: args.baseCharacterLevel,
                light: args.light,
                mobility: args.mobility,
                resilience: args.resilience,
                recovery: args.recovery
            });
        } catch(e) {
            console.log('CharacterModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get emblemUrl() {
        return `${ Config.baseUrl }${ this.emblem }`;
    }

    setStats(data) {
        if (!data) {
            console.log('CharacterModel::setStats no data for character', this.characterId);
            return;
        }

        try {
            const stats = {
                kd: data.killsDeathsRatio.basic.displayValue,
                kdlong: data.killsDeathsRatio.basic.value,
                kills: data.kills.basic.value,
                deaths: data.deaths.basic.value,
                assists: data.assists.basic.value,
                wins: data.activitiesWon.basic.value,
                totalGames: data.activitiesEntered.basic.value,
                bestSingleGameKills: data.bestSingleGameKills.basic.value,
                longestKillSpree: data.longestKillSpree.basic.value,
                longestSingleLife: data.longestSingleLife.basic.displayValue,
                killsDeathsAssists: data.killsDeathsAssists.basic.displayValue,
                weaponBestType: data.weaponBestType.basic.displayValue
            };
            extendObservable(this, {
                stats: stats
            });
            this.stats.wl = this.wlRatio;
        } catch(e) {
            console.log('CharacterModel::setStats exception', e);
            console.log('args', data);
        }
    }

    setActivities(activities) {
        if (!activities) {
            console.log('CharacterModel::setActivities no data for character', this.characterId);
        }

        extendObservable(this, {
            activities: (activities || []).map(activity => new ActivityModel(activity))
        });

        //this.calculateDailyStats();
    }

    get wlRatio() {
        try {
            return Math.round((this.stats.wins / this.stats.totalGames) * 100);
        } catch (e) {
            return null;
        }
    }

    calculateDailyStats() {
        const dailyStats = {};

        this.activities.map(activity => {

            if (!dailyStats[activity.date]) {
                dailyStats[activity.date] = {};
                dailyStats[activity.date].date = activity.date;
                dailyStats[activity.date].activities = [];
                dailyStats[activity.date].kills = 0;
                dailyStats[activity.date].deaths = 0;
                dailyStats[activity.date].assists = 0;
                dailyStats[activity.date].wins = 0;
                dailyStats[activity.date].losses = 0;
            }

            dailyStats[activity.date].activities.push(activity);
            dailyStats[activity.date].kills += activity.values.kills.basic.value;
            dailyStats[activity.date].deaths += activity.values.deaths.basic.value;
            dailyStats[activity.date].assists += activity.values.assists.basic.value;

            if (this.doesActivityCount(activity)) {
                if (this.activityWon(activity)) {
                    dailyStats[activity.date].wins += 1;
                } else {
                    dailyStats[activity.date].losses += 1;
                }
            }
        });

        return dailyStats;
    }
}

export default CharacterModel;