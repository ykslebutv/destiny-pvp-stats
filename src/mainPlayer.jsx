import React from 'react';
import { observer } from 'mobx-react';

import Model from './model.jsx';
import Utils from './utils';
import SearchForm from './components/searchForm.jsx';
import PlayerInfo from './components/playerInfo.jsx';
import GameModeList from './components/gameModeList.jsx';
import CharacterList from './components/character.jsx';
import Spinner from './components/spinner.jsx';
import ErrorMessage from './components/errorMessage.jsx';

const MainPlayer = observer(class MainPlayer extends React.Component {
    constructor(props) {
        super(props);

        const params = Utils.getUrlParams();

        if (params.platform && (params.name || params.id)) {
            this.viewModel = new Model({
                id: params.id,
                name: params.name,
                platform: params.platform,
                mode: params.mode
            });
            this.viewModel.load();
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (Utils.isScrolledToBottom() && this.viewModel && this.viewModel.success) {
            this.viewModel.loadNextPage();
        }
    }

    render() {
        const success = this.viewModel && this.viewModel.success;
        const failed = this.viewModel && this.viewModel.failed;
        const loadingPage = this.viewModel && this.viewModel.loadingPage;

        return (
            <div>
                <div className="top_container">
                    <SearchForm
                        loading={ this.viewModel ? this.viewModel.loading : false }
                    />
                    { success ? <PlayerInfo player={ this.viewModel.player } /> : null }
                    { success ? <GameModeList viewModel={ this.viewModel } /> : null }
                    <div className="clear" />
                </div>
                { failed ? <ErrorMessage message={ this.viewModel.error } /> : null }
                { success ? <CharacterList characters={ this.viewModel.characters } /> : null }
                { loadingPage ? (
                    <div className="bottom-spinner">
                        <Spinner size="fa-2x" />
                    </div>
                ) : null }
                { !success ? <About /> : null }
            </div>
        );
    }
});

const About = () => (
    <div className="about">
        <a href="/d1">Destiny 1 PvP Stats</a>
    </div>
);

export default MainPlayer;
