import React, { PropTypes } from 'react';
import { extendObservable, observable, computed, action } from 'mobx';
import destiny2 from './destiny2';

const Status = {
    NODATA: '',
    LOADING: 'Loading data',
    SUCCESS: 'Success',
    FAILED: 'failed'
};

class Model {
    constructor(args) {
        extendObservable(this, {

            name: args.name,
            platform: args.platform,
            mode: args.mode,

            player: {
                displayName: '',
                membershipType: '',
                membershipId: '',
                iconPath: '',
                clanName: '',
                clanTag: '',
            },

            characters: [],

            status: Status.NODATA,
            error: null,
            page: 0,

            setStatus: action(status => {
                this.status = status;
            }),

            setError: action(error => {
                this.setStatus(Status.FAILED);
                this.error = error;
            })
        });
    }

    get loading() {
        return this.status === Status.LOADING;
    }

    get success() {
        return this.status === Status.SUCCESS;
    }

    get failed() {
        return this.status === Status.FAILED;
    }

    load() {
        this.page = 0;
        this.setStatus(Status.LOADING);

        destiny2.searchPlayer(this.platform, this.name).then(playerData => {
            Object.assign(this.player, playerData);
            const { membershipType, membershipId } = this.player;
            destiny2.getProfile(membershipType, membershipId).then(characters => {
                this.characters = characters;
                let loadCount = this.characters.length;
                this.characters.map(character => {
                    const characterId = character.characterId;
                    destiny2.getCharacterStats(membershipType, membershipId, characterId).then(data => {
                        character.stats = data;
                        destiny2.getActivityHistory(this.player.membershipType, this.player.membershipId, characterId, this.mode, 0).then(action(activities => {
                            extendObservable(character, {
                                activities: activities
                            });
                            loadCount -= 1;
                            if (loadCount === 0) {
                                this.setStatus(Status.SUCCESS);
                            }
                        }), error => {
                            this.setError(error);
                        }); // getActivityHistory
                    }, error => {
                        this.setError(error);
                    }); // getCharacterStats
                }); // characters.map
            }, error => {
                this.setError(error);
            }); // getProfile
        }, error => {
            this.setError(error);
        }); // searchPlayer
    }
}

export default Model;
