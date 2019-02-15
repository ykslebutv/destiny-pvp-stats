const Platforms = {
    1: {
        name: 'Xbox',
        iconPath: 'https://bungie.net/img/theme/destiny/icons/icon_xbl.png',
        faIcon: 'xbox'
    },
    2: {
        name: 'PSN',
        iconPath: 'https://bungie.net/img/theme/destiny/icons/icon_psn.png',
        faIcon: 'playstation'
    },
    4: {
        name: 'PC',
        iconPath: 'https://cdn0.iconfinder.com/data/icons/flat-round-system/512/windows-128.png',
        faIcon: 'windows'
    }
};

// To get map names and game mode icons:
// Manifest/DestinyActivityDefinition/{HASH}/


/*
  id field is what passed to the Bungie API as mode
  key field is name of the response object
  id is upper camel case while key is lower camel case
  hence the need for 2 fields
*/

const GameModeIds = {
    Null: 0,
    Strike: 3,
    Raid: 4,
    AllPvp: 5,
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
    Trials: 39,
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
    Showdown: 59,
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
    ControlCompetitive: 74
};

const GameModes = {
    [GameModeIds.AllPvp]: {
        key: '',
        responseKey: 'allPvP',
        displayName: 'All PvP Modes',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.Control]: {
        key: 'control',
        responseKey: 'control',
        displayName: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    [GameModeIds.Clash]: {
        key: 'clash',
        responseKey: 'clash',
        displayName: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    [GameModeIds.CrimsonDoubles]: {
        key: 'crimsonDoubles',
        responseKey: 'crimsonDoubles',
        displayName: 'Crimson Doubles',
        icon: '/img/theme/destiny/icons/game_modes/Crimson_Playlist.png'
    },
    [GameModeIds.IronBanner]: {
        key: 'ib',
        responseKey: 'ironBanner',
        displayName: 'Iron Banner',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    [GameModeIds.Mayhem]: {
        key: 'mayhem',
        responseKey: 'allMayhem',
        displayName: 'Mayhem',
        icon: '/img/theme/destiny/icons/game_modes/crucible_mayhem.png'
    },
    [GameModeIds.Supremacy]: {
        key: 'supremacy',
        responseKey: 'supremacy',
        displayName: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    [GameModeIds.PrivateMatches]: {
        key: 'pm',
        responseKey: 'privateMatches',
        displayName: 'Private Matches',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.Survival]: {
        key: 'survival',
        responseKey: 'survival',
        displayName: 'Survival',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.Countdown]: {
        key: 'countdown',
        responseKey: 'countdown',
        displayName: 'Countdown',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    [GameModeIds.Trials]: {
        key: 'trials',
        responseKey: 'trialsofthenine',
        displayName: 'Trials of the Nine',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    [GameModeIds.TrialsCountdown]: {
        responseKey: 'trialsCountdown',
        displayName: 'Trials (Countdown)',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    [GameModeIds.TrialsSurvival]: {
        responseKey: 'trialsSurvival',
        displayName: 'Trials (Survival)',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    [GameModeIds.IronBannerControl]: {
        responseKey: 'ironBannerControl',
        displayName: 'Iron Banner (Control)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    [GameModeIds.IronBannerClash]: {
        responseKey: 'ironBannerClash',
        displayName: 'Iron Banner (Clash)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    [GameModeIds.IronBannerSupremacy]: {
        responseKey: 'ironBannerSupremacy',
        displayName: 'Iron Banner (Supremacy)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    [GameModeIds.Rumble]: {
        key: 'rumble',
        responseKey: 'rumble',
        displayName: 'Rumble',
        icon: '/img/theme/destiny/icons/game_modes/crucible_rumble.png'
    },
    [GameModeIds.AllDoubles]: {
        key: 'doubles',
        responseKey: 'allDoubles',
        displayName: 'Doubles',
        icon: '/img/theme/destiny/icons/game_modes/crucible_doubles.png'
    },
    [GameModeIds.Doubles]: {
        key: 'doubles50',
        responseKey: 'doubles',
        displayName: 'Doubles',
        icon: '/img/theme/destiny/icons/game_modes/crucible_doubles.png'
    },
    [GameModeIds.PrivateClash]: {
        responseKey: '',
        displayName: 'Clash (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    [GameModeIds.PrivateControl]: {
        responseKey: '',
        displayName: ' Control (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    [GameModeIds.PrivateSupremacy]: {
        responseKey: '',
        displayName: 'Supremacy (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    [GameModeIds.PrivateCountdown]: {
        responseKey: '',
        displayName: 'Countdown (Private)',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    [GameModeIds.PrivateSurvival]: {
        responseKey: '',
        displayName: 'Survival (Private)',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    [GameModeIds.PrivateMayhem]: {
        responseKey: '',
        displayName: 'Mayhem (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_mayhem.png'
    },
    [GameModeIds.PrivateRumble]: {
        responseKey: '',
        displayName: 'Rumble (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_rumble.png'
    },
    [GameModeIds.Showdown]: {
        key: 'showdown',
        responseKey: 'showdown',
        displayName: 'Showdown',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.Gambit]: {
        key: 'gambit',
        responseKey: 'pvecomp_gambit',
        displayName: 'Gambit',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.AllPveComp]: {
        key: 'pvecomp',
        responseKey: 'allPvECompetitive',
        displayName: 'PvE Competitive',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.AllStrikes]: {
        key: 'strikes',
        responseKey: 'allStrikes',
        displayName: 'Strikes',
        icon: '/img/theme/destiny/icons/game_modes/strike_default.png'
    },
    [GameModeIds.Strike]: {
        displayName: 'Normal Strike',
        icon: '/img/theme/destiny/icons/game_modes/strike_default.png'
    },
    [GameModeIds.Nightfall]: {
        displayName: 'Nightfall',
        icon: '/img/theme/destiny/icons/game_modes/strike_nightfall.png'
    },
    [GameModeIds.ScoredNightfall]: {
        displayName: 'Scored Nightfall',
        icon: '/img/theme/destiny/icons/game_modes/strike_nightfall.png'
    },
    [GameModeIds.ScoredHeroicNightfall]: {
        displayName: 'Scored Heroic Nightfall',
        icon: '/img/theme/destiny/icons/game_modes/strike_nightfall.png'
    },
    [GameModeIds.Raid]: {
        key: 'raids',
        responseKey: 'raid',
        displayName: 'Raids',
        icon: '/img/theme/destiny/icons/game_modes/raid.png'
    },
    [GameModeIds.BlackArmoryRun]: {
        key: 'blackarmory',
        responseKey: 'blackArmoryRun',
        displayName: 'Black Armory',
        icon: '/img/theme/destiny/icons/game_modes/strike_default.png'
    },
    [GameModeIds.AllPve]: {
        key: 'allPvE',
        responseKey: 'allPvE',
        displayName: 'All PvE Modes',
        icon: '/img/theme/destiny/icons/game_modes/strike_default.png'
    },
    [GameModeIds.ControlQuickplay]: {
        key: 'control',
        responseKey: 'control',
        displayName: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    [GameModeIds.ClashQuickplay]: {
        key: 'clash',
        responseKey: 'clash',
        displayName: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    [GameModeIds.PvPQuickplay]: {
        key: 'quickplay',
        responseKey: 'pvpQuickplay',
        displayName: 'All Quickplay',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.ControlCompetitive]: {
        key: 'controlcomp',
        responseKey: 'controlCompetitive',
        displayName: 'Control (comp)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    [GameModeIds.ClashCompetitive]: {
        key: 'clashcomp',
        responseKey: 'clashCompetitive',
        displayName: 'Clash (comp)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    [GameModeIds.PvPCompetitive]: {
        key: 'competitive',
        responseKey: 'pvpCompetitive',
        displayName: 'All Competitive',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

const StatHashes = {
    'Mobility': 2996146975,
    'Resilience': 392767087,
    'Recovery': 1943323491
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

export { Platforms, GameModeIds, GameModes, CharacterTypes, StatHashes, ExtendedStats };
