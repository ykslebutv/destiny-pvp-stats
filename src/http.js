/* global $, Config */
import Promise from 'es6-promise';

class Http {
    request(url) {
        return new Promise((resolve, reject) => {
            let headers = {};
            let fullUrl;
            if (Config.useProxy) {
                const encodedUrl = encodeURIComponent(url);
                fullUrl = `${ Config.proxyUrl }?url=${ encodedUrl }`;
            } else {
                headers = { 'x-api-key': Config.apiKey };
                fullUrl = `${ Config.baseUrl }/${ url }`;
            }

            $.ajax({
                url: fullUrl,
                headers: headers,
                success: res => resolve(res),
                failure: error => reject(error)
            });
        });
    }
}

export default new Http();
