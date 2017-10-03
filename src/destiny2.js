/* global Config */
import Promise from 'es6-promise';

import Http from './http';
import Utils from './utils';
import { GameModes } from './constants';

class Destiny2 {
    searchPlayer(membershipType, name) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/SearchDestinyPlayer/${ membershipType }/${ name }/`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    if (res.Response.length === 0) {
                        reject('Guardian not found.');
                    } else {
                        resolve(res.Response[0]);
                    }
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getProfile(membershipType, membershipId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    const characterIds = res.Response.profile.data.characterIds;
                    const characters = characterIds.map(characterId =>
                        res.Response.characters.data[characterId]
                    );
                    resolve(characters);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getCharacterStats(membershipType, membershipId, characterId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/?modes=${ GameModes.ALL }`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response.allPvP.allTime);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getActivityHistory(membershipType, membershipId, characterId, mode, page) {
        return new Promise((resolve, reject) => {
            const count = 50;
            const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/Activities/?&mode=${ mode }&count=${ count }&page=${ page }`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response.activities);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getPostGame(activityId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/Stats/PostGameCarnageReport/${ activityId }/`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    calculateDailyStats(activities) {
        const dailyStats = {};

        (activities || []).map(activity => {
            activity.date = Utils.formatDate(activity.period);

            if (!dailyStats[activity.date]) {
                dailyStats[activity.date] = {};
                dailyStats[activity.date].date = activity.date;
                dailyStats[activity.date].activities = [];
                dailyStats[activity.date].kills = 0;
                dailyStats[activity.date].deaths = 0;
                dailyStats[activity.date].wins = 0;
                dailyStats[activity.date].losses = 0;
            }

            dailyStats[activity.date].activities.push(activity);
            dailyStats[activity.date].kills += activity.values.kills.basic.value;
            dailyStats[activity.date].deaths += activity.values.deaths.basic.value;

            if (this.activityWon(activity)) {
                dailyStats[activity.date].wins += 1;
            } else {
                dailyStats[activity.date].losses += 1;
            }
        });

        return dailyStats;
    }

    activityWon(activity) {
        switch (activity.values.standing.basic.displayValue) {
            case '1':
            case 'Victory':
                return true;
            default:
                return false;
        }
    }

    getWLRatio(wins, totalGames) {
        return Math.round((wins / totalGames) * 100);
    }

    dailyWLRatio(dailyStat) {
        return this.getWLRatio(dailyStat.wins, dailyStat.wins + dailyStat.losses);
    }

    dailyKD(dailyStat) {
        const kd = dailyStat.deaths > 0 ? dailyStat.kills / dailyStat.deaths : dailyStat.kills;
        return kd.toFixed(2);
    }
}

export default new Destiny2();
