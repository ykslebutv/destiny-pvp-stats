/* global Workdata */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import Loadout from './models/Loadout.jsx';

import { Radio } from 'antd';
import { Checkbox } from 'antd';
import { Tooltip, Button, Divider } from 'antd';
import { Pagination } from 'antd';

const SortOrder = {
    NONE: 'none',
    VALUE: 'value',
    WASTE: 'totalWaste',
    POTENTIAL: 'potential'
}

@observer export default class LoadoutOptimizer extends React.Component {

    @observable includeMods = false;
    @observable showRawData = false;
    @observable sortby = SortOrder.VALUE;

    @observable currentPage = 1;
    @observable perPage = 20;

    @computed get loadouts() {
        const model = this.props.model;
        const list = [];
        model.helmets.forEach(helmet => {
            model.arms.forEach(arm => {
                model.chests.forEach(chest => {
                    model.legs.forEach(leg => {
                        model.classitems.forEach(classitem => {
                            const args = {
                                helmet: helmet,
                                arms: arm,
                                chest: chest,
                                legs: leg,
                                classitem: classitem,
                            };
                            const loadout = new Loadout(args);
                            if (loadout.isValid) {
                                list.push(loadout);
                            }
                        })
                    })
                })
            })
        });
        return list;
    }

    @computed get sortedLoadouts() {
        if (this.sortby === SortOrder.NONE) {
            return this.loadouts;
        }

        let r = 1;
        if (this.sortby === SortOrder.WASTE) {
            r = -1;
        }

        return this.loadouts.sort((a, b) => {
            if (a[this.sortby] > b[this.sortby]) {
                return -r;
            }
            if (a[this.sortby] < b[this.sortby]) {
                return r;
            }
            return 0;
        });        
    }

    @computed get filteredLoadouts() {
        const filterItems = this.props.model.armorFilter;
        if (!filterItems.length) {
            return this.sortedLoadouts;
        }
        return this.sortedLoadouts.filter(loadout => loadout.passesFilter(filterItems));
    }

    @action.bound toggleIncludeMods() {
        this.includeMods = !this.includeMods;
    }

    @action.bound changeSortOrder(e) {
        this.sortby = e.target.value;
    }

    @action.bound onChangePage(currentPage, perPage) {
        this.currentPage = currentPage;
        this.perPage = perPage;
    }

    get onePageOfLoadouts() {
        const start = (this.currentPage-1)*this.perPage;
        const end = this.currentPage*this.perPage;
        return this.filteredLoadouts.slice(start, end);
    }

    render() {
        const navigationRow = (
              <div className="flex-container mb">
                  <div>
                      <Checkbox onChange={this.toggleIncludeMods}>
                          Include inserted mods <Tooltip title="When checked, armor stats and loadout value and potential will be calculated considering currently inserted armor mods." color="blue">(?)</Tooltip>
                      </Checkbox>
                  </div>
                  <div>
                      <Radio.Group
                        onChange={this.changeSortOrder}
                        defaultValue={SortOrder.VALUE}
                        buttonStyle="solid"
                        size="large"
                      >
                          <Radio.Button value={SortOrder.VALUE}>Sort by value</Radio.Button>
                          <Radio.Button value={SortOrder.WASTE}>Sort by waste</Radio.Button>
                          <Radio.Button value={SortOrder.POTENTIAL}>Sort by potential</Radio.Button>
                      </Radio.Group>
                  </div>
            </div>
        );

        return (
            <div className="loadout-container">
                {navigationRow}
                <div>
                    {this.onePageOfLoadouts.map(l => l.show())}
                </div>
                <div className="right mt">
                    <Pagination
                        defaultCurrent={1}
                        defaultPageSize={this.perPage}
                        current={this.currentPage}
                        total={this.loadouts.length}
                        onChange={this.onChangePage}
                    />
                </div>
                {this.showRawData && (
                    <div>
                        <pre>
                            {JSON.stringify(this.user, null, 2)}
                        </pre>
                        <br/>
                        Destiny Profile
                        <pre>
                            {JSON.stringify(this.profile, null, 2)}
                        </pre>
                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    }
}

