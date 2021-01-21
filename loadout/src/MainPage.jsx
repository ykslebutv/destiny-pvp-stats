/* global Workdata, Config */
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import destiny2 from './destiny2';
import Character from './models/Character.jsx';
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
            <div className="row mt-2">
                <div className="col-sm-6">
                    <h1>D2 Loadout Optimizer</h1>
                </div>
                <div className="col-sm-6 pt-2 text-right">
                    <h2>{this.userName}</h2>
                </div>
            </div>
        );

        const characterList = this.status === Status.READY ? (
            <div className="row">
            {
                this.profile.characters.map(character =>
                    <div className="col character-list">
                        <Character
                            key={ character.characterId }
                            character={ character }
                            active={this.activeCharacterId === character.characterId}
                            onClick={this.setActiveCharacter}
                        />
                    </div>
                )
            }
            </div>
        ) : null;

        const data = this.characterData(this.activeCharacterId);

        return (
            <div className="container">
                { headerRow }
                { characterList }
                { data && <LoadoutOptimizer data={data} />}
                { this.status === Status.NOT_AUTHORIZED && (
                    <div className="container">
                        <button type="button" className="btn btn-primary" onClick={this.authorize}>
                            Authorize with Bungie
                        </button>
                    </div>
                ) }
            </div>
        );
    }
}
