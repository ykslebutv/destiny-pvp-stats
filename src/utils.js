/* global $, Config, moment */

class Utils {
    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; path=/; ' + expires;
    }

    getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        let c;
        let i;
        for (i = 0; i < ca.length; i += 1) {
            c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    isScrolledToBottom() {
        return ($(window).scrollTop() === $(document).height() - $(window).height());
    }

    getUrlParams() {
        const res = {};
        const match = window.location.href.match(/^(.*)\/(psn|xbox)\/(.*)$/);
        if (match) {
            res.base_url = match[1];
            res.platform = match[2] === 'xbox' ? '1' : '2';
            res.name = decodeURIComponent(match[3]);
        }
        return res;
    }

    formatDate(period, includeTime) {
        return includeTime ? moment(period).format('ddd MM-DD-YYYY hh:mm') : moment(period).format('MM-DD-YYYY');
    }

    setTitle(playerName) {
        let title = Config.windowTitle;
        if (playerName.length > 0) {
            title = playerName + ' - ' + title;
        }
        document.title = title;
    }
}

export default new Utils();
