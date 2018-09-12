/* global Config */
import { extendObservable, observable, computed, action } from 'mobx';
import destiny2 from '../destiny2';
import { Platforms } from '../constants';

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

                abilityKills: args.extended.values.weaponKillsAbility.basic.value,
                meleeKills: args.extended.values.weaponKillsMelee.basic.value,
                grenadeKills: args.extended.values.weaponKillsGrenade.basic.value,
                superKills: args.extended.values.weaponKillsSuper.basic.value,

                score: args.values.score.basic.value,
                teamName: args.values.team ? args.values.team.basic.displayValue : null,
                standing: args.values.standing ? args.values.standing.basic.displayValue : null,
                completed: args.values.completed.basic.value,

                weaponStats: args.extended.weapons ? args.extended.weapons.map(weaponArgs => new WeaponModel(weaponArgs)) : []
            });
        } catch (e) {
            console.log('PlayerModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    get description() {
        return `${ this.characterClass } lvl ${ this.characterLevel }`;
    }

    @computed get url() {
        return `/${ Platforms[this.membershipType].name.toLowerCase() }/${ this.membershipId }`;
    }
}

class WeaponModel {
    constructor(args) {
        try {
            extendObservable(this, {
                referenceId: args.referenceId,
                kills: args.values.uniqueWeaponKills.basic.value,
                precisionKills: args.values.uniqueWeaponPrecisionKills.basic.value,
                name: null,
                description: null,
                icon: null
            });
        } catch (e) {
            console.log('WeaponModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    @computed get loaded() {
        return !!this.name;
    }

    @action setStats(data) {
        this.name = data.displayProperties.name;
        this.description = data.displayProperties.description;
        this.icon = data.displayProperties.icon;
    }

    load() {
        return destiny2.getItemDefinition(this.referenceId).then(res => this.setStats(res));
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
