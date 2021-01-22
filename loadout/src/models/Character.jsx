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
    const { character, onClick } = props;
    const classType = CharacterTypes[character.classType];
    const divStyle = {
        backgroundImage: `url(${ Config.baseUrl }${ character.emblemBackgroundPath })`
    };

    return (
        <div
          className="banner"
          style={ divStyle }
          onClick={() => onClick(character.characterId)}
        >
            <span className="classType">{ classType }</span>
            <span className="level light">{ character.light }</span>
        </div>
    );
};

const Emblem = props => {
    const { character, onClick } = props;
    const divStyle = {
        backgroundImage: `url(${ Config.baseUrl }${ character.emblemBackgroundPath })`
    };

    return (
        <div
            className="emblem"
            style={ divStyle }
            onClick={() => onClick(character.characterId)}
        />
    );
};

@observer class Character extends React.Component {
    render() {
        const { character, active, onClick } = this.props;
        return active ? (
            <Banner character={character} onClick={onClick} />
        ) : (
            <Emblem character={character} onClick={onClick} />
        );
    }
}

@observer class CharacterList extends React.Component {
    render() {
        return (
            <div className="flex-container">
                {
                this.props.characters.map(character =>
                    <Character
                        key={ character.characterId }
                        character={ character }
                        active={this.props.activeCharacterId === character.characterId}
                        onClick={this.props.onClick}
                    />
                )
                }
            </div>
        );
    }
}

export { CharacterList };
