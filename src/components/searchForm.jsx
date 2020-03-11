import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Platforms, GameModes } from '../constants';
import Spinner from './spinner.jsx';
import Utils from '../utils';

@observer class SearchForm extends React.Component {
    @observable name = '';
    @observable platform = 0;
    @observable showRecent = false;

    @action setName(name) {
        this.name = name;
    }

    @action setPlatform(platform) {
        this.platform = platform;
    }

    @action setShowRecent(showRecent) {
        this.showRecent = showRecent;
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        Utils.route({
            platform: this.platform,
            name: this.name
        });
    }

    showRecentSearches(value) {
        this.setShowRecent(value);
    }

    submitRecentSearch(params) {
        this.setName(params.name);
        this.setPlatform(params.platform);
        this.onSubmit();
    }

    render() {
        return (
            <form onSubmit={ e => this.onSubmit(e) } id="searchForm">
                <div className="search_form_1">
                    <a href="/"><img className="logo" src="images/destiny48x48.png" /></a>
                    <input
                        className="search_field"
                        type="text"
                        value={ this.name }
                        onChange={ e => this.setName(e.target.value) }
                        onFocus={ () => this.showRecentSearches(true) }
                        onBlur={ () => this.showRecentSearches(false) }
                    />
                </div>
                <div className="search_form_2">
                    { [2, 1, 3].map(platformId => (
                        <label key={ platformId } >
                            <input
                                type="radio"
                                name="platform"
                                value={ platformId }
                                onChange={ () => this.setPlatform(platformId) }
                                checked={ this.platform === platformId }
                            /> { Platforms[platformId].name }
                        </label>
                    )) }
                    <button
                        className="btn btn-primary"
                        style={{ minWidth: '80px' }}
                        disabled={ !this.platform || !this.name }
                    >
                        { this.props.loading ? <Spinner /> : 'search' }
                    </button>
                </div>
                { this.showRecent && <RecentSearches
                    filter={ this.name }
                    onChange={ params => this.submitRecentSearch(params) }
                /> }
            </form>
        );
    }
}

@observer class RecentSearches extends React.Component {
    onClick(params) {
        this.props.onChange(params);
    }

    get recentPlayers() {
        const filter = this.props.filter.toLowerCase();
        const maxListSize = 7;
        return Utils.getRecentPlayers()
            .filter(player => player.name.toLowerCase().startsWith(filter))
            .slice(0, maxListSize);
    }

    render() {
        const playersList = this.recentPlayers.map(player => (
            <li key={ `${player.name}-${player.platform}` } onMouseDown={ () => this.onClick(player) } >
                <i className={ `fab fa-fw fa-${ Platforms[player.platform].faIcon }` } />
                { player.name }
            </li>
        ));
        return playersList.length ? (
            <div className="floating-list recet-searches">
                <ul>
                    { playersList }
                </ul>
            </div>
        ) : null;
    }
}

export default SearchForm;
