import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Platforms, GameModeIds } from '../constants';
import Utils from '../utils';

@observer class SearchResults extends React.Component {
    render() {
        return (
            <div className="search-results">
                <p>
                    Found multiple matches:
                </p>
                { this.props.data.map(player => {
                    const url = `/${ Platforms[player.membershipType].name.toLowerCase() }/${ player.membershipId }`;
                    return (
                        <div key={ player.membershipId }>
                            <a href={ url }>{ player.displayName }</a> - id { player.membershipId }
                        </div>
                    )
                }) }
            </div>
        );
    }
}

export default SearchResults;