const Platforms = {
    1: 'Xbox',
    2: 'PSN',
    4: 'PC'
};

const GameModes = {
    5: {
        id: 'AllPvP',
        key: 'allPvP',
        name: 'All Modes',
        icon: ''
    },
    10: {
        id: 'Control',
        key: 'control',
        name: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    12: {
        id: 'Clash',
        key: 'clash',
        name: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    19: {
        id: 'IronBanner',
        key: 'ironBanner',
        name: 'Iron Banner',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    31: {
        id: 'Supremacy',
        key: 'supremacy',
        name: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    37: {
        id: 'Survival',
        key: 'survival',
        name: 'Survival',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    38: {
        id: 'Countdown',
        key: 'countdown',
        name: 'Countdown',
        icon: '/img/theme/destiny/icons/game_modes/allmodes.png'
    },
    39: {
        id: 'TrialsOfTheNine',
        key: 'trialsofthenine',
        name: 'Trials of the Nine',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    41: {
        id: '41',
        key: 'trialsCountdown',
        name: 'Trials (Countdown)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    42: {
        id: '42',
        key: 'trialsSurvival',
        name: 'Trials (Survival)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    43: {
        id: '43',
        key: 'ironBannerControl',
        name: 'Iron Banner (Control)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    44: {
        id: '44',
        key: 'ironBannerClash',
        name: 'Iron Banner (Clash)',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    }
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

// Manifest/DestinyActivityDefinition/{HASH}/
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
