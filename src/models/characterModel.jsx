/* global Config */
import { extendObservable, action } from 'mobx';
import Utils from '../utils';
import { StatHashes } from '../constants';
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
                mobility: args.stats[StatHashes['Mobility']],
                resilience: args.stats[StatHashes['Resilience']],
                recovery: args.stats[StatHashes['Recovery']],
                activities: []
            });
        } catch (e) {
            console.log('CharacterModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get emblemUrl() {
        return this.emblem ? `${ Config.baseUrl }${ this.emblem }` : '';
    }

    @action setStats(data) {
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
                wins: data.activitiesWon ? data.activitiesWon.basic.value : 0,
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
            this.stats.wl = Utils.wlRatio(this.stats.wins, this.stats.totalGames);
        } catch (e) {
            console.log('CharacterModel::setStats exception', e);
            if (Config.debug) {
                console.log('args', data);
            }
        }
    }

    @action addActivities(activities) {
        if (!activities || !activities.length) {
            console.log('CharacterModel::addActivities no data for character', this.characterId);
            return;
        }

        const newActivities = activities.map(activity => new ActivityModel(activity));
        this.activities = this.activities.concat(newActivities);

        this.calculateDailyStats();
    }

    calculateDailyStats() {
        const dailyStats = {};

        try {
            this.activities.map(activity => {

                if (!dailyStats[activity.date]) {
                    dailyStats[activity.date] = {};
                    dailyStats[activity.date].date = activity.date;
                    dailyStats[activity.date].activities = [];
                    dailyStats[activity.date].kills = 0;
                    dailyStats[activity.date].deaths = 0;
                    dailyStats[activity.date].assists = 0;
                    dailyStats[activity.date].wins = 0;
                    dailyStats[activity.date].totalGames = 0;
                }

                dailyStats[activity.date].activities.push(activity);
                dailyStats[activity.date].kills += activity.kills;
                dailyStats[activity.date].deaths += activity.deaths;
                dailyStats[activity.date].assists += activity.assists;

                if (activity.doesItCount) {
                    if (activity.isWon) {
                        dailyStats[activity.date].wins += 1;
                    }
                    dailyStats[activity.date].totalGames += 1;
                }


                dailyStats[activity.date].dailyKD = function () {
                    const kd = this.deaths > 0 ? this.kills / this.deaths : this.kills;
                    return kd.toFixed(2);
                };

                dailyStats[activity.date].dailyWLRatio = function () {
                    return Utils.wlRatio(this.wins, this.totalGames);
                };
            });

            extendObservable(this, {
                dailyStats: dailyStats
            });
        } catch (e) {
            console.log('CharacterModel::calculateDailyStats exception', e);
        }
    }
}

export default CharacterModel;
