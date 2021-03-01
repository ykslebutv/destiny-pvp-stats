/* global Workdata, Config, Manifest */
import React from 'react';
import MediaQuery from 'react-responsive';
import { observer } from 'mobx-react';
import { observable, action, computed, extendObservable } from 'mobx';

import destiny2 from './destiny2';
import Armor from './models/Armor.jsx';
import Loadout from './models/Loadout.jsx';
import CharacterList from './models/Character.jsx';
import LoadoutOptimizer from './LoadoutOptimizer.jsx';
import Filter from './Filter.jsx';
import PowerFilter from './PowerFilter.jsx';
import StatsFilter from './StatsFilter.jsx';

import { Divider, Button, Tooltip } from 'antd';

const Status = {
    NOT_AUTHORIZED: null,
    AUTHORIZING: 'authorizing',
    LOADING: 'loading',
    READY: 'ready'
};

const ItemType = {
    ARMOR: 2
};

@observer export default class MainPage extends React.Component {

    @observable accessToken;

    constructor() {
        super();

        this.accessToken = localStorage.getItem('accessToken');
        if (this.accessToken) {
            this.getCurrentUser();
        }
    }

    @computed get status() {
        if (this.profile && this.profile.characters.length === this.characters.length) {
            console.log('status: ready');
            return Status.READY;
        }

        if (!this.accessToken) {
            console.log('status: not authorized');
            return Status.NOT_AUTHORIZED;
        }

        console.log('status: loading');
        return Status.LOADING;
    }

    @action.bound authorize() {
        const url = 'https://www.bungie.net/en/OAuth/Authorize?client_id=34984&response_type=code';
        window.open(url, 'Authorize with Bungie');
        window.addEventListener('storage', this.authorized);
    }

    @action.bound authorized() {
        console.log('getting access token from localStorage');
        this.accessToken = localStorage.getItem('accessToken');
        this.accessTokenError = localStorage.getItem('accessTokenError');
        console.log('got token', this.accessToken);
        this.getCurrentUser();
    }

    // @observable user = Workdata.user;
    // @observable profile = Workdata.profile;
    // @observable characters = Workdata.characters;
    @observable user;
    @observable profile;
    @observable characters = [];
    @observable model;
    @observable activeCharacterId;

    get userName() {
        return this.user ? this.user.LastSeenDisplayName : null;
    }

    get membershipType() {
        return this.user ? this.user.membershipType : null;
    }

    get membershipId() {
        return this.user ? this.user.membershipId : null;
    }

    getCurrentUser() {
        destiny2.getCurrentUser(this.accessToken).then(resUser => {
            this.receiveUser(resUser);
            destiny2.getProfile(this.membershipType, this.membershipId, this.accessToken).then(resProfile => {
                this.receiveProfile(resProfile);
                this.profile.characters.forEach(character => {
                    destiny2.getCharacter(this.membershipType, this.membershipId, character.characterId, this.accessToken).then(resChar => {
                        this.receiveCharacter(resChar);
                    });
                });
            });
        })
        .catch(error => {
            console.log('getCurrentUser error', error);
            this.handleFailure();
        });
    }

    @action receiveUser(data) {
        this.user = data.destinyMemberships.find(item => item.membershipId === data.primaryMembershipId);
    }

    @action receiveProfile(data) {
        this.profile = data;
    }

    @action receiveCharacter(data) {
        this.characters.push(data);
    }

    @computed get charactersLoaded() {
        this.characters.length > 0;
    }

    @action.bound handleFailure() {
        localStorage.removeItem('accessToken');
        this.accessToken = null;
    }

    @action.bound changeCharacter(characterId) {
        this.activeCharacterId = characterId;

        this.model = new CharacterDataModel({
            character: this.characterProfile(this.activeCharacterId),
            data: this.characterData(this.activeCharacterId),
            vaultData: {
                items: this.profile.profileInventory,
                itemComponents: this.profile.itemComponents
            }
        });
    }

    characterProfile(characterId) {
        return this.profile.characters ? this.profile.characters.find(c => c.characterId === characterId) : null;
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
                <Button type="primary" size="large" onClick={ this.authorize }>Authorize with Bungie</Button>
            </div>
        ) : null;

        const loadingRow = this.status === Status.LOADING ? (
            <div>
                <h1>LOADING...</h1>
            </div>
        ) : null;

        const characterList = this.status === Status.READY ? (
            <div>
                <Divider plain>
                    Select character
                </Divider>
                <CharacterList
                    characters={ this.profile.characters }
                    activeCharacterId={ this.activeCharacterId }
                    onClick={ this.changeCharacter }
                />
            </div>
        ) : null;

        const powerCapFilterComp = this.activeCharacterId ? (
            <div className="card mt">
                <Divider plain>
                    Min power cap &nbsp;
                    <Tooltip title="Show only items that can be infused to this power level (because Bungie doesn't want you to keep the nice things you grinded hard for)" color="blue">
                        <span style={{ cursor: 'pointer' }}>(?)</span>
                    </Tooltip>
                </Divider>
                <PowerFilter
                    value={ this.model.powerCapFilter }
                    onChange={ this.model.setPowerCapFilter }
                />
            </div>
        ) : null;

        const statsFilterComp = this.activeCharacterId ? (
            <div className="card mt">
                <Divider plain>
                    Min stats
                </Divider>
                <StatsFilter
                    model={ this.model }
                    onChange={ this.model.setStatsFilter }
                />
            </div>
        ) : null;

        const orFilterComp = this.activeCharacterId ? (
            <div className="card mt mb">
                <Divider plain>
                    Pin armor items - OR &nbsp;
                    <Tooltip title="Show loadouts containing ANY of the pinned items. This is useful for example to compare loadouts with 2 instances of the same exotic." color="blue">
                        <span style={{ cursor: 'pointer' }}>(?)</span>
                    </Tooltip>
                </Divider>
                <Filter
                    model={ this.model }
                    pinnedItems={ this.model.pinnedOrItems }
                    onAdd={ this.model.addToOrFilter }
                    onRemove={ this.model.removeFromOrFilter }
                />
            </div>
        ) : null;

        const andFilterComp = this.activeCharacterId ? (
            <div className="card mt">
                <Divider plain>
                    Pin armor items - AND &nbsp;
                    <Tooltip title="Only show loadouts containing the pinned items." color="blue">
                        <span style={{ cursor: 'pointer' }}>(?)</span>
                    </Tooltip>
                </Divider>
                <Filter
                    model={ this.model }
                    pinnedItems={ this.model.pinnedAndItems }
                    onAdd={ this.model.addToAndFilter }
                    onRemove={ this.model.removeFromAndFilter }
                />
            </div>
        ) : null;

        const loadoutComp = this.model ? (
            <LoadoutOptimizer model={ this.model } />
        ) : null;

        const footerRow = (
            <Divider plain>
                &copy; <a href="https://destinypvpstats.com">destinypvpstats.com</a>
            </Divider>
        );

        return (
            <div>
                { headerRow }
                { authorizeRow }
                { loadingRow }

                {/* { data ? <pre>{JSON.stringify(this.armorList, null, 2)}</pre> : null } */}

                <MediaQuery query="(max-width: 999px)">
                    { characterList }
                    { powerCapFilterComp }
                    { statsFilterComp }
                    { orFilterComp }
                    { andFilterComp }
                    { loadoutComp }
                </MediaQuery>

                <MediaQuery query="(min-width: 1000px)">
                    <div className="flex-container">
                        <div>
                            { characterList }
                            { powerCapFilterComp }
                            { statsFilterComp }
                            { orFilterComp }
                            { andFilterComp }
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

const STATS = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];

class CharacterDataModel {

    @observable includeMods = false;
    @observable orFilter = [];
    @observable andFilter = [];
    @observable powerCapFilter = 0;

    constructor(args) {
        Object.assign(this, args);

        STATS.forEach(stat =>
            extendObservable(this, { [`${ stat }Filter`]: 1 })
        );
    }

    @computed get armorList() {
        const data = this.data;
        if (!data) {
            return [];
        }

        const t1 = performance.now();

        const vaultData = this.vaultData;

        const list = [];

        const addArmor = item => {

            const instance = data.itemComponents.instances.data[item.itemInstanceId] || vaultData.itemComponents.instances.data[item.itemInstanceId];
            if (!instance) {
                return;
            }

            const manifestItem = Manifest.DestinyInventoryItemDefinition[item.itemHash];
            if (!manifestItem) {
                return;
            }

            const isArmor = manifestItem && manifestItem.itemType === ItemType.ARMOR;
            if (!isArmor) {
                return;
            }

            const matchClass = manifestItem && manifestItem.classType === this.character.classType;
            if (!matchClass) {
                return;
            }

            const statSource = data.itemComponents.stats.data[item.itemInstanceId] || vaultData.itemComponents.stats.data[item.itemInstanceId];
            const statItem = statSource ? statSource.stats : null;

            const perkSource = data.itemComponents.perks.data[item.itemInstanceId] || vaultData.itemComponents.perks.data[item.itemInstanceId];
            const perkItem = perkSource ? perkSource.perks : null;

            const armor = new Armor();
            armor.initFromData(item, instance, manifestItem, statItem, perkItem, this.includeMods);
            if (armor.total >= 50 || armor.isClassitem) {
                list.push(armor);
            }
        };

        data.equipment.data.items.forEach(item => addArmor(item));
        data.inventory.data.items.forEach(item => addArmor(item));
        vaultData.items.data.items.forEach(item => addArmor(item));

        const t2 = performance.now();
        console.log(`Creating armor list (${ list.length } items) took ${ t2 - t1 } milliseconds.`);

        return list;
    }

    @computed get helmets() {
        return this.armorList.filter(item => item.isHelmet && item.powerCap >= this.powerCapFilter);
    }

    @computed get arms() {
        return this.armorList.filter(item => item.isArms && item.powerCap >= this.powerCapFilter);
    }

    @computed get chests() {
        return this.armorList.filter(item => item.isChest && item.powerCap >= this.powerCapFilter);
    }

    @computed get legs() {
        return this.armorList.filter(item => item.isLegs && item.powerCap >= this.powerCapFilter);
    }

    @computed get classitems() {
        return this.armorList.filter(item => item.isClassitem && item.powerCap >= this.powerCapFilter);
    }

    @computed get loadouts() {
        const t1 = performance.now();
        const orFilter = this.orFilter.slice();
        const andFilter = this.andFilter.slice();
        const statsFilter = {};
        STATS.map(stat => statsFilter[stat] = 10 * this[`${ stat }Filter`]);

        console.log('building loadouts');
        console.log('statsFilter', statsFilter);
        const list = [];
        this.helmets.forEach(helmet => {
            this.arms.forEach(arm => {
                this.chests.forEach(chest => {
                    this.legs.forEach(leg => {
                        this.classitems.forEach(classitem => {
                            const args = {
                                helmet: helmet,
                                arms: arm,
                                chest: chest,
                                legs: leg,
                                classitem: classitem,
                                orFilter: orFilter,
                                andFilter: andFilter,
                                statsFilter: statsFilter,
                                powerCapFilter: this.powerCapFilter
                            };
                            const loadout = Loadout.CreateLoadout(args);
                            if (loadout) {
                                list.push(loadout);
                            }
                        });
                    });
                });
            });
        });

        const t2 = performance.now();
        console.log(`Building ${ list.length } loadouts took ${ t2 - t1 } milliseconds.`);

        return list;
    }

    @action.bound addToOrFilter(value) {
        if (!this.orFilter.find(item => item.id === value)) {
            this.orFilter.push(value);
        }
    }

    @action.bound removeFromOrFilter(value) {
        this.orFilter = this.orFilter.filter(id => id !== value);
    }

    @computed get pinnedOrItems() {
        return this.armorList.filter(item => this.orFilter.find(id => id === item.id));
    }

    @action.bound addToAndFilter(value) {
        if (!this.andFilter.find(item => item.id === value)) {
            this.andFilter.push(value);
        }
    }

    @action.bound removeFromAndFilter(value) {
        this.andFilter = this.andFilter.filter(id => id !== value);
    }

    @computed get pinnedAndItems() {
        return this.armorList.filter(item => this.andFilter.find(id => id === item.id));
    }

    @action.bound setPowerCapFilter(value) {
        this.powerCapFilter = value;
    }

    @action.bound setStatsFilter(stat, value) {
        this[`${ stat }Filter`] = value;
    }

    @action toggleIncludeMods() {
        this.includeMods = !this.includeMods;
    }
}
