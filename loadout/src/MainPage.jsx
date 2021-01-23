/* global Workdata, Config */
import React from 'react';
import MediaQuery from 'react-responsive';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import destiny2 from './destiny2';
import Armor from './models/Armor.jsx';
import { CharacterList } from './models/Character.jsx';
import LoadoutOptimizer from './LoadoutOptimizer.jsx';
import Filter from './Filter.jsx';

import { Divider } from 'antd';

const Status = {
    NOT_AUTHORIZED: null,
    AUTHORIZING: "authorizing",
    LOADING: "loading",
    READY: "ready"
}

const ItemType = {
    ARMOR: 2
}

@observer export default class MainPage extends React.Component {

    constructor() {
        super();

        // if (!this.accessToken) {
        //     this.getCurrentUser();
        // }
    }

    @computed get status() {
        return Status.READY;

        if (!this.accessToken) {
            return Status.NOT_AUTHORIZED;
        }

        if (!this.user) {
            return Status.LOADING;
        }

        return Status.READY;
    }

    @action.bound authorize() {
        const url = "https://www.bungie.net/en/OAuth/Authorize?client_id=34984&response_type=code";
        window.open(url, "Authorize with Bungie"); //, "width=600, height=800");
        window.addEventListener('storage', function(e) {
            this.accessToken = localStorage.getItem('accessToken');
        });
    }

    @observable user = Workdata.user;
    @observable profile = Workdata.profile;
    @observable characters = Workdata.characters;
    @observable model;
    // @observable user;
    // @observable profile;
    // @observable characters;
    @observable activeCharacterId;

    get userName() {
        return this.user ? this.user.destinyMemberships[0].LastSeenDisplayName : null;
    }

    get membershipType() {
        return this.user ? this.user.destinyMemberships[0].membershipType : null;
    }

    get membershipId() {
        return this.user ? this.user.destinyMemberships[0].membershipId : null;
    }

    getCurrentUser() {
        destiny2.getCurrentUser(this.accessToken).then(res => {
            this.receiveUser(res);
            destiny2.getProfile(this.membershipType, this.membershipId).then(res => {
                this.receiveProfile(res);

                this.profile.characters.forEach(character => {
                    destiny2.getCharacter(this.membershipType, this.membershipId, character.characterId, this.accessToken).then(res => {
                        this.receiveCharacter(res);
                    });
                });
            });
        })
        .catch(error => {
            console.log(error);
            this.handleFailure();
        });
    }

    @action receiveUser(data) {
        this.user = data;   
    }

    @action receiveProfile(data) {
        this.profile = data;   
    }

    @action receiveCharacter(data) {
        this.characters.push(data);
    }

    @action.bound handleFailure() {
        localStorage.removeItem("accessToken");
        this.accessToken = null;
    }

    @action.bound changeCharacter(characterId) {
        this.activeCharacterId = characterId;
        this.model = new CharacterDataModel({data: this.characterData(this.activeCharacterId)});
    }

    characterData(characterId) {
        return this.characters ? this.characters.find(c => c.characterId === characterId) : null;
    }

    render() {
        const headerRow = (
            <div className="flex-container header-container">
                <div>
                    <h1>D2 Loadout Optimizer</h1>
                </div>
                <div className="right">
                    <h2>{this.userName}</h2>
                </div>
            </div>
        );

        const authorizeRow = this.status === Status.NOT_AUTHORIZED ? (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.authorize}>
                    Authorize with Bungie
                </button>
            </div>
        ) : null;

        const characterList = this.status === Status.READY ? (
            <div>
                <Divider plain>
                    Select character
                </Divider>
                <CharacterList
                    characters={this.profile.characters}
                    activeCharacterId={this.activeCharacterId}
                    onClick={this.changeCharacter}
                />
            </div>
        ) : null;

        const filterComp = this.activeCharacterId ? (
            <div>
                <Divider plain>
                    Pin armor items
                </Divider>
                <Filter model={this.model} />
            </div>
        ) : null;

        const loadoutComp = this.model ? (
            <div>
                <Divider plain>Loadouts</Divider>
                <LoadoutOptimizer model={this.model} />
            </div>
        ) : null;

        const footerRow = (
            <Divider plain>
                &copy; <a href="https://destinypvpstats.com">destinypvpstats.com</a>
            </Divider>
        )

        return (
            <div>
                { headerRow }
                { authorizeRow }

                {/* { data ? <pre>{JSON.stringify(this.armorList, null, 2)}</pre> : null } */}

                <MediaQuery query="(max-width: 999px)">
                    { characterList }
                    { filterComp }
                    { loadoutComp }
                </MediaQuery>

                <MediaQuery query="(min-width: 1000px)">
                    <div className="flex-container">
                        <div>
                            { characterList }
                            { filterComp }
                        </div>
                        <div>
                            { loadoutComp }
                        </div>
                        <div />
                    </div>
                </MediaQuery>

                { footerRow }
            </div>
        );
    }
}


class CharacterDataModel {

    @observable armorFilter = [];

    constructor(args) {
        Object.assign(this, args);
    }

    @computed get armorList() {
        const data = this.data;
        if (!data) {
            return [];
        }

        const list = [];

        const addArmor = (item) => {
            const instance = data.itemComponents.instances.data[item.itemInstanceId];
            const statItem = data.itemComponents.stats.data[item.itemInstanceId] ? data.itemComponents.stats.data[item.itemInstanceId].stats : null;
            const perkItem = data.itemComponents.perks.data[item.itemInstanceId] ? data.itemComponents.perks.data[item.itemInstanceId].perks : null;
            const manifestItem = Manifest.DestinyInventoryItemDefinition[item.itemHash];

            const isArmor = manifestItem && manifestItem.itemType === ItemType.ARMOR;

            if (instance && isArmor) {

                const armor = new Armor();
                armor.initFromData(item, instance, manifestItem, statItem, perkItem, this.includeMods);
                list.push(armor);
            }
        }

        data.equipment.data.items.forEach(item => addArmor(item));
        data.inventory.data.items.forEach(item => addArmor(item));

        return list;
    }

    @computed get helmets() {
        return this.armorList.filter(item => item.isHelmet);
      }

      @computed get arms() {
        return this.armorList.filter(item => item.isArms);
      }

      @computed get chests() {
        return this.armorList.filter(item => item.isChest);
      }

      @computed get legs() {
        return this.armorList.filter(item => item.isLegs);
      }

      @computed get classitems() {
        return this.armorList.filter(item => item.isClassitem);
      }

      @action addToArmorFilter(value) {
          if (!this.armorFilter.find(item => item.id === value )) {
            this.armorFilter.push(value);
          }
      }

      @action removeFromArmorFilter(value) {
          this.armorFilter = this.armorFilter.filter(id => id !== value);
      }

      @computed get pinnedItems() {
          return this.armorList.filter(item => this.armorFilter.find(id => id === item.id));
      }
}