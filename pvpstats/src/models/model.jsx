import Promise from 'es6-promise';
import { observable, action, computed } from 'mobx';

import { destiny2 } from '../../../api/destiny2';
import { GameModes } from '../constants';

import PlayerModel from './playerModel.jsx';

const Status = {
    NODATA: '',
    LOADING: 'Loading data',
    SUCCESS: 'Success',
    FAILED: 'failed'
};

class Model {
    @observable id;
    @observable name;
    @observable platform;
    @observable mode;
    @observable status;
    @observable error;
    @observable loadingPage;

    constructor(args) {
        this.page = 0;
        this.id = args.id;
        this.name = args.name;
        this.platform = args.platform;
        this.mode = args.mode || GameModes.AllPvp;

        this.status = Status.NODATA;
        this.error = null;
        this.loadingPage = false;
    }

    @action setStatus(status) {
        this.status = status;
    }

    @action setError(error) {
        this.setStatus(Status.FAILED);
        this.error = error;
    }

    @action setLoadingPage(loadingPage) {
        this.loadingPage = loadingPage;
    }

    @computed get loading() {
        return this.status === Status.LOADING;
    }

    @computed get success() {
        return this.status === Status.SUCCESS;
    }

    @computed get failed() {
        return this.status === Status.FAILED;
    }

    getMembershipInfo() {
        return new Promise((resolve, reject) => {
            if (this.id && this.platform) {
                resolve({ membershipId: this.id, membershipType: this.platform });
            }
        });
    }

    getCharacterInfo(membershipType, membershipId, character) {
        return new Promise((resolve, reject) => {
            const characterId = character.characterId;
            destiny2.getCharacterStats(membershipType, membershipId, characterId, this.mode).then(data => {
                character.setStats(data);
                destiny2.getActivityHistory(membershipType, membershipId, characterId, this.mode, 0).then(activities => {
                    character.addActivities(activities);
                    resolve(Status.SUCCESS);
                }, error => {
                    character.setPrivate(true);
                    resolve(Status.SUCCESS);
                }); // getActivityHistory
            }, error => {
                reject(Status.FAILED);
            }); // getCharacterStats
        });
    }

    @action load() {
        this.page = 0;
        this.player = null;
        this.setStatus(Status.LOADING);

        this.getMembershipInfo().then(playerData => {
            const { membershipType, membershipId } = playerData;
            destiny2.getProfile(membershipType, membershipId).then(result => {
                this.player = new PlayerModel(result);
                const promises = this.player.characters.map(character => this.getCharacterInfo(membershipType, membershipId, character));

                Promise.all(promises).then(statuses => {
                    let allSuccess = true;
                    statuses.forEach(status => allSuccess = status === Status.SUCCESS ? allSuccess : false);
                    this.setStatus(allSuccess ? Status.SUCCESS : Status.FAILED);
                });

                destiny2.getClanInfo(membershipType, membershipId).then(clans => {
                    if (clans && clans.length > 0) {
                        const clan = clans[0];
                        this.player.setClanInfo(clan.group.name, clan.group.clanInfo.clanCallsign);
                    }
                });
            }, error => {
                this.setError(error);
            }); // getProfile
        }, error => {
            this.setError(error);
        }); // getMembershipInfo
    }

    @action loadNextPage() {
        if (this.loadingPage) {
            return;
        }
        this.page = this.page + 1;
        this.setLoadingPage(true);
        const promises = this.player.characters.map(character => {
            return destiny2.getActivityHistory(this.player.membershipType, this.player.membershipId, character.characterId, this.mode, this.page)
                .then(activities => {
                    character.addActivities(activities);
                }, error => {
                    this.setError(error);
                });
        });

        Promise.all(promises).then(() => this.setLoadingPage(false));
    }

    @action changeGameMode(mode) {
        this.mode = mode;
        this.load();
    }
}

export default Model;
