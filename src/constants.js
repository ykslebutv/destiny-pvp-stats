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
}

const GameModes = {
    ALL: 5,
    CONTROL: 10,
    CLASH: 12,
    IB: 19,
    SUPREMACY: 31,
    SURVIVAL: 37,
    COUNTDOWN: 38
}

const GameModeNames = {
    5: {
      name: 'All',
      icon: ''
    },
    10: {
        name: 'Control',
        icon: '/img/theme/destiny/icons/game_modes/crucible_control.png'
    },
    12: {
        name: 'Clash',
        icon1: '/common/destiny_content/icons/icon_pvp_d0a189071d8eb5d009f4252bef78b551.png',
        icon: '/img/theme/destiny/icons/game_modes/crucible_default.png'
    },
    19: {
        name: 'Iron Banner',
        icon: ''
    },
    31: {
        name: 'Supremacy',
        icon: '/img/theme/destiny/icons/game_modes/crucible_supremacy.png'
    },
    37: {
        name: 'Survival',
        icon: '/common/destiny2_content/icons/03c563dc16f51e692e271ae63ba2634b.png'
    },
    38: {
        name: 'Countdown',
        icon: '/common/destiny2_content/icons/fba216b470a0b5c6c34b7ab998770af0.png'
    }
}

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
}

export { Platforms, PlatformNames, GameModes, GameModeNames, CharacterTypes, Maps };
