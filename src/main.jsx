import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import MainPlayer from './mainPlayer.jsx';
import MainGame from './mainGame.jsx';

@observer
class Content extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={ MainPlayer } />
                    <Route path="/psn/:player" component={ MainPlayer } />
                    <Route path="/xbox/:player" component={ MainPlayer } />
                    <Route path="/pc/:player" component={ MainPlayer } />
                    <Route path="/bnet/:player" component={ MainPlayer } />
                    <Route path="/stadia/:player" component={ MainPlayer } />
                    <Route path="/game/:id" component={ MainGame } />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);
