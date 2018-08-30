/* global Config */
import Promise from 'es6-promise';

import Http from './http';
import Utils from './utils';
import { GameModes, StatHashes } from './constants';

class Destiny2 {
    searchPlayer(membershipType, name) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/SearchDestinyPlayer/${ membershipType }/${ name }/`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    if (res.Response.length === 0) {
                        let errorMessage = 'Guardian not found.';
                        if (membershipType === 4) {
                            errorMessage = `${ errorMessage } Battle.net ID must be in name#1234 format.`;
                        }
                        reject(errorMessage);
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
                    const characters = characterIds.map(characterId => {
                        const char = res.Response.characters.data[characterId];
                        this.setMRRStats(char);
                        return char;
                    });
                    resolve({
                        userInfo: res.Response.profile.data.userInfo,
                        characters: characters
                    });
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getCharacterStats(membershipType, membershipId, characterId, mode) {
        return new Promise((resolve, reject) => {
            const gameMode = GameModes[mode];
            if (!gameMode) {
                console.log(`Unknown mode ${ mode } in getCharacterStats`);
            }
            const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/?modes=${ mode }`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    if (!res.Response[gameMode.responseKey]) {
                        console.log(`Unknown key ${ gameMode.responseKey } in getCharacterStats`);
                    }
                    resolve(res.Response[gameMode.responseKey].allTime);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getActivityHistory(membershipType, membershipId, characterId, mode, page) {
        return new Promise((resolve, reject) => {
            const count = 50;
            const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/Activities/?mode=${ mode }&count=${ count }&page=${ page }`;
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

    getClanInfo(membershipType, membershipId) {
        return new Promise((resolve, reject) => {
            const url = `/platform/GroupV2/User/${ membershipType }/${ membershipId }/All/Clan/`;
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response.results);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getItemDefinition(referenceId) {
        const itemType = 'DestinyInventoryItemDefinition';
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/Manifest/${ itemType }/${ referenceId }/`;
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

    setMRRStats(character) {
        character.mobility = character.stats[StatHashes['Mobility']] || 0;
        character.resilience = character.stats[StatHashes['Resilience']] || 0;
        character.recovery = character.stats[StatHashes['Recovery']] || 0;
    }

    activityWon(activity) {
        if (!activity.values.standing) {
            return false;
        }

        switch (activity.values.standing.basic.displayValue) {
            case '1':
            case 'Victory':
                return true;
            default:
                return false;
        }
    }

    doesActivityCount(activity) {
        return activity.values.team && activity.values.team.basic.value > 0;
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
