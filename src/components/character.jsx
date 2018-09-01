/* global Config */
import React from 'react';
import MediaQuery from 'react-responsive';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import { CharacterTypes } from '../constants';
import { Activities } from './activity.jsx';

@observer class CharacterList extends React.Component {
    render() {
        const list = this.props.characters.map(character => (
            <Character
                key={ character.characterId }
                character={ character }
            />
        ));

        return (
            <div>
                <MediaQuery query="(max-width: 999px)">
                    <CharacterCarousel characters={ this.props.characters } />
                </MediaQuery>
                <MediaQuery query="(min-width: 1000px)">
                    <div className="container-fluid character_list">
                        { list }
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

const Banner = props => {
    const { character } = props;
    const classType = CharacterTypes[character.klass];
    const divStyle = {
        backgroundImage: `url(${ character.emblemUrl })`
    };
    const className = `character ${ props.activeCharacter ? 'col-xs-8 active_character' : '' }`;
    const info = `
      Mob ${ character.mobility } / Res ${ character.resilience } / Rec ${ character.recovery }
    `;

    return (
        <div className={ className } style={ divStyle }>
            <span className="classType">{ classType }</span>
            <span className="level">Lvl { character.level }</span>
            <span className="level light">{ character.light }</span>
            <div className="char_info">
                { info }
            </div>
        </div>
    );
};

const Emblem = props => {
    const { character } = props;
    const divStyle = {
        backgroundImage: `url(${ character.emblemUrl })`
    };

    return (
        <div
            className="col-xs-1 emblem"
            style={ divStyle }
            onClick={ () => props.onClick() }
        />
    );
};

@observer class CharacterCarousel extends React.Component {
    @observable activeCharacterId;

    @action setActiveCharacter(characterId) {
        this.activeCharacterId = characterId;
    }

    constructor(props) {
        super(props);
        if (props.characters) {
            this.setActiveCharacter(props.characters[0].characterId);
        }
    }

    render() {
        let activeCharacter;
        const list = this.props.characters.map(character => {
            if (character.characterId === this.activeCharacterId) {
                activeCharacter = character;
            }

            return (character.characterId === this.activeCharacterId
                ? <Banner
                    character={ character }
                    key={ character.characterId }
                    activeCharacter
                />
                : <Emblem
                    character={ character }
                    key={ character.characterId }
                    onClick={ () => this.setActiveCharacter(character.characterId) }
                />
            );
        });

        return (
            <div className="container-fluid character_carousel">
                { list }
                <div className="clear" />
                <CharacterStats stats={ activeCharacter.stats } />
                { activeCharacter.stats ? (
                    <div className="activities">
                        <Activities dailyStats={ activeCharacter.dailyStats } />
                    </div>
                ) : null }
            </div>
        );
    }
}

@observer class Character extends React.Component {
    render() {
        const { character } = this.props;
        return (
            <div className="col-md-4 character_container">
                <Banner character={ character } />
                <CharacterStats stats={ character.stats } />
                { character.dailyStats ? (
                    <div className="activities">
                        <Activities dailyStats={ character.dailyStats } />
                    </div>
                ) : null }
            </div>
        );
    }
}

@observer class CharacterStats extends React.Component {
    @observable showHistoricalStats = false;

    @action handleHistoricalStatsClick(e) {
        e.preventDefault();
        this.showHistoricalStats = !this.state.showHistoricalStats;
    }

    render() {
        const stats = this.props.stats;
        if (!stats) {
            return (
                <div className="no_stats">
                    No PvP stats available.
                </div>
            );
        }

        const historicalStats = (
            <tbody>
                <tr>
                    <td className="stat_label">Kills:</td>
                    <td className="stat_value">{ stats.kills }</td>
                    <td className="stat_label">Top game kills:</td>
                    <td className="stat_value">{ stats.bestSingleGameKills }</td>
                </tr>
                <tr>
                    <td className="stat_label">Deaths:</td>
                    <td className="stat_value">{ stats.deaths }</td>
                    <td className="stat_label">Top kill spree:</td>
                    <td className="stat_value">{ stats.longestKillSpree }</td>
                </tr>
                <tr>
                    <td className="stat_label">Assists:</td>
                    <td className="stat_value">{ stats.assists }</td>
                    <td className="stat_label">Longest life:</td>
                    <td className="stat_value">{ stats.longestSingleLife }</td>
                </tr>
                <tr>
                    <td className="stat_label">(K+A)/D:</td>
                    <td className="stat_value">{ stats.killsDeathsAssists }</td>
                    <td className="stat_label">Best weapon:</td>
                    <td className="stat_value">{ stats.weaponBestType }</td>
                </tr>
            </tbody>
        );

        return (
            <div className="character_stats">
                <table>
                    <tbody>
                        <tr>
                            <td className="stat_label">K/D:</td>
                            <td className="stat_value" title={ stats.kdlong }>{ stats.kd }</td>
                            <td className="stat_label">Games won:</td>
                            <td className="stat_value">
                                { stats.wins }/{ stats.totalGames } ({ stats.wl }%)
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4"><span><a href="#" onClick={ e => this.handleHistoricalStatsClick(e) }>Toggle historical stats</a></span></td>
                        </tr>
                    </tbody>
                    { this.showHistoricalStats ? historicalStats : null }
                </table>
            </div>
        );
    }
}

export default CharacterList;
