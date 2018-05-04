/* global Config */

class Http {
    request(url) {
        let headers = {};
        let fullUrl;
        if (Config.useProxy) {
            const encodedUrl = encodeURIComponent(url);
            fullUrl = `${ Config.proxyUrl }?url=${ encodedUrl }`;
        } else {
            headers = { 'x-api-key': Config.apiKey };
            fullUrl = `${ Config.baseUrl }${ url }`;
        }

        return fetch(fullUrl, { headers: headers }).then(res => res.json());
    }
}

export default new Http();
