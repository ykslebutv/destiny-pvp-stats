import React from 'react';
import { observer } from 'mobx-react';

import { GameModeIds, GameModes } from '../constants';
import Utils from '../utils';

const MenuModes = [
    GameModeIds.AllPvp,
    0,
    GameModeIds.Control,
    GameModeIds.Clash,
    GameModeIds.Supremacy,
    GameModeIds.Rumble,
    0,
    GameModeIds.Survival,
    GameModeIds.Countdown,
    GameModeIds.Trials,
    0,
    GameModeIds.IronBanner,
    GameModeIds.Mayhem,
    GameModeIds.AllDoubles,
    0,
    GameModeIds.Gambit,
    GameModeIds.AllStrikes,
    GameModeIds.Raid,
    GameModeIds.AllPve,
    0,
    GameModeIds.PrivateMatches
];

@observer class GameModeList extends React.Component {
    onChange(e) {
        Utils.route({
            mode: e.target.value
        });
    }

    render() {
        let key = 0;
        const options = MenuModes.map(id =>
            id ? (
                <option key={ key++ } value={ id }>
                    { GameModes[id].displayName }
                </option>
            ) : (
                <option key={ key++ } className="separator" disabled>───────</option>
            )
        );

        return (
            <div className="game_mode_list">
                <select className="form-control btn btn-primary" value={ this.props.viewModel.mode } onChange={ value => this.onChange(value) }>
                    { options }
                </select>
            </div>
        );
    }
}

export default GameModeList;
