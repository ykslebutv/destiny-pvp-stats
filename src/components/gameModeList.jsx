import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import { GameModes } from '../constants';

const MenuModes = [
    'AllPvP', 'Control', 'Clash', 'Supremacy',
    'Survival', 'Countdown', 'TrialsOfTheNine', 'IronBanner'];

const findMode = id => Object.values(GameModes).find(mode => mode.id === id);

const GameModeList = observer(class GameModeList extends React.Component {
    onChange(e) {
        this.props.viewModel.changeGameMode(e.target.value);
    }

    render() {
        const options = MenuModes.map(modeId => (
            <option key={ modeId } value={ modeId }>
                { findMode(modeId).name }
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
