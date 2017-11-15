/* global Config */
import React, { PropTypes } from 'react';
import MediaQuery from 'react-responsive';
import { observer } from 'mobx-react';
import { extendObservable, action } from 'mobx';

import destiny2 from '../destiny2';
import { CharacterTypes } from '../constants';
import { Activities } from './activity.jsx';

const CharacterList = observer(class CharacterList extends React.Component {
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
});

const Banner = props => {
    const { character } = props;
    const classType = CharacterTypes[character.classType];
    const backgroundPath = `${ Config.baseUrl }${ character.emblemBackgroundPath }`;
    const divStyle = {
        backgroundImage: `url(${ backgroundPath })`
    };
    const className = `character ${ props.activeCharacter ? 'col-xs-8 active_character' : '' }`;
    const info = `
      Mob ${ character.mobility } / Res ${ character.resilience } / Rec ${ character.recovery }
    `;

    return (
        <div className={ className } style={ divStyle }>
            <span className="classType">{ classType }</span>
            <span className="level">Lvl { character.baseCharacterLevel }</span>
            <span className="level light">{ character.light }</span>
            <div className="char_info">
                { info }
            </div>
        </div>
    );
};

const Emblem = props => {
    const { character } = props;
    const backgroundPath = `${ Config.baseUrl }${ character.emblemBackgroundPath }`;
    const divStyle = {
        backgroundImage: `url(${ backgroundPath })`
    };

    return (
        <div
            className="col-xs-1 emblem"
            style={ divStyle }
            onClick={ () => props.onClick() }
        />
    );
};

const CharacterCarousel = observer(class CharacterCarousel extends React.Component {
    constructor(props) {
        super(props);
        extendObservable(this, {
            activeCharacterId: props.characters ? props.characters[0].characterId : null,
            setActiveCharacter: action(characterId => {
                this.activeCharacterId = characterId;
            })
        });
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
});

const Character = observer(class Character extends React.Component {
    render() {
        const { character } = this.props;
        return (
            <div className="col-md-4 character_container">
                <Banner character={ character } />
                <CharacterStats stats={ character.stats } />
                { character.stats ? (
                    <div className="activities">
                        <Activities dailyStats={ character.dailyStats } />
                    </div>
                ) : null }
            </div>
        );
    }
});

const CharacterStats = observer(class CharacterStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHistoricalStats: false
        };
    }

    handleHistoricalStatsClick(e) {
        e.preventDefault();
        this.setState({
            showHistoricalStats: !this.state.showHistoricalStats
        });
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

        const wl = stats ? destiny2.getWLRatio(stats.activitiesWon.basic.value, stats.activitiesEntered.basic.value) : 0;

        const historicalStats = (
            <tbody>
                <tr>
                    <td className="stat_label">Kills:</td>
                    <td className="stat_value">{ stats.kills.basic.displayValue }</td>
                    <td className="stat_label">Top game kills:</td>
                    <td className="stat_value">{ stats.bestSingleGameKills.basic.displayValue }</td>
                </tr>
                <tr>
                    <td className="stat_label">Deaths:</td>
                    <td className="stat_value">{ stats.deaths.basic.displayValue }</td>
                    <td className="stat_label">Top kill spree:</td>
                    <td className="stat_value">{ stats.longestKillSpree.basic.displayValue }</td>
                </tr>
                <tr>
                    <td className="stat_label">Assists:</td>
                    <td className="stat_value">{ stats.assists.basic.displayValue }</td>
                    <td className="stat_label">Longest life:</td>
                    <td className="stat_value">{ stats.longestSingleLife.basic.displayValue }</td>
                </tr>
                <tr>
                    <td className="stat_label">(K+A)/D:</td>
                    <td className="stat_value">{ stats.killsDeathsAssists.basic.displayValue }</td>
                    <td className="stat_label">Orbs D/G:</td>
                    <td className="stat_value">{ stats.orbsDropped.basic.displayValue }/{ stats.orbsGathered.basic.displayValue }</td>
                </tr>
                <tr>
                    <td className="stat_label">Prec. kills:</td>
                    <td className="stat_value">{ stats.precisionKills.basic.displayValue }</td>
                    <td className="stat_label">Best weapon:</td>
                    <td className="stat_value">{ stats.weaponBestType.basic.displayValue }</td>
                </tr>
            </tbody>
        );

        return (
            <div className="character_stats">
                <table>
                    <tbody>
                        <tr>
                            <td className="stat_label">K/D:</td>
                            <td className="stat_value">{ stats.killsDeathsRatio.basic.displayValue }</td>
                            <td className="stat_label">Games won:</td>
                            <td className="stat_value">
                                { stats.activitiesWon.basic.displayValue }/{ stats.activitiesEntered.basic.displayValue } ({ wl }%)
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4"><span><a href="#" onClick={ e => this.handleHistoricalStatsClick(e) }>Toggle historical stats</a></span></td>
                        </tr>
                    </tbody>
                    { this.state.showHistoricalStats ? historicalStats : null }
                </table>
            </div>
        );
    }
});

export default CharacterList;
