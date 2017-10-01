class Utils {
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; path=/; " + expires;
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length,c.length);
            }
        }
        return "";
    }

    isScrolledToBottom() {
    	return ( $(window).scrollTop() == $(document).height() - $(window).height() );
    }

    getUrlParams() {
        var res = {};
        var match = window.location.href.match(/^(.*)\/(psn|xbox)\/(.*)$/);
        if (match) {
            res.base_url = match[1];
            res.platform = match[2] === 'xbox' ? '1' : '2';
            res.name = decodeURIComponent(match[3]);
        }
        return res;
    }

    formatDate(period, includeTime) {
        if (includeTime)
            return moment(period).format('ddd MM-DD-YYYY hh:mm');
        else
            return moment(period).format('MM-DD-YYYY');
    }

    setTitle(playerName) {
        var title = Config.windowTitle;
        if (playerName.length > 0) {
            title = playerName + ' - ' + title;
        }
        document.title = title;
    }
}

export default new Utils();
