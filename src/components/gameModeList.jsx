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
    0,
    37 /* Survival */,
    38 /* Countdown */,
    39 /* TrialsOfTheNine */,
    0,
    19 /* IronBanner */,
    48 /* Rumble */,
    25 /* Mayhem */,
    15 /* CrimsonDoubles */,
    59, /* showdown */
    0,
    32 /* Private Matches */
];

const GameModeList = observer(class GameModeList extends React.Component {
    onChange(e) {
        Utils.route({
            mode: e.target.value
        });
    }

    render() {
        const options = MenuModes.map(id =>
            id ? (
                <option key={ id } value={ id }>
                    { GameModes[id].displayName }
                </option>
            ) : (
                <option disabled>───────</option>
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
});

export default GameModeList;
