const Platforms = {
    1: {
        name: 'Xbox',
        faIcon: 'xbox'
    },
    2: {
        name: 'PSN',
        faIcon: 'playstation'
    },
    3: {
        name: 'PC',
        faIcon: 'steam'
    },
    4: {
        name: 'Bnet',
        faIcon: 'windows'
    },
    5: {
        name: 'Stadia',
        faIcon: 'gamepad'
    }
};

const GameModes = {
    Null: 0,
    Story: 2,
    Strike: 3,
    Raid: 4,
    AllPvp: 5,
    Patrol: 6,
    AllPve: 7,
    Control: 10,
    Clash: 12,
    CrimsonDoubles: 15,
    Nightfall: 16,
    AllStrikes: 18,
    Mayhem: 25,
    Supremacy: 31,
    PrivateMatches: 32,
    IronBanner: 19,
    Survival: 37,
    Countdown: 38,
    TrialsOfTheNine: 39,
    Social: 40,
    TrialsCountdown: 41,
    TrialsSurvival: 42,
    IronBannerControl: 43,
    IronBannerClash: 44,
    IronBannerSupremacy: 45,
    ScoredNightfall: 46,
    ScoredHeroicNightfall: 47,
    Rumble: 48,
    AllDoubles: 49,
    Doubles: 50,
    PrivateClash: 51,
    PrivateControl: 52,
    PrivateSupremacy: 53,
    PrivateCountdown: 54,
    PrivateSurvival: 55,
    PrivateMayhem: 56,
    PrivateRumble: 57,
    HeroicAdventure: 58,
    Showdown: 59,
    Lockdown: 60,
    Scorched: 61,
    ScorchedTeam: 62,
    Gambit: 63,
    AllPveComp: 64,
    Breakthrough: 65,
    BlackArmoryRun: 66,
    Salvage: 67,
    IronBannerSalvage: 68,
    PvPCompetitive: 69,
    PvPQuickplay: 70,
    ClashQuickplay: 71,
    ClashCompetitive: 72,
    ControlQuickplay: 73,
    ControlCompetitive: 74,
    GambitPrime: 75,
    Reckoning: 76,
    Menagerie: 77,
    VexOffensive: 78,
    NightmareHunt: 79,
    Elimination: 80,
    Momentum: 81,
    Dungeon: 82,
    Sundial: 83,
    TrialsOfOsiris: 84
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

/* map keys in PCGR extended data to display names */
const ExtendedStats = {
    weaponKillsAbility: 'Ability',
    weaponKillsMelee: 'Melee',
    weaponKillsGrenade: 'Grenade',
    weaponKillsSuper: 'Super',
    invasions: 'Invasions',
    invasionKills: 'Invasion kills',
    invaderKills: 'Invader kills',
    invaderDeaths: 'Invader deaths',

    motesGenerated: 'Motes generated',
    motesDeposited: 'Motes deposited',
    motesDenied: 'Motes denied',
    motesStolen: 'Motes stolen',
    motesLost: 'Motes lost',

    smallBlockersSent: 'Small blockers sent',
    mediumBlockersSent: 'Medium blockers sent',
    largeBlockersSent: 'Large blockers sent',
    highValueKills: 'High value kills',
    primevalDamage: 'Primeval damage',
    primevalHealing: 'Primeval healing'
};

export { Platforms, GameModes, CharacterTypes, ExtendedStats };
