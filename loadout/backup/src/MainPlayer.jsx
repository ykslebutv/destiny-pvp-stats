import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

@observer class MainPlayer extends React.Component {
    
    authorizeUrl = "https://www.bungie.net/en/OAuth/Authorize?client_id=34984&response_type=code&state=ABRAKADAVRA";
    tokenUrl = "https://www.bungie.net/Platform/App/OAuth/Token?client_id=34984&grant_type=authorization_code&code=846ad385c666b8b467cc9eb0dcaecec8";
    code = "846ad385c666b8b467cc9eb0dcaecec8";

    @action.bound authorize() {
        console.log('authorizing at', this.authorizeUrl)
        
        window.open(this.authorizeUrl);
        // window.addEventListener('storage', function(e) {
        //     if(localStorage.getItem('tabbed') && localStorage.getItem('tabbed')) {
        //         //Reload authorization code from LocalStorage
        //         localStorage.removeItem('tabbed');
        //     }
        // });
    }

    @action.bound getToken() {
        //console.log('fetching', this.tokenUrl)
        this.postData(this.tokenUrl);
    }

    postData(url = '', data = {}) {
        console.log('fetching', url)
        const response = fetch(url, {
          method: 'POST',
          mode: 'no-cors', // no-cors, *cors, same-origin
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          redirect: 'follow'
        }).then(response => {
            console.log('got token', response.json)
            //return response.json();
        });
    }

    render() {
        //const vm = this.viewModel;
        
        return (
            <div>
                <a href="#" onClick={this.authorize}>Authorize with Bungie</a>
                <br/>
                <a href="#" onClick={this.getToken}>Get token</a>
            </div>
        );
    }
}

export default MainPlayer;