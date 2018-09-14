import React from 'react';
import { observer } from 'mobx-react';

import { GameModes } from '../constants';
import Utils from '../utils';

const MenuModes = [
    5  /* AllPvP */,
    0,
    10 /* Control */,
    12 /* Clash */,
    31 /* Supremacy */,
    48 /* Rumble */,
    0,
    37 /* Survival */,
    38 /* Countdown */,
    39 /* TrialsOfTheNine */,
    0,
    19 /* IronBanner */,
    25 /* Mayhem */,
    49 /* Doubles */,
    0,
    32 /* Private Matches */
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
