/* global Config */
import React from 'react';

import { Platforms } from '../constants';

const Progression = props => {
    return (
    <div className="progression">
        <Rank name="glory" value={ props.data.glory } />
        <Rank name="valor" value={ props.data.valor } />
        <Rank name="infamy" value={ props.data.infamy } />
    </div>
    );
};

const Rank = props => {
    console.log(props)
    return (
    <div className="rank">
        { props.name }: { props.value.currentProgress }
    </div>
    );
};

export default Progression;
