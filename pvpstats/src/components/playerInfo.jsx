/* global Config */
import React from 'react';
import Utils from '../utils.js';

import { Platforms } from '../constants';

const PlayerInfo = props => (
    <div className="player_info">
        <div>
            <i className={ `fab fa-lg fa-${ Platforms[props.player.membershipType].faIcon } platform_icon` } />
            <span className="player_name">{ props.player.displayName }</span><br />
            <span className="player_stat">{ Utils.utfCodeReplace(props.player.clanName || 'No clan') }</span>
            <span className="clan_tag">{ props.player.clanTag ? ` [${ props.player.clanTag }]` : '' }</span>
        </div>
    </div>
);

export default PlayerInfo;
