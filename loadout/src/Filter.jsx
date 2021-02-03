import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';

import { Select, Button } from 'antd';

@observer export default class Filter extends React.Component {

    pin(value) {
        this.props.onAdd(value);
    }

    unpin(value) {
        this.props.onRemove(value);
    }

    bulidOptions(groupName, items) {
        return {
            label: groupName,
            options: items.map(item => ({ label: item.displayName, value: item.id }))
        };
    }

    render() {
        const { model, pinnedItems } = this.props;
        const options = [
            this.bulidOptions('Helmets', model.helmets),
            this.bulidOptions('Gauntlets', model.arms),
            this.bulidOptions('Chest armor', model.chests),
            this.bulidOptions('Leg armor', model.legs),
            this.bulidOptions('Class items', model.classitems)
        ];

        const pinndedItems = pinnedItems.map(item => (
            <div className="flex-container mt" key={ item.id }>
                { item.showFull() }
                <Button size="small" onClick={ () => this.props.onRemove(item.id) } className="unpin">unpin</Button>
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
                    onSelect={ id => this.props.onAdd(id) }
                    value=""
                />
                { pinndedItems }
            </div>
        );
    }
}
