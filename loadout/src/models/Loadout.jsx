import { computed } from 'mobx';
import React from 'react';
import MediaQuery from 'react-responsive';

export default class Loadout {
  constructor(args) {
    Object.assign(this, args);
  }

  get items() {
    return [this.helmet, this.arms, this.chest, this.legs, this.classitem];
  }

  calcStat(stat) {
    let sum = 0;
    this.items.forEach(item => sum += item[stat]);
    return sum;
  }

  calcWaste(stat) {
    return this[stat] % 10;
  }
  
  get mobility() {
    return this.calcStat('mobility');
  }

  get mobilityWaste() {
    return this.calcWaste('mobility');
  }

  get resilience() {
    return this.calcStat('resilience');
  }

  get resilienceWaste() {
    return this.calcWaste('resilience');
  }

  get recovery() {
    return this.calcStat('recovery');
  }

  get recoveryWaste() {
    return this.calcWaste('recovery');
  }

  get discipline() {
    return this.calcStat('discipline');
  }

  get disciplineWaste() {
    return this.calcWaste('discipline');
  }

  get intellect() {
    return this.calcStat('intellect');
  }

  get intellectWaste() {
    return this.calcWaste('intellect');
  }

  get strength() {
    return this.calcStat('strength');
  }

  get strengthWaste() {
    return this.calcWaste('strength');
  }

  @computed get totalWaste() {
    return this.mobilityWaste + this.resilienceWaste + this.recoveryWaste + this.disciplineWaste + this.intellectWaste + this.strengthWaste;
  }

  get averageWaste() {
    return (this.totalWaste/6).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }

  get medianWaste() {
    const arr = [this.mobilityWaste, this.resilienceWaste, this.recoveryWaste, this.disciplineWaste, this.intellectWaste, this.strengthWaste].sort();
    const mid = Math.floor(arr.length / 2);
    return (arr[2] + arr[3]) / 2;
  }

  get isValid() {
    let exotics = 0;
    this.items.forEach(item => exotics += item.isExotic ? 1 : 0);
    return exotics < 2;
  }

  passesFilter(filterItems) {
    return filterItems.find(id => this.items.find(item => item.id === id));
  }

  // how valueable this loadout is as a sum of all normalized stats
  // for example, if total stats are 55/62/100/20/84/33,
  // then value is: 5+6+10+2+8+3=21+13=34
  @computed get value() {
    return (
        Math.floor(this.mobility/10) +
        Math.floor(this.resilience/10) +
        Math.floor(this.recovery/10) +
        Math.floor(this.discipline/10) +
        Math.floor(this.intellect/10) +
        Math.floor(this.strength/10)
    );
  }

  get numberOfItemsThatCanBeMasterworked() {
    let nMasterworked = 0;
    this.items.forEach(item => nMasterworked += item.isMasterworked ? 1 : 0);
    return 5 - nMasterworked;
  }

  @computed get potential() {
    const potentials = Object.values(this.potentialMap);
    if (potentials.length > 0) {
      return Math.max(...potentials);
    } else {
      return this.value;
    }
  }

  @computed get potentialMap() {
    const potentials = {};
    const d = 2;
    for (let m = 1; m <= this.numberOfItemsThatCanBeMasterworked; m++) {
        let potValue = this.value;
        let s = d * m;
        potValue = (
            Math.floor((this.mobility+s)/10) +
            Math.floor((this.resilience+s)/10) +
            Math.floor((this.recovery+s)/10) +
            Math.floor((this.discipline+s)/10) +
            Math.floor((this.intellect+s)/10) +
            Math.floor((this.strength+s)/10)
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
      //console.log('median waste', this.medianWaste);
      console.log('value', this.value);
  }

  show() {
    const armorRow = [
        <div className="col-armor">{this.helmet.show()}</div>,
        <div className="col-armor">{this.arms.show()}</div>,
        <div className="col-armor">{this.chest.show()}</div>,
        <div className="col-armor">{this.legs.show()}</div>,
        <div className="col-armor">{this.classitem.show()}</div>
    ];

    const statRow = [
        <div className="col-stat">
            Mob: {this.mobility}<br/>
            Res: {this.resilience}<br/>
            Rec: {this.recovery}
        </div>,
        <div className="col-stat">
            Dis: {this.discipline}<br/>
            Int: {this.intellect}<br/>
            Str: {this.strength}
        </div>,
        <div className="col-stat">
           Value: {this.value}<br/>
           Waste: {this.totalWaste}<br/>
           Potential: {this.potential}
        </div>
    ];

    return [
      <MediaQuery query="(max-width: 670px)">
        <div className="loadout">
          <div className="flex-container">
            { armorRow }
          </div>
          <div className="flex-container mt">
            { statRow }
          </div>
        </div>
      </MediaQuery>,
      <MediaQuery query="(min-width: 671px)">
        <div className="flex-container loadout">
          { armorRow }
          { statRow }
        </div>
      </MediaQuery>
    ];
  }
}
