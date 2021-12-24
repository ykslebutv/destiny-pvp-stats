import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import Utils from '../utils';
import { destiny2 } from '../../../api/destiny2';

@observer class SearchResults extends React.Component {
    onClick(params) {
        Utils.route({
            name: params.name,
            platform: params.platform,
            id: params.id
        });
    }

    get players() {
        const res = [];
        this.props.results.forEach(player => {
            if (!player.destinyMemberships[0]) {
                return;
            }
            let platform = player.destinyMemberships[0].crossSaveOverride;
            if (platform === 0) { // no crossave override
                platform = player.destinyMemberships[0].membershipType;
            }
            const membership = player.destinyMemberships.find(m => m.membershipType === platform);
            res.push({
                name: `${ membership.bungieGlobalDisplayName }#${ membership.bungieGlobalDisplayNameCode }`,
                platform: membership.membershipType,
                id: membership.membershipId

            });
        });
        return res;
    }

    render() {
        const playersList = this.players.map(player => (
            <li key={ player.name } onMouseDown={ () => this.onClick(player) } >
                { player.name }
            </li>
        ));
        return playersList.length ? (
            <div className="floating-list search-results">
                <ul>
                    { playersList }
                </ul>
            </div>
        ) : null;
    }
}

@observer class SearchForm extends React.Component {

    @observable results = [];
    @observable focus = false;

    @action setSearchResults(value) {
        this.results = value;
    }

    @action.bound onFocus() {
        this.focus = true;
    }

    @action.bound onBlur() {
        this.focus = false;
    }

    @computed get showResults() {
        return this.focus && this.results.length > 0;
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
                this.setSearchResults(filteredResults);
            } else {
                this.setSearchResults([]);
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
                        onFocus={ this.onFocus }
                        onBlur={ this.onBlur }
                    />
                </div>
                { this.showResults && <SearchResults results={ this.results } /> }
            </form>
        );
    }
}

export default SearchForm;
