import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import { extendObservable, action } from 'mobx';
import { Platforms, PlatformNames } from '../constants';
import SpinnerComp from './spinnerComp.jsx';
import Utils from '../utils';

const SearchForm = observer(class SearchForm extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: Utils.getCookie('player'),
            platform: Utils.getCookie('platform')
        });

        extendObservable(this, {
            setName: action(name => {
                this.name = name;
            }),
            setPlatform: action(platform => {
                this.platform = platform;
            })
        });
    }

    onSubmit(e) {
        e.preventDefault();

        Utils.setCookie('player', this.name, 365);
        Utils.setCookie('platform', this.platform, 365);

        const params = Utils.getUrlParams();
        let newUrl = '';
        if (params.base_url) {
            newUrl = params.base_url;
        } else {
            newUrl = window.location.href.replace(/\/$/, '');
        }
        const platformStr = PlatformNames[this.platform];
        newUrl = `${ newUrl }/${ platformStr }/${ this.name }`;

        window.location.href = newUrl;
    }

    render() {
        return (
            <form onSubmit={ e => this.onSubmit(e) } id="searchForm">
                <div className="search_form_1">
                    <a href="/"><img className="logo" src="images/destiny48x48.png" /></a>
                    <input
                        className="search_field"
                        type="text"
                        value={ this.name }
                        onChange={ e => this.setName(e.target.value) }
                    />
                </div>
                <div className="search_form_2">
                    <label>
                        <input
                            type="radio"
                            name="platform"
                            value={ Platforms.PSN }
                            onChange={ e => this.setPlatform(e.target.value) }
                            checked={ this.platform === Platforms.PSN }
                        /> PSN
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="platform"
                            value={ Platforms.XBOX }
                            onChange={ e => this.setPlatform(e.target.value) }
                            checked={ this.platform === Platforms.XBOX }
                        /> Xbox
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="platform"
                            value={ Platforms.PC }
                            onChange={ e => this.setPlatform(e.target.value) }
                            checked={ this.platform === Platforms.PC }
                        /> PC
                    </label>
                    <button
                        className="btn btn-primary"
                        style={{ minWidth: '80px' }}
                        disabled={ !this.platform || !this.name }
                    >
                        { this.props.loading ? <SpinnerComp scale="0.45" color="white" /> : 'search' }
                    </button>
                </div>
            </form>
        );
    }
});

export default SearchForm;
