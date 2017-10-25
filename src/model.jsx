import { extendObservable, action } from 'mobx';

import destiny2 from './destiny2';

const Status = {
    NODATA: '',
    LOADING: 'Loading data',
    SUCCESS: 'Success',
    FAILED: 'failed'
};

class Model {
    constructor(args) {
        this.page = 0;

        extendObservable(this, {

            name: args.name,
            platform: args.platform,
            mode: 'AllPvP',

            player: {
                displayName: '',
                membershipType: '',
                membershipId: '',
                iconPath: '',
                clanName: '',
                clanTag: ''
            },

            characters: [],

            status: Status.NODATA,
            error: null,
            loadingPage: false,

            setStatus: action(status => {
                this.status = status;
            }),

            setError: action(error => {
                this.setStatus(Status.FAILED);
                this.error = error;
            }),

            setLoadingPage: action(loadingPage => {
                this.loadingPage = loadingPage;
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
        const name = this.name.replace('#', '%23');
        this.setStatus(Status.LOADING);

        destiny2.searchPlayer(this.platform, name).then(playerData => {
            Object.assign(this.player, playerData);
            const { membershipType, membershipId } = this.player;
            destiny2.getProfile(membershipType, membershipId).then(characters => {
                this.characters = characters;
                let loadCount = this.characters.length;
                this.characters.map(character => {
                    const characterId = character.characterId;
                    destiny2.getCharacterStats(membershipType, membershipId, characterId, this.mode).then(data => {
                        character.stats = data;
                        destiny2.getActivityHistory(this.player.membershipType, this.player.membershipId, characterId, this.mode, 0).then(action(activities => {
                            character.activities = activities || [];
                            extendObservable(character, {
                                dailyStats: destiny2.calculateDailyStats(activities)
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

            destiny2.getClanInfo(membershipType, membershipId).then(clans => {
                if (clans && clans.length > 0) {
                    const clan = clans[0];
                    this.player.clanName = clan.group.name;
                    this.player.clanTag = clan.group.clanInfo.clanCallsign;
                }
            });
        }, error => {
            this.setError(error);
        }); // searchPlayer
    }

    loadNextPage() {
        if (this.loadingPage) {
            return;
        }
        this.page = this.page + 1;
        this.setLoadingPage(true);
        let loadCount = this.characters.length;
        this.characters.map(character => {
            const characterId = character.characterId;
            destiny2.getActivityHistory(this.player.membershipType, this.player.membershipId, characterId, this.mode, this.page).then(action(activities => {
                if (activities && activities.length > 0) {
                    character.activities = character.activities.concat(activities);
                    character.dailyStats = destiny2.calculateDailyStats(character.activities);
                }
                loadCount -= 1;
                if (loadCount === 0) {
                    this.setLoadingPage(false);
                }
            }), error => {
                this.setError(error);
            });
        });
    }

    changeGameMode(mode) {
        this.mode = mode;
        this.load();
    }
}

export default Model;
