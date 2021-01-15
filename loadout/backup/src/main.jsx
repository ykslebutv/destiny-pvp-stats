import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import MainPlayer from './mainPlayer.jsx';
// import MainGame from './mainGame.jsx';

@observer
class Content extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <MainPlayer />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);