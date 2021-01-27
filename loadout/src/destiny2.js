'use strict';

/* global Config */

function http_request(url, accessToken=null) {
    let headers = {};
    let fullUrl;
    if (Config.useProxy) {
        const encodedUrl = encodeURIComponent(url);
        fullUrl = `${ Config.proxyUrl }?url=${ encodedUrl }`;
    } else {
        headers = { 'x-api-key': Config.apiKey };
        fullUrl = `${ Config.statsUrl }${ url }`;
    }

    if (accessToken) {
        headers.Authorization = "Bearer " + accessToken;
    }

    return fetch(fullUrl, { headers: headers }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return { status: res.status };
        }
    });
}

class Destiny2 {
    getCurrentUser(accessToken) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }/Platform/User/GetMembershipsForCurrentUser/`;
            if (Config.debug) {
                console.log(url);
            }
            http_request(url, accessToken).then(res => {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response);
                } else {
                    reject(res);
                }
            });
        });
    }

    getProfile(membershipType, membershipId, accessToken) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters,CharacterEquipment,ProfileInventories,ItemStats,ItemPerks,ItemInstances,ItemSockets`;
            if (Config.debug) {
                console.log(url);
            }
            http_request(url, accessToken).then(res => {
                if (res.ErrorStatus === 'Success') {
                    const characterIds = res.Response.profile.data.characterIds;
                    const characters = characterIds.map(characterId => {
                        return res.Response.characters.data[characterId];
                    });
                    resolve({
                        userInfo: res.Response.profile.data.userInfo,
                        characters: characters,
                        itemComponents: res.Response.itemComponents,
                        profileInventory: res.Response.profileInventory
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
            if (Config.debug) {
                console.log(url);
            }
            http_request(url, accessToken).then(res => {
                if (res.ErrorStatus === 'Success') {
                    res.Response["characterId"] = characterId;
                    resolve(res.Response);
                } else {
                    reject(res.Message);
                }
            });
        });
    }
}

export default new Destiny2();
