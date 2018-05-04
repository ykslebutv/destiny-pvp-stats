/* global Config, localStorage */
import moment from 'moment';

import { Platforms } from './constants';

class Utils {
    getRecentPlayers() {
        return JSON.parse(localStorage.getItem('recentPlayers')) || [];
    }

    saveRecentPlayerInfo(params) {
        let players = this.getRecentPlayers();
        players = players.filter(p => p.name !== params.name || p.platform !== params.platform);
        players.unshift({ name: params.name, platform: params.platform });
        players.splice(-1, players.length - 7);
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
        const match = url.match(/^(.*)\/(psn|xbox|pc|game)\/(.*)$/);
        if (match) {
            res.base_url = match[1];
            if (match[2] === 'game') {
                res.game = match[3];
            } else {
                res.platform = parseInt(Object.keys(Platforms).find(key => Platforms[key].name.toLowerCase() === match[2]), 10);
                const nameOrId = decodeURIComponent(match[3]);
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
            }
        }
        return res;
    }

    formatDate(period, includeTime) {
        return includeTime ? moment(period).format('ddd MM-DD-YYYY HH:mm') : moment(period).format('MM-DD-YYYY');
    }

    setTitle(playerName) {
        let title = Config.windowTitle;
        if (playerName.length > 0) {
            title = playerName + ' - ' + title;
        }
        document.title = title;
    }

    isNumeric(str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    }
}

export default new Utils();
