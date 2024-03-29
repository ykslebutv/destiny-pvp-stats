/* global Config, Manifest, localStorage */
import moment from 'moment';

class Utils {
    getRecentPlayers() {
        const recentPlayers = JSON.parse(localStorage.getItem('recentPlayers')) || [];
        // remove cached battle.net players
        return recentPlayers.filter(player => player.platform !== 4);
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
        // params[2] - :platform_id | game
        // params[3] - :membership_id | :game_id
        // params[4] - :mode
        const params = url.split('/').filter(param => param);
        if (params && params.length > 2) {
            res.base_url = `${ params[0] }//${ params[1] }`;
            if (params[2] === 'game') {
                res.game = params[3];
            } else {
                res.platform = params[2];
                res.id = params[3];
                if (params[4]) {
                    res.mode = this.findByField(Manifest.DestinyActivityModeDefinition, 'friendlyName', params[4]);
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

        newUrl = `${ newUrl }/${ params.platform }/${ params.id }`;
        if (params.mode) {
            newUrl = `${ newUrl }/${ params.mode }`;
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

    findByField(obj, field, value) {
        return Object.keys(obj).find(key => obj[key][field] === value);
    }

    utfCodeReplace(str) {
        return str.replaceAll(/(&#)(\d{4})(;)/g, (m1, m2, m3) => String.fromCharCode(m3));
    }
}

export default new Utils();
