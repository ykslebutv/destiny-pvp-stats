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
const GameModes = {
    5: {
        key: '',
        responseKey: 'allPvP',
        displayName: 'All Modes',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    10: {
        key: 'control',
        responseKey: 'control',
        displayName: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    12: {
        key: 'clash',
        responseKey: 'clash',
        displayName: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    15: {
        key: 'doubles',
        responseKey: 'crimsonDoubles',
        displayName: 'Crimson Doubles',
        icon: '/img/theme/destiny/icons/game_modes/Crimson_Playlist.png'
    },
    19: {
        key: 'ib',
        responseKey: 'ironBanner',
        displayName: 'Iron Banner',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    25: {
        key: 'mayhem',
        responseKey: 'allMayhem',
        displayName: 'Mayhem',
        icon: '/img/theme/destiny/icons/game_modes/crucible_mayhem.png'
    },
    31: {
        key: 'supremacy',
        responseKey: 'supremacy',
        displayName: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    37: {
        key: 'survival',
        responseKey: 'survival',
        displayName: 'Survival',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    38: {
        key: 'countdown',
        responseKey: 'countdown',
        displayName: 'Countdown',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    39: {
        key: 'trials',
        responseKey: 'trialsofthenine',
        displayName: 'Trials of the Nine',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    41: {
        responseKey: 'trialsCountdown',
        displayName: 'Trials (Countdown)',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    42: {
        responseKey: 'trialsSurvival',
        displayName: 'Trials (Survival)',
        icon: '/img/theme/destiny/icons/game_modes/trials_of_the_nine.png'
    },
    43: {
        responseKey: 'ironBannerControl',
        displayName: 'Iron Banner (Control)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    44: {
        responseKey: 'ironBannerClash',
        displayName: 'Iron Banner (Clash)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    45: {
        responseKey: 'ironBannerSupremacy',
        displayName: 'Iron Banner (Supremacy)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
    },
    48: {
        key: 'rumble',
        responseKey: 'rumble',
        displayName: 'Rumble',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    32: {
        key: 'pm',
        responseKey: 'privateMatches',
        displayName: 'Private Matches',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    51: {
        responseKey: '',
        displayName: 'Clash (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    52: {
        responseKey: '',
        displayName: ' Control (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    53: {
        responseKey: '',
        displayName: 'Supremacy (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    54: {
        responseKey: '',
        displayName: 'Countdown (Private)',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    55: {
        responseKey: '',
        displayName: 'Survival (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    56: {
        responseKey: '',
        displayName: 'Mayhem (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_mayhem.png'
    },
    57: {
        responseKey: '',
        displayName: 'Rumble (Private)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    59: {
        key: 'showdown',
        responseKey: 'showdown',
        displayName: 'Showdown',
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

export { Platforms, GameModes, CharacterTypes, Maps, StatHashes };
