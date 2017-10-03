import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { extendObservable, observable, computed, action } from 'mobx';

import destiny2 from '../destiny2';
import Utils from '../utils';
import { GameModes, GameModeNames, Maps } from '../constants';
import SpinnerComp from './spinnerComp.jsx';

const Activities = observer(class Activities extends React.Component {
    render() {
        const { dailyStats } = this.props;
        const dates = Object.keys(dailyStats);

        const list = dates.map(date => {
            return (
                <DailyStatComp
                    dailyStat={ dailyStats[date] }
                    key={ date }
                />
            );
        });

        return (
            <div className="activity_list">
                <table className="fixed">
                    <thead>
                        <tr>
                            <td>Mode/Map</td>
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
});

const DailyStatComp = observer(class DailyStatComp extends React.Component {
    render() {
        const { dailyStat } = this.props;
        const kd = destiny2.dailyKD(dailyStat);
        const kdClass = kd > 1 ? 'good' : 'bad';
        const wl = destiny2.dailyWLRatio(dailyStat);

        return (
            <tbody>
                <tr className="daily_stat">
                    <td className="left">{ dailyStat.date }</td>
                    <td colSpan="3">Avg K/D:</td>
                    <td className={ kdClass }>{ kd }</td>
                    <td>{ wl }%</td>
                </tr>
                { dailyStat.activities.map(activity =>
                    <Activity key={ activity.activityDetails.instanceId } activity={ activity } />
                )}
            </tbody>
        );
    }
});

const Activity = observer(class Activity extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            loading: false,
            show: false,

            gameData: null,

            setLoading: action(loading => {
                this.loading = loading;
            }),

            activityLoaded: action(data => {
                this.gameData = data;
                this.setLoading(false);
                this.setShow(true);
            }),

            setShow: action(show => {
                this.show = show;
            }),
        });
    }

    handleClick(e) {
        e.preventDefault();

        const activityId = this.props.activity.activityDetails.instanceId;

        if (this.loading) {
            return;
        }

        if (!this.gameData) {
            this.setLoading(true);
            destiny2.getPostGame(activityId).then(data => this.activityLoaded(data));
        } else {
            this.setShow(!this.show);
        }
    }

    render() {
        const { activity } = this.props;
        const kdClass = activity.values.killsDeathsRatio.basic.value > 1 ? 'good' : 'bad';
        const standingClass = destiny2.activityWon(activity) ? 'good' : 'bad';
        const iconPath = `${ Config.baseUrl }${ GameModeNames[activity.activityDetails.mode].icon }`;
        const iconClass = activity.activityDetails.mode !== 14 ? 'activity_icon' : 'trials_icon';

        const activityRow = (
            <tr onClick={ e => this.handleClick(e) } >
                <td className="mode_map">
                    { this.loading
                    ? <SpinnerComp scale="0.3" color="black" />
                    : <img src={ iconPath } className={ iconClass } title={ GameModeNames[activity.activityDetails.mode].name } /> }
                    { Maps[activity.activityDetails.referenceId] || activity.activityDetails.referenceId }
                </td>
                <td>
                    { activity.values.kills.basic.displayValue }
                </td>
                <td>
                    { activity.values.deaths.basic.displayValue }
                </td>
                <td>
                    { activity.values.assists.basic.displayValue }
                </td>
                <td className={ kdClass }>
                    { activity.values.killsDeathsRatio.basic.displayValue }
                </td>
                <td className={ standingClass }>
                    { activity.values.standing.basic.displayValue }
                </td>
            </tr>
        );

        const title = `${ GameModeNames[activity.activityDetails.mode].name } on ${ Maps[activity.activityDetails.referenceId] }`;

        const gameRow = this.show && this.gameData ? (
            <tr>
                <td colSpan="6">
                    <ActivityDetails title={ title } data={ this.gameData } />
                </td>
            </tr>
        ) : null;

        return ([activityRow, gameRow]);
    }
});

const ActivityDetails = observer(class ActivityDetails extends React.Component {
    render() {
        const teams = {};
        const { data } = this.props;
        data.entries.map(playerData => {
            let teamName = playerData.values.team ? playerData.values.team.basic.displayValue : 'rumble';
            if (teamName === '-') {
                teamName = 'No team';
            }
            if (!teams[teamName]) {
                teams[teamName] = [];
            }
            teams[teamName].push(playerData);
        });

        const teamNames = [];
        for (const teamName in teams) {
            teamNames.push(teamName);
        }

        const teamList = teamNames.sort().map(teamName => (
            <Team teamName={ teamName } team={ teams[teamName] } />
        ));

        const date = Utils.formatDate(data.period, true);

        return (
            <table className="activity_details fixed">
                <tr className="title">
                    <td colSpan="6">
                        { this.props.title }, { date }
                    </td>
                </tr>
                { teamList }
            </table>
        );
    }
});

const Team = observer(class Team extends React.Component {
    render() {
        let teamStat;
        const standingClass = this.props.team[0].values.standing.basic.displayValue === 'Victory' ? 'good' : 'bad';
        if (this.props.teamName !== 'rumble') {
            teamStat = (
                <tr className="team">
                    <td>{ this.props.teamName }</td>
                    <td colSpan="4" className={ standingClass }>{ this.props.team[0].values.standing.basic.displayValue }</td>
                    <td>{ this.props.team[0].values.teamScore.basic.displayValue }</td>
                </tr>
            );
        }

        const playerList = this.props.team.map(playerData => {
            const scoreClass = playerData.values.completed.basic.value === 0 ? 'bad' : '';
            return (
                <tr>
                    <td className="player">
                        { playerData.player.destinyUserInfo.displayName } { playerData.player.clanTag ? '[' + playerData.player.clanTag + ']' : '' }
                    </td>
                    <td>
                        { playerData.values.kills.basic.displayValue }
                    </td>
                    <td>
                        { playerData.values.deaths.basic.displayValue }
                    </td>
                    <td>
                        { playerData.values.assists.basic.displayValue }
                    </td>
                    <td>
                        { playerData.values.killsDeathsRatio.basic.displayValue }
                    </td>
                    <td className={ scoreClass }>
                        { playerData.values.completed.basic.value === 1 ? playerData.score.basic.displayValue : 'left' }
                    </td>
                </tr>
            );
        });

        return (
            <tbody>
                { teamStat ? teamStat : null }
                { playerList }
            </tbody>
        );
    }
});

export default Activities;
