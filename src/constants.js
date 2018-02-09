const Platforms = {
    1: {
        name: 'Xbox',
        iconPath: 'https://bungie.net/img/theme/destiny/icons/icon_xbl.png'
    },
    2: {
        name: 'PSN',
        iconPath: 'https://bungie.net/img/theme/destiny/icons/icon_psn.png'
    },
    4: {
        name: 'PC',
        iconPath: 'https://cdn0.iconfinder.com/data/icons/flat-round-system/512/windows-128.png'
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
        responseKey: 'allPvP',
        displayName: 'All Modes',
        icon: ''
    },
    10: {
        responseKey: 'control',
        displayName: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    12: {
        responseKey: 'clash',
        displayName: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    15: {
        responseKey: 'crimsonDoubles',
        displayName: 'Crimson Doubles',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    19: {
        responseKey: 'ironBanner',
        displayName: 'Iron Banner',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    25: {
        responseKey: 'allMayhem',
        displayName: 'Mayhem',
        icon: '/img/theme/destiny/icons/game_modes/crucible_mayhem.png'
    },
    31: {
        responseKey: 'supremacy',
        displayName: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    37: {
        responseKey: 'survival',
        displayName: 'Survival',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    38: {
        responseKey: 'countdown',
        displayName: 'Countdown',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    39: {
        responseKey: 'trialsofthenine',
        displayName: 'Trials of the Nine',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    41: {
        responseKey: 'trialsCountdown',
        displayName: 'Trials (Countdown)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    42: {
        responseKey: 'trialsSurvival',
        displayName: 'Trials (Survival)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    43: {
        responseKey: 'ironBannerControl',
        displayName: 'Iron Banner (Control)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    44: {
        responseKey: 'ironBannerClash',
        displayName: 'Iron Banner (Clash)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    45: {
        responseKey: 'ironBannerSupremacy',
        displayName: 'Iron Banner (Supremacy)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    }
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

const Maps = {
    /* vanilla */
    760130722: 'The Dead Cliffs',
    3839751954: 'Altar of Flame',
    2519458964: 'Endless Vale',
    652598202: 'Legion\'s Gulch',
    2464834848: 'Midtown',
    2667533713: 'Vostok',
    2033669713: 'Javelin-4',
    1988701745: 'Retribution',
    1720510574: 'The Fortress',
    374818561: 'Emperor\'s Respite',
    2236648719: 'Eternity',
    1773567660: 'Distant Shore',

    /* curse of osiris */
    3306366908: 'Radiant Cliffs',
    2417088417: 'Pacifica',
    1802930364: 'Wormhaven'
};

const StatHashes = {
    'Mobility': 2996146975,
    'Resilience': 392767087,
    'Recovery': 1943323491
};

export { Platforms, GameModes, CharacterTypes, Maps, StatHashes };
