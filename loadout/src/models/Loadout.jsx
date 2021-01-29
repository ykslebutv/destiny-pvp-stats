import { computed } from 'mobx';
import React from 'react';
import MediaQuery from 'react-responsive';

const STATS = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];

export default class Loadout {
    constructor(args) {
        Object.assign(this, args);

        // value of a loadout is the sum of all normalized stats (tiers)
        // for example, if total stats are 55/62/100/20/84/33,
        // then value is 5+6+10+2+8+3=21+13=34
        this.value = 0;
        this.numberOfMasterworkedItems = 0;
        this.totalWaste = 0;
        this.potential = 0;

        STATS.forEach(stat => {
            this[stat] = 0;
        });

        this.items.forEach(item => {
            STATS.forEach(stat => {
                this[stat] += item[stat];
            });
            this.numberOfMasterworkedItems += item.isMasterworked ? 1 : 0;
        });

        STATS.forEach(stat => {
            this[`${ stat }Tier`] = Math.floor(this[stat] / 10);
            this.value += this[`${ stat }Tier`];
            this[`${ stat }Waste`] = this[stat] % 10;
            this.totalWaste += this[`${ stat }Waste`];
        });

        this.numberOfItemsThatCanBeMasterworked = 5 - this.numberOfMasterworkedItems;
        this.potential = this.calcPotential();
    }

    get items() {
        return [this.helmet, this.arms, this.chest, this.legs, this.classitem];
    }

    get averageWaste() {
        return (this.totalWaste / 6).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }

    get medianWaste() {
        const arr = [this.mobilityWaste, this.resilienceWaste, this.recoveryWaste, this.disciplineWaste, this.intellectWaste, this.strengthWaste].sort();
        const mid = Math.floor(arr.length / 2);
        return (arr[2] + arr[3]) / 2;
    }

    calcPotential() {
        const potentials = Object.values(this.potentialMap);
        if (potentials.length > 0) {
            return Math.max(...potentials);
        }
        return this.value;
    }

    get potentialMap() {
        const potentials = {};
        const d = 2;
        for (let m = 1; m <= this.numberOfItemsThatCanBeMasterworked; m++) {
            let potValue = this.value;
            const s = d * m;
            potValue = (
              Math.floor((this.mobility + s) / 10) +
              Math.floor((this.resilience + s) / 10) +
              Math.floor((this.recovery + s) / 10) +
              Math.floor((this.discipline + s) / 10) +
              Math.floor((this.intellect + s) / 10) +
              Math.floor((this.strength + s) / 10)
          );
            potentials[m] = potValue;
        }
        return potentials;
    }

    info() {
        console.log('stats: ', this.mobility, '/', this.resilience, '/', this.recovery, '/',
                  this.discipline, '/', this.intellect, '/', this.strength);
        console.log('total waste', this.totalWaste);
        console.log('average waste', this.averageWaste);
      // console.log('median waste', this.medianWaste);
        console.log('value', this.value);
    }

    show() {
        const armorRow = [
            <div className="col-armor" key="helmet">{this.helmet.show()}</div>,
            <div className="col-armor" key="arms">{this.arms.show()}</div>,
            <div className="col-armor" key="chest">{this.chest.show()}</div>,
            <div className="col-armor" key="legs">{this.legs.show()}</div>,
            <div className="col-armor" key="classitem">{this.classitem.show()}</div>
        ];

        const statRow = [
            <div className="col-stat" key="stat1">
            Mob: {this.mobility}<br />
            Res: {this.resilience}<br />
            Rec: {this.recovery}
            </div>,
            <div className="col-stat" key="stat2">
            Dis: {this.discipline}<br />
            Int: {this.intellect}<br />
            Str: {this.strength}
            </div>,
            <div className="col-stat" key="stat3">
           Value: {this.value}<br />
           Waste: {this.totalWaste}<br />
           Potential: {this.potential}
            </div>
        ];

        return [
            <MediaQuery query="(max-width: 670px)" key="mediaquery1">
                <div className="loadout">
                    <div className="flex-container">
                        { armorRow }
                    </div>
                    <div className="flex-container mt">
                        { statRow }
                    </div>
                </div>
            </MediaQuery>,
            <MediaQuery query="(min-width: 671px)" key="mediaquery2">
                <div className="flex-container loadout">
                    { armorRow }
                    { statRow }
                </div>
            </MediaQuery>
        ];
    }
}

Loadout.CreateLoadout = args => {
    let exotics = 0;
    const items = [args.helmet, args.arms, args.chest, args.legs, args.classitem];
    const filter = args.filter || [];
    let passesFilter = filter.length === 0;

    items.forEach(item => {
        if (item.isExotic) {
            exotics++;
        }
        if (!passesFilter) {
            passesFilter = !!filter.find(id => item.id === id);
        }
    });

    if (exotics <= 1 && passesFilter) {
        return new Loadout(args);
    }
    return null;

};
