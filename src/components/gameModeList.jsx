import React from 'react';
import { observer } from 'mobx-react';

import { GameModes } from '../constants';
import Utils from '../utils';
import Manifest from '../manifest.json';

const MenuModes = [
    {
        id: GameModes.AllPvp,
        label: 'All PvP'
    },
    0,
    {
        id: GameModes.PvPQuickplay,
        label: 'Quickplay'
    },
    {
        id: GameModes.PvPCompetitive,
        label: 'Competitive'
    },
    {
        id: GameModes.TrialsOfOsiris,
        label: 'Trials of Osiris'
    },
    0,
    {
        id: GameModes.IronBanner,
        label: 'Iron Banner'
    },
    {
        id: GameModes.Mayhem,
        label: 'Mayhem'
    },
    {
        id: GameModes.AllDoubles,
        label: 'Doubles'
    },
    {
        id: GameModes.Elimination,
        label: 'Elimination'
    },
    {
        id: GameModes.Rumble,
        label: 'Rumble'
    },
    {
        id: GameModes.PrivateMatches,
        label: 'Private Matches'
    },
    0,
    {
        id: GameModes.AllPveComp,
        label: 'Gambit'
    },
    0,
    {
        id: GameModes.AllPve,
        label: 'All PvE'
    },
    {
        id: GameModes.AllStrikes,
        label: 'Strikes'
    },
    {
        id: GameModes.Raid,
        label: 'Raids'
    }
];

@observer class GameModeList extends React.Component {
    onChange(e) {
        Utils.route({
            mode: e.target.value
        });
    }

    render() {
        let key = 0;
        const currentMode = Manifest.DestinyActivityModeDefinition[this.props.viewModel.mode].friendlyName;

        const options = MenuModes.map(menuMode =>
            menuMode.id ? (
                <option key={ key++ } value={ Manifest.DestinyActivityModeDefinition[menuMode.id].friendlyName }>
                    { menuMode.label }
                </option>
            ) : (
                <option key={ key++ } className="separator" disabled>───────</option>
            )
        );

        return (
            <div className="game_mode_list">
                <select className="form-control btn btn-primary" value={ currentMode } onChange={ value => this.onChange(value) }>
                    { options }
                </select>
            </div>
        );
    }
}

export default GameModeList;
