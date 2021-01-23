import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { Select, Button } from 'antd';

@observer export default class Filter extends React.Component {

    @action.bound onSelect(value) {
        this.props.model.addToArmorFilter(value);
    }

    @action unpin(value) {
        this.props.model.removeFromArmorFilter(value);
    }

    bulidOptions(groupName, items) {
        return {
            label: groupName,
            options: items.map(item => ({ label: item.displayName, value: item.id }))
        };
    }

    render() {
        const model = this.props.model;
        const options = [
            this.bulidOptions('Helmets', model.helmets),
            this.bulidOptions('Arms', model.arms),
            this.bulidOptions('Chest', model.chests),
            this.bulidOptions('Legs', model.legs),
            this.bulidOptions('Class items', model.classitems)
        ];

        const pinndedItems = model.pinnedItems.map(item => (
            <div className="flex-container mt" key={ item.id }>
                { item.showFull() }
                <Button size="small" onClick={ () => this.unpin(item.id) } style={{ width: '50px' }}>unpin</Button>
            </div>
          ));

        return (
            <div>
                <Select
                    showSearch
                    style={{ width: '300px' }}
                    placeholder="Type item name"
                    options={ options }
                    optionFilterProp="label"
                    onSelect={ this.onSelect }
                    value=""
                />
                { pinndedItems }
            </div>
        );
    }
}
