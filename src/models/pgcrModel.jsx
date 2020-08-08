/* global Config */
import { extendObservable, observable, computed, action } from 'mobx';
import destiny2 from '../destiny2';
import { Platforms, ExtendedStats } from '../constants';
import DestinyInventoryItemDefinition from '../manifest/DestinyInventoryItemDefinition.json';

class TeamModel {
    constructor(args) {
        try {
            extendObservable(this, {
                name: args.teamName,
                score: args.score ? args.score.basic.value : null,
                standing: args.standing ? args.standing.basic.displayValue : null,
                players: []
            });
        } catch (e) {
            console.log('TeamModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get won() {
        return this.standing === 'Victory';
    }
}

class PlayerModel {
    constructor(args) {
        try {
            extendObservable(this, {
                name: args.player.destinyUserInfo.displayName,
                characterId: args.characterId,
                membershipId: args.player.destinyUserInfo.membershipId,
                membershipType: args.player.destinyUserInfo.membershipType,

                characterClass: args.player.characterClass,
                characterLevel: args.player.characterLevel,

                kills: args.values.kills.basic.value,
                deaths: args.values.deaths.basic.value,
                assists: args.values.assists.basic.value,
                killsDeathsRatio: args.values.killsDeathsRatio.basic.displayValue,

                score: args.values.score.basic.value,
                teamName: args.values.team ? args.values.team.basic.displayValue : null,
                standing: args.values.standing ? args.values.standing.basic.displayValue : null,
                completed: args.values.completed.basic.value,

                weaponStats: args.extended.weapons ? args.extended.weapons.map(weaponArgs => new WeaponModel(weaponArgs)) : [],

                extendedStats: Object.assign({}, ...Object.keys(ExtendedStats).map(key => {
                    return args.extended.values[key] && args.extended.values[key].basic.value ? { [key]: args.extended.values[key].basic.displayValue } : {};
                }))
            });
        } catch (e) {
            console.log('PlayerModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get displayName() {
        return this.name || this.membershipId;
    }

    get description() {
        return `${ this.characterClass } lvl ${ this.characterLevel }`;
    }

    @computed get url() {
        try {
            return `/${ Platforms[this.membershipType].name.toLowerCase() }/${ this.membershipId }`;
        } catch (e) {
            console.log('PlayerModel::url exception', e);
            return '';
        }
    }
}

class WeaponModel {
    constructor(args) {
        try {
            extendObservable(this, {
                referenceId: args.referenceId,
                kills: args.values.uniqueWeaponKills.basic.value,
                precisionKills: args.values.uniqueWeaponPrecisionKills.basic.value,
                name: DestinyInventoryItemDefinition[args.referenceId].name,
                icon: DestinyInventoryItemDefinition[args.referenceId].icon
            });
        } catch (e) {
            console.log('WeaponModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    @computed get iconUrl() {
        return this.icon ? `${ Config.baseUrl }${ this.icon }` : '';
    }
}

class PGCRModel {
    @observable teams = [];

    constructor(args) {
        try {
            if (args.teams.length) {
                this.teams = args.teams.map(teamArgs => new TeamModel(teamArgs));
            } else {
                // team rumble
                this.teams = [new TeamModel({ teamName: null })];
            }

            args.entries.map(playerArgs => {
                const player = new PlayerModel(playerArgs);
                const playerTeam = this.teams.find(team => team.name === player.teamName);
                if (playerTeam) {
                    playerTeam.players.push(player);
                }
            });
        } catch (e) {
            console.log('PGCRModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }
}

export default PGCRModel;
