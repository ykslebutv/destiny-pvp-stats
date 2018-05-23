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
        icon: '/img/theme/destiny/icons/game_modes/Crimson_Playlist.png'
    },
    19: {
        responseKey: 'ironBanner',
        displayName: 'Iron Banner',
        icon: '/img/theme/destiny/icons/game_modes/crucible_ironbanner.png'
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
        responseKey: 'rumble',
        displayName: 'Rumble',
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
    2810171920: 'Bannerfall'
};

const StatHashes = {
    'Mobility': 2996146975,
    'Resilience': 392767087,
    'Recovery': 1943323491
};

export { Platforms, GameModes, CharacterTypes, Maps, StatHashes };
