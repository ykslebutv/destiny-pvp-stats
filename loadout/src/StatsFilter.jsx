import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

import { Slider } from 'antd';

const STATS = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];

@observer export default class StatsFilter extends React.Component {
    render() {
        const comps = STATS.map(stat => {
            const val = this.props.model[`${ stat }Filter`];
            return (
                <div className="stat-slider">
                    {stat.slice(0, 3)}: {val}
                    <Slider
                        min={ 1 }
                        max={ 10 }
                        vertical
                        defaultValue={ val }
                        onChange={ value => this.props.onChange(stat, value) }
                    />
                </div>
            );
        });

        return (
            <div className="flex-container">
                {comps}
            </div>
        );
    }
}
