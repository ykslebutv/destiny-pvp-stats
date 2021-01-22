/* global Workdata, Config */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

// import { Typography } from 'antd';
// const { Title } = Typography;

import destiny2 from './destiny2';
import { CharacterList } from './models/Character.jsx';
import LoadoutOptimizer from './LoadoutOptimizer.jsx';


const Status = {
    NOT_AUTHORIZED: null,
    AUTHORIZING: "authorizing",
    LOADING: "loading",
    READY: "ready"
}

@observer export default class MainPage extends React.Component {

    constructor() {
        super();

        // if (!this.accessToken) {
        //     this.getCurrentUser();
        // }
    }

    @computed get status() {
        return Status.READY;

        if (!this.accessToken) {
            return Status.NOT_AUTHORIZED;
        }

        if (!this.user) {
            return Status.LOADING;
        }

        return Status.READY;
    }

    @action.bound authorize() {
        const url = "https://www.bungie.net/en/OAuth/Authorize?client_id=34984&response_type=code";
        window.open(url, "Authorize with Bungie"); //, "width=600, height=800");
        window.addEventListener('storage', function(e) {
            this.accessToken = localStorage.getItem('accessToken');
        });
    }

    @observable user = Workdata.user;
    @observable profile = Workdata.profile;
    @observable characters = Workdata.characters;
    // @observable user;
    // @observable profile;
    // @observable characters;
    @observable activeCharacterId;

    get userName() {
        return this.user ? this.user.destinyMemberships[0].LastSeenDisplayName : null;
    }

    get membershipType() {
        return this.user ? this.user.destinyMemberships[0].membershipType : null;
    }

    get membershipId() {
        return this.user ? this.user.destinyMemberships[0].membershipId : null;
    }

    getCurrentUser() {
        destiny2.getCurrentUser(this.accessToken).then(res => {
            this.receiveUser(res);
            destiny2.getProfile(this.membershipType, this.membershipId).then(res => {
                this.receiveProfile(res);

                this.profile.characters.forEach(character => {
                    destiny2.getCharacter(this.membershipType, this.membershipId, character.characterId, this.accessToken).then(res => {
                        this.receiveCharacter(res);
                    });
                });
            });
        })
        .catch(error => {
            console.log(error);
            this.handleFailure();
        });
    }

    @action receiveUser(data) {
        this.user = data;   
    }

    @action receiveProfile(data) {
        this.profile = data;   
    }

    @action receiveCharacter(data) {
        this.characters.push(data);
    }

    @action.bound handleFailure() {
        localStorage.removeItem("accessToken");
        this.accessToken = null;
    }

    @action.bound setActiveCharacter(characterId) {
        this.activeCharacterId = characterId;
    }

    characterData(characterId) {
        return this.characters ? this.characters.find(c => c.characterId === characterId) : null;
    }

    render() {
        const headerRow = (
            <div className="flex-container header-container">
                <div>
                    <h1>D2 Loadout Optimizer</h1>
                </div>
                <div className="text-right">
                    <h2>{this.userName}</h2>
                </div>
            </div>
        );

        const authorizeRow = this.status === Status.NOT_AUTHORIZED ? (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.authorize}>
                    Authorize with Bungie
                </button>
            </div>
        ) : null;

        const characterList = this.status === Status.READY ? (
            <CharacterList
                characters={this.profile.characters}
                activeCharacterId={this.activeCharacterId}
                onClick={this.setActiveCharacter}
            />
        ) : null;

        const data = this.characterData(this.activeCharacterId);

        return (
            <div>
                { headerRow }
                { authorizeRow }
                <div className="flex-container">
                    { characterList }
                    { data && <LoadoutOptimizer data={data} /> }
                    <div />
                </div>
            </div>
        );
    }
}
