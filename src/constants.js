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
    AllPvp: 5,
    Control: 10,
    Clash: 12,
    CrimsonDoubles: 15,
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
    AllPveComp: 64
};

const GameModes = {
    [GameModeIds.AllPvp]: {
        key: '',
        responseKey: 'allPvP',
        displayName: 'All Modes',
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
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.AllDoubles]: {
        key: 'doubles',
        responseKey: 'allDoubles',
        displayName: 'Doubles',
        icon: '/img/theme/destiny/icons/game_modes/Crimson_Playlist.png'
    },
    [GameModeIds.Doubles]: {
        key: 'doubles50',
        responseKey: 'doubles',
        displayName: 'Doubles',
        icon: '/img/theme/destiny/icons/game_modes/Crimson_Playlist.png'
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
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    [GameModeIds.Showdown]: {
        key: 'showdown',
        responseKey: 'showdown',
        displayName: 'Showdown',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.Gambit]: {
        key: 'gambit_only',
        responseKey: 'pvecomp_gambit',
        displayName: 'Gambit',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    [GameModeIds.AllPveComp]: {
        key: 'gambit',
        responseKey: 'allPvECompetitive',
        displayName: 'Gambit',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    }
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

const Maps = {
    /* vanilla */
    3164915257: 'The Dead Cliffs',
    750001803: 'Altar of Flame',
    399506119: 'Endless Vale',
    1711620427: 'Legion\'s Gulch',
    777592567: 'Midtown',
    332234118: 'Vostok',
    806094750: 'Javelin-4',
    3849796864: 'Retribution',
    1583254851: 'The Fortress',
    778271008: 'Emperor\'s Respite',
    2233665874: 'Eternity',
    2666761222: 'Distant Shore',

    /* curse of osiris */
    532383918: 'Radiant Cliffs',
    1673114595: 'Pacifica',
    2748633318: 'Wormhaven',

    /* crimson days */
    4012915511: 'The Burnout',

    /* warmind */
    2262757213: 'Solitude',
    2473919228: 'Meltdown',
    2810171920: 'Bannerfall',

    /* private matches */

    3233852802: 'The Dead Cliffs (p)',
    666770290: 'Altar of Flame (p)',
    1489679220: 'Endless Vale (p)',
    1733006874: 'Legion\'s Gulch (p)',
    1435054848: 'Midtown (p)',
    1702649201: 'Vostok (p)',
    1003889713: 'Javelin-4 (p)',
    990984849: 'Retribution (p)',
    2800919246: 'The Fortress (p)',
    1448435553: 'Emperor\'s Respite (p)',
    3734723183: 'Eternity (p)',
    3423042035: 'Distant Shore (p)',
    931636133: 'Radiant Cliffs (p)',
    3897312654: 'Pacifica (p)',
    148937731: 'Wormhaven (p)',
    2271820498: 'The Burnout (p)',
    3349246768: 'Solitude (p)',
    3788594815: 'Meltdown (p)',
    451430877: 'Bannerfall (p)'
};

const StatHashes = {
    'Mobility': 2996146975,
    'Resilience': 392767087,
    'Recovery': 1943323491
};

export { Platforms, GameModeIds, GameModes, CharacterTypes, Maps, StatHashes };
