import React from 'react';
import { observer } from 'mobx-react';

import GameModel from './gameModel.jsx';
import Utils from './utils';
import ErrorMessage from './components/errorMessage.jsx';

const MainGame = observer(class MainGame extends React.Component {
    constructor(props) {
        super(props);

        const params = Utils.getUrlParams();

        if (params.game) {
            this.viewModel = new GameModel({ activityId: params.game });
            this.viewModel.load();
        }
    }

    render() {
        const success = this.viewModel && this.viewModel.success;
        const failed = this.viewModel && this.viewModel.failed;

        return (
            <div>
                { failed ? <ErrorMessage message={ this.viewModel.error } /> : null }
                MainGame
            </div>
        );
    }
});

export default MainGame;
