/* global Workdata */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import destiny2 from './destiny2';
import Character from './components/character.jsx';
import Armor from './models/Armor.jsx';
import Loadout from './models/Loadout.jsx';

const ItemType = {
    ARMOR: 2
}

const SortOrder = {
    NONE: 'none',
    VALUE: 'value',
    WASTE: 'totalWaste',
    POTENTIAL: 'potential'
}

@observer class MainPlayer extends React.Component {

    @observable accessToken = "aaaaa";

    constructor() {
        super();

        //this.accessToken = localStorage.getItem('accessToken');

        if (!this.accessToken) {
            //this.getCurrentUser();
        }
    }

    @computed get status() {

        if (!this.accessToken) {
            return null;
        }

        if (!this.user) {
            return "Loading current user...";
        }

        return "Ready!";
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

    @observable activeCharacterId;
    @observable includeMods = false;
    @observable showRawData = false;
    @observable sortby = SortOrder.VALUE;

    perPage = 20;

    @action.bound setActiveCharacter(characterId) {
        this.activeCharacterId = characterId;
    }

    get userName() {
        return this.user ? this.user.destinyMemberships[0].LastSeenDisplayName : null;
    }

    get membershipType() {
        return this.user ? this.user.destinyMemberships[0].membershipType : null;
    }

    get membershipId() {
        return this.user ? this.user.destinyMemberships[0].membershipId : null;
    }

    characterData(characterId) {
        return this.characters ? this.characters.find(c => c.characterId === characterId) : null;
    }

    @computed get armorList() {
        const data = this.characterData(this.activeCharacterId);
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

    @computed get loadouts() {
        console.log('building loadouts')
        const list = [];
        this.helmets.forEach(helmet => {
            this.arms.forEach(arm=> {
                this.chests.forEach(chest => {
                    this.legs.forEach(leg => {
                        this.classitems.forEach(classitem => {
                            const args = {
                                helmet: helmet,
                                arms: arm,
                                chest: chest,
                                legs: leg,
                                classitem: classitem,
                            };
                            const loadout = new Loadout(args);
                            if (loadout.isValid) {
                                list.push(loadout);
                            }
                        })
                    })
                })
            })
        });
        return list;
    }

    @computed get sortedLoadouts() {
        if (this.sortby === SortOrder.NONE) {
            return this.loadouts;
        }

        let r = 1;
        if (this.sortby === SortOrder.WASTE) {
            r = -1;
        }

        return this.loadouts.sort((a, b) => {
            if (a[this.sortby] > b[this.sortby]) {
                return -r;
            }
            if (a[this.sortby] < b[this.sortby]) {
                return r;
            }
            return 0;
        });        
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

    @action.bound toggleIncludeMods() {
        this.includeMods = !this.includeMods;
    }

    @action.bound changeSortOrder(e) {
        this.sortby = e.target.value;
    }

    render() {
        const data = this.characterData(this.activeCharacterId);

        console.log('loadouts', this.loadouts.length)
        console.log('this.sortby', this.sortby)

        // const armorLists = [this.helmets, this.arms, this.chests, this.legs, this.classitems].map(list => (
        //   <div>
        //     {list.map(item => item.show())}
        //   </div>
        // ));

        const headerRow = (
            <div className="row mt-2">
                <div className="col-sm-6">
                    <h1>D2 Loadout Optimizer</h1>
                </div>
                <div className="col-sm-6 pt-2 text-right">
                    <h2>{this.userName}</h2>
                </div>
            </div>
        );

        const buttonStyle = "btn btn-primary";

        const navigationRow = (
            <div className="row mt-3 mb-2 ">
                <div className="col-sm-12 text-right">
                    <div className="btn-group">
                        <label className={buttonStyle}>
                            <input type="checkbox" onChange={this.toggleIncludeMods} /> Include inserted mods (?)
                        </label>
                    </div>
                    <div className="btn-group btn-group-toggle ml-3">
                        <label className={this.sortby === SortOrder.VALUE ? buttonStyle + " active" : buttonStyle}>
                            <input type="radio" name="sortby" value={SortOrder.VALUE} onClick={this.changeSortOrder}
                            /> Sort by value
                        </label>
                        <label className={this.sortby === SortOrder.WASTE ? buttonStyle + " active" : buttonStyle}>
                            <input type="radio" name="sortby" value={SortOrder.WASTE} onClick={this.changeSortOrder}
                            /> Sort by waste
                        </label>
                        <label className={this.sortby === SortOrder.POTENTIAL ? buttonStyle + " active" : buttonStyle}>
                            <input type="radio" name="sortby" value={SortOrder.POTENTIAL} onClick={this.changeSortOrder}
                            /> Sort by potential
                        </label>
                    </div>
                </div>
            </div>
        );

        const characteList = (
            <div className="row">
            {
                this.profile.characters.map(character =>
                    <div className="col character-list">
                        <Character
                            key={ character.characterId }
                            character={ character }
                            active={this.activeCharacterId === character.characterId}
                            onClick={this.setActiveCharacter}
                        />
                    </div>
                )
            }
            </div>
        );

        return this.status ? (
            <div className="container">
                {headerRow}
                {characteList}
                {data && navigationRow}
                {/* {armorLists} */}
                {/* { data ? <pre>{JSON.stringify(this.armorList, null, 2)}</pre> : null } */}
                <div className="container">
                    {this.sortedLoadouts.slice(0, this.perPage).map(l => l.show())}
                </div>
                {this.showRawData && (
                    <div>
                        <pre>
                            {JSON.stringify(this.user, null, 2)}
                        </pre>
                        <br/>
                        Destiny Profile
                        <pre>
                            {JSON.stringify(this.profile, null, 2)}
                        </pre>
                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        ) : (
            <button type="button" className="btn btn-primary" onClick={this.authorize}>Authorize with Bungie</button>
        );
    }
}

export default MainPlayer;
