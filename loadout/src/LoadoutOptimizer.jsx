/* global Workdata */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import { Divider, Checkbox, Radio, Tooltip, Pagination } from 'antd';

const SortOrder = {
    NONE: 'none',
    VALUE: 'value',
    WASTE: 'totalWaste',
    POTENTIAL: 'potential'
};

@observer export default class LoadoutOptimizer extends React.Component {

    @observable sortby = SortOrder.VALUE;
    @observable currentPage = 1;
    @observable perPage = 20;

    @action.bound onChangePage(currentPage, perPage) {
        this.currentPage = currentPage;
        this.perPage = perPage;
    }

    @action.bound changeSortOrder(e) {
        this.sortby = e.target.value;
    }

    @action.bound toggleIncludeMods() {
        this.props.model.toggleIncludeMods();
    }

    get sortedLoadouts() {
        const t1 = performance.now();

        const loadouts = this.props.model.loadouts;
        if (this.sortby === SortOrder.NONE) {
            return loadouts;
        }

        let r = 1;
        if (this.sortby === SortOrder.WASTE) {
            r = -1;
        }
        const list = loadouts.sort((a, b) => {
            if (a[this.sortby] > b[this.sortby]) {
                return -r;
            }
            if (a[this.sortby] < b[this.sortby]) {
                return r;
            }
            return 0;
        });

        const t2 = performance.now();
        console.log(`Sorting loadouts by ${ this.sortby } took ${ t2 - t1 } milliseconds.`);

        return list;
    }

    render() {
        const navigationRow = (
            <div className="flex-container mb">
                <div>
                    <Checkbox onChange={ this.toggleIncludeMods }>
                        Include inserted mods <Tooltip title="When checked, armor stats and loadout value and potential will be calculated considering currently inserted armor mods." color="blue">(?)</Tooltip>
                    </Checkbox>
                </div>
                <div>
                    <Radio.Group
                        onChange={ this.changeSortOrder }
                        defaultValue={ SortOrder.VALUE }
                        buttonStyle="solid"
                        size="large"
                    >
                        <Radio.Button value={ SortOrder.VALUE }>Sort by value</Radio.Button>
                        <Radio.Button value={ SortOrder.WASTE }>Sort by waste</Radio.Button>
                        <Radio.Button value={ SortOrder.POTENTIAL }>Sort by potential</Radio.Button>
                    </Radio.Group>
                </div>
            </div>
        );

        console.log('render');

        const start = (this.currentPage - 1) * this.perPage;
        const end = this.currentPage * this.perPage;
        const sortedLoadouts = this.sortedLoadouts;
        const loadoutsRow = sortedLoadouts.slice(start, end).map(l => l.show());

        return (
            <div className="loadout-container">
                <Divider plain>{sortedLoadouts.length} loadouts</Divider>
                {navigationRow}
                {loadoutsRow}
                <div className="right mt">
                    <Pagination
                        defaultCurrent={ 1 }
                        defaultPageSize={ this.perPage }
                        current={ this.currentPage }
                        total={ sortedLoadouts.length }
                        onChange={ this.onChangePage }
                    />
                </div>
            </div>
        );
    }
}
