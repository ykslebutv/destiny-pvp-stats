import { extendObservable, action } from 'mobx';

import CharacterModel from './characterModel.jsx';

class PlayerModel {
    constructor(args) {
        try {
            extendObservable(this, {
                displayName: args.userInfo.displayName,
                membershipId: args.userInfo.membershipId,
                membershipType: args.userInfo.membershipType,
                characters: args.characters.map(character => new CharacterModel(character))
            });
        } catch(e) {
            console.log('PlayerModel::constructor exception', e);
            if (Config.debug) {
                console.log('args', args);
            }
        }
    }

    setClanInfo(clanName, clanTag) {
        extendObservable(this, {
            clanName: clanName,
            clanTag: clanTag
        });
    }
}

export default PlayerModel;