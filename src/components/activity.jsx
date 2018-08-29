/* global Config */
import React from 'react';
import { observer } from 'mobx-react';
import { extendObservable, action } from 'mobx';

import destiny2 from '../destiny2';
import Utils from '../utils';
import { GameModes, Maps, Platforms } from '../constants';
import Spinner from './spinner.jsx';
import GameModel from '../gameModel.jsx';

const Activities = observer(class Activities extends React.Component {
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
});

const DailyStatComp = observer(class DailyStatComp extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            showDetails: false,

            setShowDetails: action(showDetails => {
                this.showDetails = showDetails;
            })
        });
    }

    toggleDailyStatDetails() {
        this.setShowDetails(!this.showDetails);
    }

    render() {
        const { dailyStat } = this.props;
        const kd = destiny2.dailyKD(dailyStat);
        const kdClass = kd >= 1 ? 'good' : 'bad';
        const wl = destiny2.dailyWLRatio(dailyStat);

        return (
            <tbody>
                { this.showDetails ? (
                    <tr className="daily_stat" onClick={ () => this.toggleDailyStatDetails() }>
                        <td colSpan="2" className="left">{ dailyStat.date }</td>
                        <td>{ dailyStat.kills }</td>
                        <td>{ dailyStat.deaths }</td>
                        <td>{ dailyStat.assists }</td>
                        <td className={ kdClass }>{ kd }</td>
                        <td>{ dailyStat.wins } / { dailyStat.wins + dailyStat.losses }</td>
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
                        key={ activity.activityDetails.instanceId }
                        activity={ activity }
                    />
                ))}
            </tbody>
        );
    }
});

const Activity = observer(class Activity extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            gameData: new GameModel({ activityId: this.props.activity.activityDetails.instanceId }),

            show: false,

            setShow: action(show => {
                this.show = show;
            })
        });
    }

    handleClick(e) {
        e.preventDefault();

        if (this.gameData.loading) {
            return;
        }

        if (!this.gameData.success) {
            this.gameData.load();
        }

        this.setShow(!this.show);
    }

    get standing() {
        const { activity } = this.props;
        let standingClass = 'bad';
        let displayValue;

        try {
            displayValue = activity.values.standing.basic.displayValue;
        } catch(e) {
            displayValue = '???';
        }

        if (destiny2.doesActivityCount(activity)) {
            if (destiny2.activityWon(activity)) {
                standingClass = 'good';
            }
        } else {
            displayValue = activity.values.standing ? 'Tie' : '???';
            standingClass = 'tie';
        }

        return (
            <td className={ standingClass }>
                { displayValue }
            </td>
        );
    }

    render() {
        const { activity } = this.props;
        const kdClass = activity.values.killsDeathsRatio.basic.value >= 1 ? 'good' : 'bad';
        let gameMode = GameModes[activity.activityDetails.mode];

        if (!gameMode) {
            console.log(`Unknown mode ${ activity.activityDetails.mode } for directorActivityHash ${ activity.activityDetails.directorActivityHash }`);
            gameMode = GameModes[5];
        }
        const iconPath = `${ Config.baseUrl }${ gameMode.icon }`;
        const iconClass = activity.activityDetails.mode === 14 ? 'trials_icon' : 'activity_icon';

        const activityRow = (
            <tr className="activity" onClick={ e => this.handleClick(e) } key={ activity.activityDetails.instanceId } >
                <td>
                    { this.gameData.loading
                        ? <Spinner />
                        : <img src={ iconPath } className={ iconClass } title={ gameMode.displayName } />
                    }
                </td>
                <td className="map">
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
                { this.standing }
            </tr>
        );

        const gameRow = this.show && this.gameData.success ? (
            <tr key={ `${ activity.activityDetails.instanceId }-details` }>
                <td colSpan="7">
                    <ActivityDetails
                        data={ this.gameData.data }
                        showPermalink
                    />
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
        data.entries.forEach(player => {
            let teamName = player.values.team ? player.values.team.basic.displayValue : 'rumble';
            if (teamName === '-') {
                teamName = 'No team';
            }
            if (!teams[teamName]) {
                teams[teamName] = [];
            }
            teams[teamName].push(player);
        });

        const teamList = Object.keys(teams).sort().map(teamName => (
            <Team key={ teamName } teamName={ teamName } team={ teams[teamName] } />
        ));

        const gameModeName = data.activityDetails.mode ? GameModes[data.activityDetails.mode].displayName : '???';
        const title = `${ gameModeName } on ${ Maps[data.activityDetails.referenceId] }`;
        const date = Utils.formatDate(data.period, true);
        const gameUrl = `/game/${ data.activityDetails.instanceId }`;

        return (
            <table className="activity_details fixed">
                <tbody>
                    <tr className="title">
                        <td colSpan="7">
                            { title }, { date }
                        </td>
                    </tr>
                </tbody>
                { teamList }
                { this.props.showPermalink ? (
                    <tbody>
                        <tr className="footer">
                            <td colSpan="7">
                                <a href={ gameUrl } >Permalink to this game</a>
                            </td>
                        </tr>
                    </tbody>
                 ) : null }
            </table>
        );
    }
});

const Team = observer(class Team extends React.Component {
    render() {
        let teamStat;
        const standingClass = this.props.team[0].values.standing && this.props.team[0].values.standing.basic.displayValue === 'Victory' ? 'good' : 'bad';
        if (this.props.teamName !== 'rumble') {
            teamStat = (
                <tr className="team">
                    <td colSpan="2">{ this.props.teamName }</td>
                    <td colSpan="4" className={ standingClass }>{ this.props.team[0].values.standing.basic.displayValue }</td>
                    <td>{ this.props.team[0].values.teamScore.basic.displayValue }</td>
                </tr>
            );
        }

        const playerList = this.props.team.map(playerData => (
            <Player
                playerData={ playerData }
                key={ playerData.player.destinyUserInfo.displayName }
            />
        ));

        return (
            <tbody>
                { teamStat ? teamStat : null }
                { playerList }
            </tbody>
        );
    }
});

const Player = observer(class Player extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            loading: false,
            show: false,

            setLoading: action(loading => {
                this.loading = loading;
            }),

            setShow: action(show => {
                this.show = show;
            })
        });
    }

    loadWeapons() {
        const { playerData } = this.props;
        const weapons = playerData.extended.weapons || [];

        let count = 0;
        if (weapons.length > 0) {
            this.setLoading(true);
        } else {
            this.setShow(true);
        }

        weapons.map(w => {
            destiny2.getItemDefinition(w.referenceId).then(response => {
                w.displayProperties = response.displayProperties;
                count += 1;
                if (count === weapons.length) {
                    this.setLoading(false);
                    this.setShow(true);
                }
            });
        });
    }

    handleClick(e) {
        e.preventDefault();
        if (this.show) {
            this.setShow(false);
        } else {
            this.loadWeapons();
        }
    }

    get playerRow() {
        const { playerData } = this.props;
        const scoreClass = playerData.values.completed.basic.value === 0 ? 'bad' : '';
        return (
            <tr
                className="player"
                onClick={ e => this.handleClick(e) }
                key={ playerData.player.destinyUserInfo.displayName }
            >
                <td />
                <td className="player">
                    <span title={ `${ playerData.player.characterClass } lvl ${ playerData.player.characterLevel }` } >
                        { playerData.player.destinyUserInfo.displayName }
                    </span>
                </td>
                <td>
                    { this.loading ? <Spinner /> : playerData.values.kills.basic.displayValue }
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
    }

    get playerUrl() {
        const { membershipType, membershipId } = this.props.playerData.player.destinyUserInfo;
        return `/${ Platforms[membershipType].name.toLowerCase() }/${ membershipId }`;
    }

    get playerDetails() {
        const { playerData } = this.props;

        const weaponRows = playerData.extended.weapons ? playerData.extended.weapons.map(w => (
            <tr key={ w.referenceId }>
                <td><img className="weapon_icon" src={ `${ Config.baseUrl }${ w.displayProperties.icon }` } /></td>
                <td>{ w.displayProperties.name }</td>
                <td>{ w.values.uniqueWeaponKills.basic.displayValue }</td>
                <td />
                <td />
                <td />
                <td />
            </tr>
        )) : null;

        return (
            <tr key={ `${ playerData.player.destinyUserInfo.displayName }_details` } >
                <td colSpan="7" style={{ paddingTop: '0px' }}>
                    <table className="player_details fixed">
                        <tbody>
                            { weaponRows }
                            { playerData.extended.values.weaponKillsAbility && playerData.extended.values.weaponKillsAbility.basic.value
                            ? <tr key="melee">
                                <td />
                                <td>Ability</td>
                                <td>{ playerData.extended.values.weaponKillsAbility.basic.displayValue }</td>
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr> : null }
                            { playerData.extended.values.weaponKillsMelee && playerData.extended.values.weaponKillsMelee.basic.value
                            ? <tr key="melee">
                                <td />
                                <td>Melee</td>
                                <td>{ playerData.extended.values.weaponKillsMelee.basic.displayValue }</td>
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr> : null }
                            { playerData.extended.values.weaponKillsGrenade && playerData.extended.values.weaponKillsGrenade.basic.value
                            ? <tr key="grenade">
                                <td />
                                <td>Grenade</td>
                                <td>{ playerData.extended.values.weaponKillsGrenade.basic.displayValue }</td>
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr> : null }
                            { playerData.extended.values.weaponKillsSuper && playerData.extended.values.weaponKillsSuper.basic.value
                            ? <tr key="super">
                                <td />
                                <td>Super</td>
                                <td>{ playerData.extended.values.weaponKillsSuper.basic.displayValue }</td>
                                <td />
                                <td />
                                <td />
                                <td />
                            </tr> : null }
                            <tr key="link">
                                <td colSpan="7">
                                    <a href={ this.playerUrl } target="_blank" rel="noopener noreferrer">
                                        Show more about { playerData.player.destinyUserInfo.displayName }
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        );
    }

    render() {
        return [
            this.playerRow,
            this.show ? this.playerDetails : null
        ];
    }
});

export { Activities, ActivityDetails };
