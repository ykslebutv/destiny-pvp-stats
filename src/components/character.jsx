import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { extendObservable, observable, computed, action } from 'mobx';

import destiny2 from '../destiny2';
import { CharacterTypes } from '../constants';
import Activities from './activity.jsx';

const CharacterList = observer(class CharacterList extends React.Component {
    render() {
        const list = this.props.characters.map(character => (
            <Character
                key={ character.characterId }
                character={ character }
            />
        ));

        return (
            <div className="container-fluid character_list">
                { list }
            </div>
        );
    }
});

const Character = observer(class Character extends React.Component {
    render() {
        const { character } = this.props;
        const classType = CharacterTypes[character.classType];
        const emblemPath = `${ Config.baseUrl }${ character.emblemPath }`;
        const backgroundPath = `${ Config.baseUrl }${ character.emblemBackgroundPath }`;
        const divStyle = {
            backgroundImage: 'url(' + backgroundPath + ')'
        };

        return (
            <div className="col-md-4 character_container">
                <div className="character" style={ divStyle }>
                    <span className="classType">{ classType }</span>
                    <span className="level">Lvl { character.baseCharacterLevel }</span>
                    <span className="level light">Pwr { character.light }</span>
                </div>
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

        const wl = stats ? destiny2.WLRatio(stats.activitiesWon.basic.value, stats.activitiesEntered.basic.value) : 0;

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
