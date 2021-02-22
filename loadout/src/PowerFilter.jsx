import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

import { Select } from 'antd';

@observer export default class PowerFilter extends React.Component {

    @computed get options() {
        const manifestObj = Manifest.DestinyPowerCapDefinition;
        const powerCaps = Object.keys(manifestObj).map(k => manifestObj[k].powerCap).filter(v => v < 999000);
        const uniqSorted = [...new Set(powerCaps)].sort();
        return uniqSorted.map(v => ({ label: v, value: v }));
    }

    render() {
        return (
            <div>
                <Select
                    style={{ width: '300px' }}
                    options={ this.options }
                    onSelect={ value => this.props.onChange(value) }
                    value={ this.props.value }
                />
            </div>
        );
    }
}
