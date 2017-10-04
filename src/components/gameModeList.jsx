import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';

import { GameModes } from '../constants';

const GameModeList = observer(class GameModeList extends React.Component {
    onChange(e) {
        this.props.viewModel.changeGameMode(e.target.value);
    }

    render() {
        const modes = Object.values(GameModes);
        const options = modes.map(mode => (
            <option key={ mode.id } value={ mode.id }>
                { mode.name }
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
