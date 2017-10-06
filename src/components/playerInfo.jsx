/* global Config */
import React, { PropTypes } from 'react';

const PlayerInfo = props => (
    <div className="player_info">
        <div>
            <img className="platform_icon" src={ Config.baseUrl + props.player.iconPath } />
            <span className="player_name">{ props.player.displayName }</span><br />
            <span className="player_stat">{ props.player.clanName || 'No clan' }</span>
            <span className="clan_tag">{ props.player.clanTag ? ` [${ props.player.clanTag }]` : '' }</span>
        </div>
    </div>
);

export default PlayerInfo;
