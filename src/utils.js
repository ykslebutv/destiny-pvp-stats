/* global Config, localStorage */
import moment from 'moment';

import { Platforms, GameModes } from './constants';

class Utils {
    getRecentPlayers() {
        return JSON.parse(localStorage.getItem('recentPlayers')) || [];
    }

    saveRecentPlayerInfo(params) {
        const maxListSize = 25;
        let players = this.getRecentPlayers();
        players = players.filter(p => p.name !== params.name || p.platform !== params.platform);
        players.unshift({ name: params.name, platform: params.platform });
        players.splice(-1, players.length - maxListSize);
        localStorage.setItem('recentPlayers', JSON.stringify(players));
    }

    isScrolledToBottom() {
        return ((window.innerHeight + window.scrollY) >= document.body.offsetHeight);
    }

    getUrlParams() {
        return this.parseUrlParams(window.location.href);
    }

    parseUrlParams(url) {
        const res = {};
        // params[0] - http
        // params[1] - host
        // params[2] - platform or game
        // params[3] - name||membership
        // params[4] - mode
        const params = url.split('/').filter(param => param);
        if (params && params.length > 2) {
            res.base_url = `${ params[0] }//${ params[1] }`;
            if (params[2] === 'game') {
                res.game = params[3];
            } else {
                res.platform = parseInt(Object.keys(Platforms).find(key => Platforms[key].name.toLowerCase() === params[2]), 10);
                const nameOrId = decodeURIComponent(params[3]);
                if (this.isNumeric(nameOrId)) {
                    res.id = nameOrId;
                } else {
                    res.name = nameOrId;
                    if (Platforms[res.platform].name === 'PC') {
                        const matchRes = res.name.match(/(.+)-(\d{3,})/);
                        if (matchRes) {
                            res.name = `${ matchRes[1] }#${ matchRes[2] }`;
                        }
                    }
                }
                if (params[4]) {
                    res.mode = parseInt(Object.keys(GameModes).find(id => GameModes[id].key === params[4]), 10);
                }
            }
        }
        return res;
    }

    route(newParams) {
        const params = Object.assign({}, this.getUrlParams(), newParams);

        let newUrl = '';
        if (params.base_url) {
            newUrl = params.base_url;
        } else {
            newUrl = window.location.href.replace(/\/$/, '');
        }
        const platformStr = Platforms[params.platform].name.toLowerCase();
        const nameOrId = (params.name || '').replace('#', '-') || params.id;
        newUrl = `${ newUrl }/${ platformStr }/${ nameOrId }`;

        const modeStr = GameModes[params.mode].key;
        if (modeStr) {
            newUrl = `${ newUrl }/${ modeStr }`;
        }

        window.location.href = newUrl;
    }

    formatDate(period, includeTime) {
        return includeTime ? moment(period).format('ddd MM-DD-YYYY HH:mm') : moment(period).format('MM-DD-YYYY');
    }

    setTitle(playerName) {
        let title = Config.windowTitle;
        if (playerName.length > 0) {
            title = `${ playerName } - ${ title }`;
        }
        document.title = title;
    }

    isNumeric(str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    }

    wlRatio(wins, totalGames) {
        try {
            return Math.round((wins / totalGames) * 100);
        } catch (e) {
            return null;
        }
    }
}

export default new Utils();
