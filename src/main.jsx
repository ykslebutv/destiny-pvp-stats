import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import MainPlayer from './mainPlayer.jsx';
import MainGame from './mainGame.jsx';

const Content = observer(class Content extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route path="/" component={ MainPlayer }/>
                    <Route path="/game" component={ MainGame }/>
                </div>
            </Router>
        );
    }
});

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);
