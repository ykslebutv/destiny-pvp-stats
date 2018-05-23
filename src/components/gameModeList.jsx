import React from 'react';
import { observer } from 'mobx-react';

import { GameModes } from '../constants';

const MenuModes = [
    5  /* AllPvP */,
    10 /* Control */,
    12 /* Clash */,
    31 /* Supremacy */,
    37 /* Survival */,
    38 /* Countdown */,
    48 /* Rumble */,
    39 /* TrialsOfTheNine */,
    19 /* IronBanner */,
    25 /* Mayhem */,
    15 /* CrimsonDoubles */,
    32 /* Private Matches */,
];

const GameModeList = observer(class GameModeList extends React.Component {
    onChange(e) {
        this.props.viewModel.changeGameMode(e.target.value);
    }

    render() {
        const options = MenuModes.map(id => (
            <option key={ id } value={ id }>
                { GameModes[id].displayName }
            </option>
        ));

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
