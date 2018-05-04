import React from 'react';
import { observer } from 'mobx-react';

import GameModel from './gameModel.jsx';
import Utils from './utils';
import SearchForm from './components/searchForm.jsx';
import ErrorMessage from './components/errorMessage.jsx';
import Spinner from './components/spinner.jsx';
import { ActivityDetails } from './components/activity.jsx';

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
        const loading = this.viewModel && this.viewModel.loading;

        return (
            <div>
                <div className="top_container">
                    <SearchForm
                        loading={ this.viewModel ? this.viewModel.loading : false }
                    />
                    <div className="clear" />
                </div>
                { loading ? (
                    <div className="bottom-spinner">
                        <Spinner size="fa-2x" />
                    </div>
                ) : null }
                { failed ? <ErrorMessage message={ this.viewModel.error } /> : null }
                { success ? (
                    <div className="col-md-4 game_container">
                        <ActivityDetails data={ this.viewModel.data } />
                    </div>
                ) : null }
            </div>
        );
    }
});

export default MainGame;
