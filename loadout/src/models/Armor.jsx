/* global Manifest, Config */
import React from 'react';
import { computed } from 'mobx';

import { Popover } from 'antd';

const ArmorType = {
    Helmet: 26,
    Arms: 27,
    Chest: 28,
    Legs: 29,
    Classitem: 30
};

const sep = '+';

export default class Armor {

    initFromData(item, instance, manifestItem, statItem, perkItem, includeMods) {
        this.id = item.itemInstanceId;
        this.itemHash = item.itemHash;
        this.overrideStyleItemHash = item.overrideStyleItemHash;
        this.itemInstanceId = item.itemInstanceId;
        Object.assign(this, manifestItem);

        if (this.overrideStyleItemHash) {
            const overrideManifestItem = Manifest.DestinyInventoryItemDefinition[this.overrideStyleItemHash];
            this.icon = overrideManifestItem.icon;
        }

        if (manifestItem.displayVersionWatermarkIcons) {
            this.watermarkIcon = manifestItem.displayVersionWatermarkIcons[0];
        }

        if (manifestItem.versions && manifestItem.versions.length > 0) {
            const powerCapHash = manifestItem.versions[0].powerCapHash;
            this.powerCap = Manifest.DestinyPowerCapDefinition[powerCapHash].powerCap;
        }

        this.itemLevel = instance.itemLevel;
        this.powerLevel = instance.primaryStat.value;
        this.energyCapacity = instance.energy ? instance.energy.energyCapacity : 0;

        Object.keys(statItem).forEach(statHash => {
            const stat = Manifest.DestinyStatDefinition[statHash];
            this[stat.name.toLowerCase()] = statItem[statHash].value;
        });

        this.perks = [];
        if (perkItem) {
            perkItem.forEach(perk => {
                const perkManifest = Manifest.DestinySandboxPerkDefinition[perk.perkHash];
                if (perkManifest) {
                    this.perks.push({
                        name: perkManifest.name,
                        description: perkManifest.description,
                        icon: perkManifest.icon,
                        active: perk.isActive,
                        visible: perk.visible
                    });
                }
            });
        }

        if (!includeMods) {
            this.statMods.forEach(m => {
                const c = m.description.split(' ');
                const val = parseInt(c[0], 10);
                const stat = c[1].toLowerCase();
                this[stat] = this[stat] - val;
            });
        }

        this.isExotic = this.tierTypeName === 'Exotic';
        this.isMasterworked = this.energyCapacity === 10;

        this.displayName = `${ this.name } / ${ this.powerLevel } / ${ this.total }`;
    }

    @computed get total() {
        return this.mobility + this.resilience + this.recovery + this.discipline + this.intellect + this.strength;
    }

    @computed get statMods() {
        return this.perks.filter(p => p.name === 'Stat Increase' || p.name === 'Stat Penalty');
    }

    get iconUrl() {
        return Config.baseUrl + this.icon;
    }

    get watermakrIconUrl() {
        return this.watermarkIcon ? Config.baseUrl + this.watermarkIcon : null;
    }

    get isHelmet() {
        return this.itemSubType === ArmorType.Helmet;
    }

    get isArms() {
        return this.itemSubType === ArmorType.Arms;
    }

    get isChest() {
        return this.itemSubType === ArmorType.Chest;
    }

    get isLegs() {
        return this.itemSubType === ArmorType.Legs;
    }

    get isClassitem() {
        return this.itemSubType === ArmorType.Classitem;
    }

    showArmorDetails() {
        let modkey = 0;
        return (
            <div className="armor_info">
                <div className="armor_name">{this.name}</div>
                <div className="armor_stat">
                    {this.mobility}{sep}
                    {this.resilience}{sep}
                    {this.recovery}{sep}
                    {this.discipline}{sep}
                    {this.intellect}{sep}
                    {this.strength}
                    ={this.total}
                </div>
                {this.statMods.length > 0 ? (
                    <div className="armor_mod">
                        {this.statMods.map(m => <span key={ modkey++ }>{m.description.slice(0, -1)}</span>)}
                    </div>
                ) : null}
                <p className="armor_mod">
                    Power cap: {this.isExotic ? '∞' : this.powerCap}
                </p>
            </div>
        );
    }

    showFull() {
        const iconStyle = this.isMasterworked ? 'armor_icon masterwork' : 'armor_icon';
        const modkey = 0;
        return (
            <div className="armor_full">
                <div className={ iconStyle }>
                    <img src={ this.iconUrl } />
                    <img src={ this.watermakrIconUrl } />
                    <div className="armor_level">◆{this.powerLevel}</div>
                </div>
                {this.showArmorDetails()}
            </div>
        );
    }

    show() {
        const iconStyle = this.isMasterworked ? 'armor_icon masterwork' : 'armor_icon';
        return (
            <div className="armor">
                <Popover placement="right" content={ this.showArmorDetails() }>
                    <div className={ iconStyle }>
                        <img src={ this.iconUrl } />
                        <img src={ this.watermakrIconUrl } />
                        <div className="armor_level">◆{this.powerLevel}</div>
                    </div>
                </Popover>
            </div>
        );
    }
}
