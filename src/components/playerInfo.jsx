import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { extendObservable, observable, computed, action } from 'mobx';

const PlayerInfo = observer(class PlayerInfo extends React.Component {
    render() {
        const player = this.props.player;

        return (
            <div className="player_info">
                <div>
                    <img className="platform_icon" src={ Config.baseUrl + player.iconPath } />
                    <span className="player_name">{ this.props.player.displayName }</span><br />
                    <span className="player_stat">{ player.clanName || 'No clan' }</span>
                    <span className="clan_tag"> { this.props.player.clanTag }</span>
                </div>
            </div>
        );
    }
});

export default PlayerInfo;
