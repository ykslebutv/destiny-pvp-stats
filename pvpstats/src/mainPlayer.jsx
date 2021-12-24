import React from 'react';
import { observer } from 'mobx-react';

import Model from './models/model.jsx';
import Utils from './utils';
import SearchForm from './components/searchForm.jsx';
import PlayerInfo from './components/playerInfo.jsx';
import GameModeList from './components/gameModeList.jsx';
import CharacterList from './components/character.jsx';
import Spinner from './components/spinner.jsx';
import ErrorMessage from './components/errorMessage.jsx';

@observer class MainPlayer extends React.Component {
    constructor(props) {
        super(props);

        const params = Utils.getUrlParams();

        if (params.name || params.id) {
            this.viewModel = new Model({
                name: params.name,
                id: params.id,
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
        const vm = this.viewModel;
        const success = vm && vm.success;
        const failed = vm && vm.failed;
        const loadingPage = vm && vm.loadingPage;

        return (
            <div>
                <div className="top_container">
                    <SearchForm />
                    { vm && vm.loading ? (
                        <div className="search_form_2">
                            <Spinner size="fa-lg" />
                        </div>
                    ) : null }
                    { success && vm.player ? <PlayerInfo player={ vm.player } /> : null }
                    { success && vm.player ? <GameModeList viewModel={ vm } /> : null }
                    <div className="clear" />
                </div>
                { failed ? <ErrorMessage message={ vm.error } /> : null }
                { success && vm.player ? <CharacterList characters={ vm.player.characters } /> : null }
                { loadingPage ? (
                    <div className="bottom-spinner">
                        <Spinner size="fa-2x" />
                    </div>
                ) : null }
                { !success || !vm.player ? <About /> : null }
            </div>
        );
    }
}

const About = () => (
    <div className="about">
        <a href="/d1">Destiny 1 PvP Stats</a>
    </div>
);

export default MainPlayer;
