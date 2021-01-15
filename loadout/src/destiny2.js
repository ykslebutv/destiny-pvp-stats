/* global Config */
import Promise from 'es6-promise';
//import Http from './http';

class Destiny2 {
    // searchPlayer(membershipType, name) {
    //     return new Promise((resolve, reject) => {
    //         const url = `${ Config.basePath }/SearchDestinyPlayer/${ membershipType }/${ name }/`;
    //         if (Config.debug) {
    //             console.log(url);
    //         }
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 if (res.Response.length === 0) {
    //                     let errorMessage = 'Guardian not found.';
    //                     reject(errorMessage);
    //                 } else {
    //                     resolve(res.Response);
    //                 }
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    getProfile(membershipType, membershipId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters,CharacterEquipment`;
            const headers = { 'x-api-key': Config.apiKey };
            if (Config.debug) {
                console.log(url);
            }
            fetch(url, { headers: headers }).then(res => res.json()).then(res => {
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

    getCharacter(membershipType, membershipId, characterId, accessToken) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/Character/${ characterId }/?components=CharacterInventories,CharacterEquipment,ItemStats,ItemPerks,ItemInstances,ItemSockets`;
            const headers = {
                'x-api-key': Config.apiKey,
                'Authorization': "Bearer " + accessToken
            };
            if (Config.debug) {
                console.log(url);
            }
            fetch(url, { headers: headers }).then(res => res.json()).then(res => {
                if (res.ErrorStatus === 'Success') {
                    res.Response["characterId"] = characterId;
                    resolve(res.Response);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

    // getCharacterStats(membershipType, membershipId, characterId, mode) {
    //     return new Promise((resolve, reject) => {
    //         const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/?modes=${ mode }`;
    //         if (Config.debug) {
    //             console.log(url);
    //         }
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 const responseKey = Object.keys(res.Response)[0];
    //                 resolve(res.Response[responseKey].allTime);
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    // getActivityHistory(membershipType, membershipId, characterId, mode, page) {
    //     return new Promise((resolve, reject) => {
    //         const count = 50;
    //         const url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/Activities/?mode=${ mode }&count=${ count }&page=${ page }`;
    //         if (Config.debug) {
    //             console.log(url);
    //         }
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 resolve(res.Response.activities);
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    // getPostGame(activityId) {
    //     return new Promise((resolve, reject) => {
    //         const url = `${ Config.basePath }/Stats/PostGameCarnageReport/${ activityId }/`;
    //         if (Config.debug) {
    //             console.log(url);
    //         }
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 resolve(res.Response);
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    // getClanInfo(membershipType, membershipId) {
    //     return new Promise((resolve, reject) => {
    //         const url = `/platform/GroupV2/User/${ membershipType }/${ membershipId }/All/Clan/`;
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 resolve(res.Response.results);
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    // getItemDefinition(referenceId) {
    //     const itemType = 'DestinyInventoryItemDefinition';
    //     return new Promise((resolve, reject) => {
    //         const url = `${ Config.basePath }/Manifest/${ itemType }/${ referenceId }/`;
    //         Http.request(url).then(res => {
    //             if (res.ErrorStatus === 'Success') {
    //                 resolve(res.Response);
    //             } else {
    //                 reject(res.Message);
    //             }
    //         });
    //     });
    // }

    getCurrentUser(accessToken) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }/Platform/User/GetMembershipsForCurrentUser/`;
            if (Config.debug) {
                console.log(url);
            }
            const headers = {
                'x-api-key': Config.apiKey,
                'Authorization': "Bearer " + accessToken
            };
            fetch(url, {headers: headers})
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return {
                        'ErrorStatus': 'Error',
                        'Message': 'Failed getting current user (token expired?)'
                    };
                }
            })
            .then(res => {
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
