import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import { destiny2 } from '../../api/destiny2';
import Utils from './utils';
import SearchForm from './components/searchForm.jsx';
import ErrorMessage from './components/errorMessage.jsx';
import Spinner from './components/spinner.jsx';
import { ActivityDetails } from './components/activity.jsx';
import ActivityModel from './models/activityModel.jsx';
import PCGRModel from './models/pgcrModel.jsx';

@observer class MainGame extends React.Component {
    @observable activity;
    @observable loading;
    @observable error;

    @action setLoading(loading) {
        this.loading = loading;
    }

    @action setError(error) {
        this.error = error;
    }

    @action setData(data) {
        this.activity = new ActivityModel(data);
        this.activity.pcgr = new PCGRModel(data);
    }

    constructor(props) {
        super(props);

        const params = Utils.getUrlParams();

        if (params.game) {
            this.setLoading(true);
            destiny2.getPostGame(params.game).then(data => {
                this.setData(data);
                this.setLoading(false);
            }, error => {
                this.setError(error);
                this.setLoading(false);
            });
        }
    }

    render() {
        return (
            <div>
                <div className="top_container">
                    <SearchForm
                        loading={ this.loading }
                    />
                    <div className="clear" />
                </div>
                { this.loading && (
                    <div className="bottom-spinner">
                        <Spinner size="fa-2x" />
                    </div>
                ) }
                { this.error && (
                    <ErrorMessage message={ this.error } />
                ) }
                { this.activity && (
                    <div className="col-md-4 game_container">
                        <ActivityDetails activity={ this.activity } />
                    </div>
                ) }
            </div>
        );
    }
}

export default MainGame;
