import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Spinner from './spinner.jsx';
import Utils from '../utils';
import { destiny2 } from '../../../api/destiny2';

@observer class SearchForm extends React.Component {
    @observable results;
    @observable focus = false;

    @action setResults(value) {
        this.results = value;
    }

    @action onFocus() {
        this.focus = true;
    }

    @action onBlur() {
        this.focus = false;
    }

    @computed get showResults() {
        return this.focus && this.results && this.results.length > 0;
    }

    search(name) {
        if (!name || name.length < 3) {
            return;
        }
        const [term, nameCode] = name.split('#');
        if (!term || term.length < 3) {
            return;
        }
        destiny2.searchPlayerByPrefix(term).then(result => {
            if (Config.debug) {
                console.log(result);
            }

            if (result.searchResults && result.searchResults.length > 0) {
                const filteredResults = result.searchResults.filter(player => {
                    if (!nameCode) {
                        return true;
                    }
                    const playerNameCode = player.destinyMemberships[0] && player.destinyMemberships[0].bungieGlobalDisplayNameCode;
                    if (!playerNameCode) {
                        return false;
                    }
                    return playerNameCode.toString().startsWith(nameCode);
                });
                this.setResults(filteredResults);
            } else {
                this.setResults([]);
            }
        });
    }

    render() {
        return (
            <form id="searchForm">
                <div className="search_form_1">
                    <a href="/"><img className="logo" src="images/destiny48x48.png" /></a>
                    <input
                        className="search_field"
                        type="text"
                        onChange={ e => this.search(e.target.value) }
                        onFocus={ () => this.onFocus() }
                        onBlur={ () => this.onBlur() }
                    />
                </div>
                <div className="search_form_2">
                    { this.props.loading && <Spinner size="fa-lg" /> }
                </div>
                { this.showResults && <SearchResults
                    results={this.results}
                    onChange={ params => this.submitRecentSearch(params) }
                /> }
            </form>
        );
    }
}

@observer class SearchResults extends React.Component {
    get players() {
        let res = [];
        this.props.results.forEach(player => {
            console.log(player);
            if (!player.destinyMemberships[0]) {
                return;
            }
            let platform = player.destinyMemberships[0].crossSaveOverride;
            if (platform === 0) { // no crossave override
                platform = player.destinyMemberships[0].membershipType;
            }
            const membership = player.destinyMemberships.find(m => m.membershipType === platform);
            res.push({
                name: `${membership.bungieGlobalDisplayName}#${membership.bungieGlobalDisplayNameCode}`,
                membershipType: membership.membershipType,
                membershipId: membership.membershipId

            });
        });
        return res;
    }

    onClick(params) {
        Utils.route({
            name: params.name,
            membershipType: params.membershipType,
            membershipId: params.membershipId
        });
    }

    render() {
        const playersList = this.players.map(player => (
            <li key={ player.name } onMouseDown={ () => this.onClick(player) } >
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
