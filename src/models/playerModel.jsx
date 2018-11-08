/* global Config */
import { extendObservable } from 'mobx';

import CharacterModel from './characterModel.jsx';
import ProgressionModel from './progressionModel.jsx';

class PlayerModel {
    constructor(args) {
        const sortedChars = args.characters.sort((a, b) => a.characterId > b.characterId);
        try {
            extendObservable(this, {
                displayName: args.userInfo.displayName,
                membershipId: args.userInfo.membershipId,
                membershipType: args.userInfo.membershipType,
                characters: sortedChars.map(character => new CharacterModel(character)),
                progression: new ProgressionModel(args.progressions)
            });
        } catch (e) {
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
