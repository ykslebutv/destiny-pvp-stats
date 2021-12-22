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
                    <Route path="/game/:game_id" component={ MainGame } />
                    <Route path="/1/:player_id" component={ MainPlayer } />
                    <Route path="/2/:player_id" component={ MainPlayer } />
                    <Route path="/3/:player_id" component={ MainPlayer } />
                    <Route path="/4/:player_id" component={ MainPlayer } />
                    <Route path="/5/:player_id" component={ MainPlayer } />
                </div>
            </Router>
        );
    }
}

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);
