import React from 'react';
import { observer } from 'mobx-react';
import { extendObservable, action } from 'mobx';
import { Platforms } from '../constants';
import SpinnerComp from './spinnerComp.jsx';
import Utils from '../utils';

const SearchForm = observer(class SearchForm extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: '',
            platform: 0,
            showRecent: false
        });

        extendObservable(this, {
            setName: action(name => {
                this.name = name;
            }),
            setPlatform: action(platform => {
                this.platform = platform;
            }),
            setShowRecent: action(showRecent => {
                this.showRecent = showRecent;
            })
        });
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        const params = Utils.getUrlParams();
        let newUrl = '';
        if (params.base_url) {
            newUrl = params.base_url;
        } else {
            newUrl = window.location.href.replace(/\/$/, '');
        }
        const platformStr = Platforms[this.platform].name.toLowerCase();
        newUrl = `${ newUrl }/${ platformStr }/${ this.name.replace('#', '-') }`;

        window.location.href = newUrl;
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
                    { [2, 1, 4].map(platformId => (
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
                        { this.props.loading ? <SpinnerComp scale="0.5" color="white" /> : 'search' }
                    </button>
                </div>
                { this.showRecent ? <RecentSearches onChange={ params => this.submitRecentSearch(params) } /> : null }
            </form>
        );
    }
});

const RecentSearches = observer(class RecentSearches extends React.Component {
    onClick(params) {
        this.props.onChange(params);
    }

    render() {
        const players = Utils.getRecentPlayers();
        const playersList = players.map(player => (
            <li key={ player.name } onMouseDown={ () => this.onClick(player) } >
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
});

export default SearchForm;
