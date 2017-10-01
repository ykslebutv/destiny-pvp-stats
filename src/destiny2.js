import Http from './http';
import Promise from 'es6-promise';

import { GameModes } from './constants.js';

class Destiny2 {
    searchPlayer(membershipType, name) {
        return new Promise(function(resolve, reject) {
            var url = `${ Config.basePath }/SearchDestinyPlayer/${ membershipType }/${ name }/`;
            Http.request(url).then(function (res) {
                debugger
                if (res.ErrorStatus === 'Success') {
                    if (res.Response.length === 0)
                        reject('Guardian not found.');
                    else
                        resolve(res.Response[0]);
                }
                else {
                    reject(res.Message);
                }
            });
        });
    }

    getProfile(membershipType, membershipId) {
        return new Promise(function(resolve, reject) {
            var url = `${ Config.basePath }/${ membershipType }/Profile/${ membershipId }/?components=Profiles,Characters`;
            Http.request(url).then(function (res) {
                debugger
                const characterIds = res.Response.profile.data.characterIds;
                let characters = characterIds.map(characterId => {
                    return res.Response.characters.data[characterId];
                });

                if (res.ErrorStatus === 'Success') {
                    resolve(characters);
                }
                else
                    reject(res.Message);
            });
        });
    }

    getCharacterStats(membershipType, membershipId, characterId) {
        return new Promise(function(resolve, reject) {
            var url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/?modes=${ GameModes.ALL }`;
            Http.request(url).then(function (res) {
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response.allPvP.allTime);
                }
                else {
                    reject(res.Message);
                }
            });
        });
    }

    getActivityHistory(membershipType, membershipId, characterId, mode, page) {
        return new Promise(function(resolve, reject) {
            var count = 50;
            var url = `${ Config.basePath }/${ membershipType }/Account/${ membershipId }/Character/${ characterId }/Stats/Activities/?mode=${ GameModes.ALL }&count=${ count }&page=${ page }`;
            Http.request(url).then(function (res) {
                debugger
                if (res.ErrorStatus === 'Success') {
                    resolve(res.Response.activities);
                }
                else
                    reject(res.Message);
            });
        });
    }
}

export default new Destiny2();
