/* global Config */
import Promise from 'es6-promise';
//import Http from './http';

class Destiny2 {
    getProfile(membershipType, membershipId) {
        return new Promise((resolve, reject) => {
            const url = `${ Config.baseUrl }${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters,CharacterEquipment,ProfileInventories`;
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

                    console.log('equipment items', res.Response.equipment.data.items.length)
                    console.log('inventory items', res.Response.inventory.data.items.length)

                    resolve(res.Response);
                } else {
                    reject(res.Message);
                }
            });
        });
    }

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
                        'error': 'access token expired?'
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
