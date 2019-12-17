/* global Config */
import Promise from 'es6-promise';
import Http from './http';

class Destiny2 {
    searchPlayer(membershipType, name) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/SearchDestinyPlayer/${ membershipType }/${ name }/`;
            if (Config.debug) {
                console.log(url);
            }
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    if (res.Response.length === 0) {
                        let errorMessage = 'Guardian not found.';
                        reject(errorMessage);
                    } else {
                        resolve(res.Response);
                    }
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    getProfile(membershipType, membershipId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters,CharacterEquipment`;
            if (Config.debug) {
                console.log(url);
            }
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    const characterIds = res.Response.profile.data.characterIds;
                    const characters = characterIds.map(characterId => {
                        return res.Response.characters.data[characterId];
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
            const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/?modes=${ mode }`;
            if (Config.debug) {
                console.log(url);
            }
            Http.request(url).then(res => {
                if (res.ErrorStatus === 'Success') {
                    const responseKey = Object.keys(res.Response)[0];
                    resolve(res.Response[responseKey].allTime);
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
            if (Config.debug) {
                console.log(url);
            }
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
            if (Config.debug) {
                console.log(url);
            }
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
}

export default new Destiny2();
