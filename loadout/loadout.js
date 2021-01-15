
const randomStat = () => {
    return Math.floor((Math.random() * 20) + 1);
};

class Armor {
    constructor(args) {
        Object.assign(this, args);
    }

    get total() {
        return this.mobility + this.resilience + this.recovery + this.discipline + this.intellect + this.strength;
    }

    get isExotic() {
        return false;
    }

    get isMasterworked() {
        return false;
    }
}

class Loadout {
    constructor(args) {
        Object.assign(this, args);
    }

    calcStat(stat) {
        return this.helmet[stat] + this.arms[stat] + this.chest[stat] + this.legs[stat] + this.classitem[stat];
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

    get totalWaste() {
        return this.mobilityWaste + this.resilienceWaste + this.recoveryWaste + this.disciplineWaste + this.intellectWaste + this.strengthWaste;
    }

    get averageWaste() {
        return this.totalWaste/6;
    }

    get medianWaste() {
        const arr = [
            this.mobilityWaste, 
            this.resilienceWaste, 
            this.recoveryWaste, 
            this.disciplineWaste, 
            this.intellectWaste, 
            this.strengthWaste
        ].sort();
        const mid = Math.floor(arr.length / 2);
        return (arr[2] + arr[3]) / 2;
    }

    // how valueable this loadout is as a sum of all normalized stats
    // for example, if total stats are 55/62/100/20/84/33,
    // then value is: 5+6+10+2+8+3=21+13=34
    get value() {
        return (
            Math.floor(this.mobility/10) +
            Math.floor(this.resilience/10) +
            Math.floor(this.recovery/10) +
            Math.floor(this.discipline/10) +
            Math.floor(this.intellect/10) +
            Math.floor(this.strength/10)
        );
    }

    get isValid() {
        let exotics = 0;
        if (this.helmet.isExotic) {
            exotics++;
        }
        if (this.arms.isExotic) {
            exotics++;
        }
        if (this.chest.isExotic) {
            exotics++;
        }
        if (this.legs.isExotic) {
            exotics++;
        }
        return exotics < 2;
    }

    info() {
        console.log('stats: ', this.mobility, '/', this.resilience, '/', this.recovery, '/', 
                    this.discipline, '/', this.intellect, '/', this.strength);
        console.log('total waste', this.totalWaste);
        console.log('average waste', this.averageWaste);
        //console.log('median waste', this.medianWaste);
        console.log('value', this.value);
    }

}

const randomArmor = (max) => {
    const arr = [];
    for (let i = 0; i < max; i++) {
        const args = {
            mobility: randomStat(),
            resilience: randomStat(),
            recovery: randomStat(),
            discipline: randomStat(),
            intellect: randomStat(),
            strength: randomStat()
        };
        arr.push(new Armor(args));
    }
    return arr;
}

let helmets = randomArmor(3);
let arms = randomArmor(5);
let chests = randomArmor(5)
let legs = randomArmor(2)
let classitems = randomArmor(1);

let loadouts = [];

helmets.forEach(helmet => {
    arms.forEach(arm=> {
        chests.forEach(chest => {
            legs.forEach(leg => {
                classitems.forEach(classitem => {
                    const args = {
                        helmet: helmet,
                        arms: arm,
                        chest: chest,
                        legs: leg,
                        classitem: classitem,
                    };
                    const loadout = new Loadout(args);
                    if (loadout.isValid) {
                        loadouts.push(loadout);
                    }
                })
            })
        })
    })
});

console.log('loadouts built', loadouts.length);
//loadouts.forEach(l => console.log(l.medianWaste))

const compareLoadouts = (l1, l2) => {
    return l1.averageWaste - l2.averageWaste;
}

console.log('sorting...')
loadouts.sort(compareLoadouts)
loadouts.forEach(l => l.info())