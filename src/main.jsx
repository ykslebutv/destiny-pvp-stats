import ReactDOM from 'react-dom';
import React from 'react';
import { observer } from 'mobx-react';

import Model from './model.jsx';
import Utils from './utils';
import SearchForm from './components/searchForm.jsx';
import PlayerInfo from './components/playerInfo.jsx';
import CharacterList from './components/character.jsx';
import SpinnerComp from './components/spinnerComp.jsx';

const Content = observer(class Content extends React.Component {
    constructor(props) {
        super(props);

        const params = Utils.getUrlParams();
        if (params.platform && params.name) {
            Utils.setCookie('player', params.name, 365);
            Utils.setCookie('platform', params.platform, 365);

            this.viewModel = new Model({ name: params.name, platform: params.platform });
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
        if (Utils.isScrolledToBottom()) {
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
                    <div className="clear" />
                </div>
                { failed ? <ErrorMessage message={ this.viewModel.error } /> : null }
                { success ? <CharacterList characters={ this.viewModel.characters } /> : null }
                { loadingPage ? (
                      <div className="bottom-spinner">
                          <SpinnerComp scale="0.5" color="black" />
                      </div>
                ) : null }
            </div>
        );
    }
});

const ErrorMessage = (props) => (
    <div className="error_message">
        <span>
            { props.message }
        </span>
    </div>
);

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);
