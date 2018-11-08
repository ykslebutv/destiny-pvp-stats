/* global Config */
import React from 'react';

import { Platforms } from '../constants';

const Progression = props => (
    <div className="progression">
        <Rank name="valor" />
        <Rank name="glory" />
        <Rank name="infamy" />
    </div>
);

const Rank = props => (
  <div className="rank">
      { props.name }
  </div>
);

export default Progression;
