import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import MainPage from './MainPage.jsx';

@observer
class Content extends React.Component {
    render() {
        return (
            <Router>
                <MainPage />
            </Router>
        );
    }
}

ReactDOM.render(
    <Content />,
    document.getElementById('content-container')
);
