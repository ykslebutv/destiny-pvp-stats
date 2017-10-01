import Promise from 'es6-promise';

class Http {
    request(url) {
        return new Promise(function(resolve, reject) {
            var headers = {};
            if (Config.useProxy) {
                var encodedUrl = encodeURIComponent(url);
                var full_url = `${ Config.proxyUrl }?url=${ encodedUrl }`;
            } else {
                headers = { 'x-api-key': Config.apiKey };
                var full_url = `${ Config.baseUrl }/${ url }`;
            }

            $.ajax({
                url: full_url,
                headers: headers,
                success: function(res) {
                    resolve(res);
                }
            });
        })
    }
}

export default new Http();
