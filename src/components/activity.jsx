/* global Config */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import Spinner from './spinner.jsx';
import { ExtendedStats } from '../constants';

@observer class Activities extends React.Component {
    render() {
        const { dailyStats } = this.props;
        const dates = Object.keys(dailyStats);

        const list = dates.map(date => (
            <DailyStatComp
                dailyStat={ dailyStats[date] }
                key={ date }
            />
        ));

        return (
            <div className="activity_list">
                <table className="fixed">
                    <thead>
                        <tr>
                            <td colSpan="2">Mode/Map</td>
                            <td>K</td>
                            <td>D</td>
                            <td>A</td>
                            <td>K/D</td>
                            <td>Standing</td>
                        </tr>
                    </thead>
                    { list }
                </table>
            </div>
        );
    }
}

@observer class DailyStatComp extends React.Component {
    @observable showDetails;

    @action toggleDailyStatDetails() {
        this.showDetails = !this.showDetails;
    }

    render() {
        const { dailyStat } = this.props;
        const kd = dailyStat.dailyKD();
        const kdClass = kd >= 1 ? 'good' : 'bad';
        const wl = dailyStat.dailyWLRatio();

        return (
            <tbody>
                { this.showDetails ? (
                    <tr className="daily_stat" onClick={ () => this.toggleDailyStatDetails() }>
                        <td colSpan="2" className="left">{ dailyStat.date }</td>
                        <td>{ dailyStat.kills }</td>
                        <td>{ dailyStat.deaths }</td>
                        <td>{ dailyStat.assists }</td>
                        <td className={ kdClass }>{ kd }</td>
                        <td>{ dailyStat.wins } / { dailyStat.totalGames }</td>
                    </tr>
                ) : (
                    <tr className="daily_stat" onClick={ () => this.toggleDailyStatDetails() }>
                        <td colSpan="2" className="left">{ dailyStat.date }</td>
                        <td colSpan="3">Avg K/D:</td>
                        <td className={ kdClass }>{ kd }</td>
                        <td>{ isNaN(wl) ? '???' : `${ wl }%` }</td>
                    </tr>
                ) }
                { dailyStat.activities.map(activity => (
                    <Activity
                        key={ activity.instanceId }
                        activity={ activity }
                    />
                ))}
            </tbody>
        );
    }
}

@observer class Activity extends React.Component {
    @observable showDetails;
    @observable loading;

    @action toggleDetails() {
        this.showDetails = !this.showDetails;
    }

    @action setLoading(loading) {
        this.loading = loading;
    }

    handleClick(e) {
        e.preventDefault();

        if (this.loading) {
            return;
        }

        const { activity } = this.props;

        if (!activity.pcgr) {
            this.setLoading(true);
            activity.loadPCGR().then(res => {
                this.setLoading(false);
            });
        }

        this.toggleDetails();
    }

    get standing() {
        const { activity } = this.props;
        let standingClass = 'bad';

        if (activity.doesItCount) {
            if (activity.isWon) {
                standingClass = 'good';
            }
        } else {
            standingClass = 'tie';
        }

        return (
            <td className={ standingClass }>
                { activity.standing }
            </td>
        );
    }

    render() {
        const { activity } = this.props;
        const kdClass = activity.killsDeathsRatio >= 1 ? 'good' : 'bad';

        const activityRow = (
            <tr className="activity" title={ activity.title } onClick={ e => this.handleClick(e) } key={ activity.instanceId } >
                <td>
                    { this.loading
                        ? <Spinner />
                        : <img src={ activity.gameModeIcon } className="activity_icon" />
                    }
                </td>
                <td className="map">
                    { activity.mapName }
                </td>
                <td>
                    { activity.kills }
                </td>
                <td>
                    { activity.deaths }
                </td>
                <td>
                    { activity.assists }
                </td>
                <td className={ kdClass }>
                    { activity.killsDeathsRatio }
                </td>
                { this.standing }
            </tr>
        );

        const gameRow = this.showDetails && activity.pcgr ? (
            <tr key={ `${ activity.instanceId }-details` }>
                <td colSpan="7">
                    <ActivityDetails
                        activity={ activity }
                        showPermalink
                    />
                </td>
            </tr>
        ) : null;

        return ([activityRow, gameRow]);
    }
}

@observer class ActivityDetails extends React.Component {
    render() {
        const { activity } = this.props;

        const teamList = activity.pcgr.teams.map(team =>
            <Team key={ team.name } team={ team } />
        );

        return (
            <table className="activity_details fixed">
                <tbody>
                    <tr className="title">
                        <td colSpan="7">
                            { activity.title }
                        </td>
                    </tr>
                </tbody>
                { teamList }
                { this.props.showPermalink && (
                    <tbody>
                        <tr className="footer">
                            <td colSpan="7">
                                <a href={ activity.url } >Permalink to this game</a>
                            </td>
                        </tr>
                    </tbody>
                 ) }
            </table>
        );
    }
}

@observer class Team extends React.Component {

    // TODO: remove when fixed in the API
    displayTeamName(team) {
        return team.name === '18' ? 'Alpha' : team.name;
    }

    render() {
        const { team } = this.props;
        const standingClass = team.won ? 'good' : 'bad';

        const teamStat = team.name && (
            <tr className="team">
                <td colSpan="2">{ this.displayTeamName(team) }</td>
                <td colSpan="4" className={ standingClass }>{ team.standing }</td>
                <td>{ team.score }</td>
            </tr>
        );

        const playerList = team.players.map(player =>
            <Player key={ player.characterId } player={ player } />
        );

        return (
            <tbody>
                { teamStat }
                { playerList }
            </tbody>
        );
    }
}

@observer class Player extends React.Component {
    @observable showDetails = false;
    @observable loading = false;

    @action toggleDetails() {
        this.showDetails = !this.showDetails;
    }

    @action setLoading(loading) {
        this.loading = loading;
    }

    handleClick(e) {
        e.preventDefault();

        if (this.loading) {
            return;
        }

        const { player } = this.props;

        const promises = [];
        player.weaponStats.map(weaponStat => {
            if (!weaponStat.loaded) {
                promises.push(weaponStat.load());
            }
        });

        if (promises.length) {
            this.setLoading(true);
            Promise.all(promises).then(() => {
                this.setLoading(false);
                this.toggleDetails();
            });
        } else {
            this.toggleDetails();
        }
    }

    get playerRow() {
        const { player } = this.props;
        return (
            <tr
                className="player"
                onClick={ e => this.handleClick(e) }
                key={ player.characterId }
            >
                <td />
                <td className="player">
                    <span title={ player.description } >
                        { player.name }
                    </span>
                </td>
                <td>
                    { this.loading ? <Spinner /> : player.kills }
                </td>
                <td>
                    { player.deaths }
                </td>
                <td>
                    { player.assists }
                </td>
                <td>
                    { player.killsDeathsRatio }
                </td>
                <td className={ player.completed ? '' : 'bad' } >
                    { player.completed ? player.score : 'left' }
                </td>
            </tr>
        );
    }

    render() {
        const { player } = this.props;
        return [
            this.playerRow,
            this.showDetails && <PlayerDetails key={ `${ player.characterId }_details` } player={ player } />
        ];
    }
}

@observer class PlayerDetails extends React.Component {
    statRow(name, value) {
        return (
            <tr key={ name }>
                <td />
                <td>{ name }</td>
                <td>{ value }</td>
                <td />
                <td />
                <td />
                <td />
            </tr>
        );
    }

    get weaponStats() {
        const { player } = this.props;
        return player.weaponStats.map(weaponStat =>
            <WeaponStat key={ weaponStat.referenceId } weaponStat={ weaponStat } />
        );
    }

    get extendedStats() {
        const { player } = this.props;
        return Object.keys(player.extendedStats).map(extendedStatKey =>
            player.extendedStats[extendedStatKey] > 0 ? this.statRow(ExtendedStats[extendedStatKey], player.extendedStats[extendedStatKey]) : null
        );
    }

    render() {
        const { player } = this.props;

        return (
            <tr>
                <td colSpan="7" style={{ paddingTop: '0px' }}>
                    <table className="player_details fixed">
                        <tbody>
                            { this.weaponStats }
                            { this.extendedStats }
                            <tr key="link">
                                <td colSpan="7">
                                    <a href={ player.url } target="_blank" rel="noopener noreferrer">
                                        Show more about { player.name }
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    }
}

@observer class WeaponStat extends React.Component {
    render() {
        const { weaponStat } = this.props;
        return (
            <tr key={ weaponStat.referenceId }>
                <td>
                    { weaponStat.iconUrl && <img className="weapon_icon" src={ weaponStat.iconUrl } title={ weaponStat.description } /> }
                </td>
                <td>{ weaponStat.name }</td>
                <td>{ weaponStat.kills }</td>
                { weaponStat.precisionKills > 0 ?
                    <td colSpan="2" style={{ textAlign: 'left' }}>
                        <i className="fas fa-crosshairs fa-xs" style={{ margin: '0px 3px 2px 0px' }} />
                        { weaponStat.precisionKills }
                    </td>
                : <td /> }
                <td />
                <td />
                { !weaponStat.precisionKills && <td /> }
            </tr>
        );
    }
}

export { Activities, ActivityDetails };
