const Platforms = {
    NONE: '0',
    XBOX: '1',
    PSN: '2',
    PC: '3'
};

const PlatformNames = {
    '1': 'xbox',
    '2': 'psn',
    '3': 'pc'
};

const GameModes = {
    5: {
        id: 'AllPvP',
        name: 'All Modes',
        icon: ''
    },
    10: {
        id: 'Control',
        name: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    12: {
        id: 'Clash',
        name: 'Clash',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    31: {
        id: 'Supremacy',
        name: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    37: {
        id: 'Survival',
        name: 'Survival',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    38: {
        id: 'Countdown',
        name: 'Countdown',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    },
    39: {
        id: 'TrialsOfTheNine',
        name: 'Trials of the Nine',
        icon: '/img/theme/destiny/icons/game_modes/crucible_clash.png'
    }
};

const CharacterTypes = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock'
};

// curl --header "X-API-KEY: c872c424bad64eaa86c7ddbc55155b62" https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/374818561/ | python -m json.tool
const Maps = {
    760130722: 'The Dead Cliffs',
    3839751954: 'Altar of Flame',
    2519458964: 'Endless Vale',
    652598202: 'Legion\'s Gulch',
    2464834848: 'Midtown',
    2667533713: 'Vostok',
    2033669713: 'Javelin-4',
    1988701745: 'Retribution',
    1720510574: 'The Fortress',
    374818561: 'Emperor\'s Respite'
};

export { Platforms, PlatformNames, GameModes, CharacterTypes, Maps };
