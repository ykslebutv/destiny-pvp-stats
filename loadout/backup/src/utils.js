/* global Config, localStorage */

class Utils {
    getUrlParams() {
        return this.parseUrlParams(window.location.href);
    }

    parseUrlParams(url) {
        const res = {};
        // params[0] - http
        // params[1] - host
        // params[2] - platform
        // params[3] - name||membership
        // params[4] - mode
        const params = url.split('/').filter(param => param);
        if (params && params.length > 2) {
            res.base_url = `${ params[0] }//${ params[1] }`;
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

        if (params.mode) {
            newUrl = `${ newUrl }/${ params.mode }`;
        }

        window.location.href = newUrl;
    }

    isNumeric(str) {
        return !isNaN(parseFloat(str)) && isFinite(str);
    }

    findByField(obj, field, value) {
        return Object.keys(obj).find(key => obj[key][field] === value);
    }
}

export default new Utils();