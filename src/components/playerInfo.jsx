/* global Config */
import React from 'react';

import { Platforms } from '../constants';
import Progression from './progression.jsx';

const PlayerInfo = props => (
    <div className="player_info">
        <div>
            <i className={ `fab fa-lg fa-${ Platforms[props.player.membershipType].faIcon } platform_icon` } />
            <span className="player_name">{ props.player.displayName }</span><br />
            <span className="player_stat">{ props.player.clanName || 'No clan' }</span>
            <span className="clan_tag">{ props.player.clanTag ? ` [${ props.player.clanTag }]` : '' }</span>
        </div>
        <Progression data={ props.player.progression } />
    </div>
);

export default PlayerInfo;
