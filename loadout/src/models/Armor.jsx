import React from 'react';
import { observable, action, computed } from 'mobx';

const ArmorType = {
    Helmet: 26,
    Arms: 27,
    Chest: 28,
    Legs: 29,
    Classitem: 30
}

const sep = "+";

export default class Armor {
    constructor() {
    }

    initFromData(item, instance, manifestItem, statItem, perkItem, includeMods) {
        this.itemHash = item.itemHash;
        this.overrideStyleItemHash = item.overrideStyleItemHash;
        this.itemInstanceId = item.itemInstanceId;
        Object.assign(this, manifestItem);

        if (this.overrideStyleItemHash) {
            const overrideManifestItem = Manifest.DestinyInventoryItemDefinition[this.overrideStyleItemHash];
            this.icon = overrideManifestItem.icon;
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
                const val = parseInt(c[0]);
                const stat = c[1].toLowerCase();
                this[stat] = this[stat] - val;
            })
        }

        this.isExotic = this.tierTypeName === "Exotic";
        this.isMasterworked = this.energyCapacity === 10;
    }

    @computed get total() {
        return this.mobility + this.resilience + this.recovery + this.discipline + this.intellect + this.strength;
    }

    @computed get statMods() {
        return this.perks.filter(p => p.name === "Stat Increase" || p.name === "Stat Penalty");
    }

    get iconUrl() {
        return Config.baseUrl + this.icon;
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
        return (
            <div className="armor_info">
                {this.name}
                <br/>
                <span className="armor_stat">
                    {this.mobility}{sep}
                    {this.resilience}{sep}
                    {this.recovery}{sep}
                    {this.discipline}{sep}
                    {this.intellect}{sep}
                    {this.strength}
                    ={this.total}
                </span>
                <br/>
                {this.statMods.length > 0 ? (
                    <p className="armor_mod">
                        {this.statMods.map(m => <span>{m.description.slice(0, -1)}</span>)}
                    </p>
                ) : null}
            </div>
        );
    }

    showFull() {
        const iconStyle = this.isMasterworked ? "armor_icon masterwork" : "armor_icon";
        return (
            <div className="armor_full">
                <div className={iconStyle}>
                    <img src={this.iconUrl} />
                    <div className="armor_level">◆{this.powerLevel}</div>
                </div>
                <div className="armor_info">
                    {this.name}
                    <br/>
                    <span className="armor_stat">
                        {this.mobility}{sep}
                        {this.resilience}{sep}
                        {this.recovery}{sep}
                        {this.discipline}{sep}
                        {this.intellect}{sep}
                        {this.strength}
                        ={this.total}
                    </span>
                    <br/>
                    {this.statMods.length > 0 ? (
                        <p className="armor_mod">
                            {this.statMods.map(m => <span>{m.description.slice(0, -1)}</span>)}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }

    show() {
        const iconStyle = this.isMasterworked ? "armor_icon masterwork" : "armor_icon";
        return (
            <div className="armor">
                <div className={iconStyle}>
                    <img src={this.iconUrl} />
                    <div className="armor_level">◆{this.powerLevel}</div>
                </div>
                <div className="armor_tooltip">
                    {this.showArmorDetails()}
                </div>
            </div>
        );
    }
}
