/* global Config */
import React from 'react';
import MediaQuery from 'react-responsive';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

const CharacterTypes = {
  0: 'Titan',
  1: 'Hunter',
  2: 'Warlock'
};

const Banner = props => {
    const { character, active, onClick } = props;
    const classType = CharacterTypes[character.classType];
    const divStyle = {
        backgroundImage: `url(${ Config.baseUrl }${ character.emblemBackgroundPath })`
    };
    const className = active ? "character character_active" : "character";

    return (
        <div
          className={className}
          style={ divStyle }
          onClick={() => onClick(character.characterId)}
        >
            <span className="classType">{ classType }</span>
            <span className="level light">{ character.light }</span>
        </div>
    );
};

@observer class Character extends React.Component {
    render() {
        const {...rest} = this.props;
        return (
            <div className="character_container">
                <Banner {...rest} />
            </div>
        );
    }
}

export default Character;
