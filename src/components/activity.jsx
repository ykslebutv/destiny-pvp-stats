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
                    <Activity key={ activity.period } activity={ activity } />
                )}
            </tbody>
        );
    }
});

const Activity = observer(class Activity extends React.Component {
    handleClick(e) {
        e.preventDefault();
        let target = e.target;
        if (target.tagName === 'TD') {
            target = target.parentElement;
        }
        const activityId = target.dataset.activityid;
        if (activityId) {
            this.props.handleActivityClick(activityId);
        }
    }

    render() {
        const { activity } = this.props;
        const kdClass = activity.values.killsDeathsRatio.basic.value > 1 ? 'good' : 'bad';
        const standingClass = destiny2.activityWon(activity) ? 'good' : 'bad';
        const iconPath = `${ Config.baseUrl }${ GameModeNames[activity.activityDetails.mode].icon }`;
        const iconClass = activity.activityDetails.mode !== 14 ? 'activity_icon' : 'trials_icon';

        console.log(activity)

        return (
            <tr onClick={ e => this.handleClick(e) } data-activityid={ activity.activityDetails.instanceId }>
                <td className="mode_map">
                    { this.props.loadingDetails
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
    }
});

export default Activities;
