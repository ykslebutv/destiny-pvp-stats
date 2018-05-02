# destiny-pvp-stats

* `cp src/index.html.example src/index.html`
* `cp src/config.js.example src/config.js`
* `cp src/proxy.php.example src/proxy.php`
* add your Bungie API key to `proxy.php`
* run `yarn` to setup required node modules
* config your webserver to point to `index.html` and be able to run proxy.php
* build `app.js` for development:
    `./node_modules/webpack/bin/webpack.js -wd`
* or build `app.min.js` for production:
    `minify=true ./node_modules/webpack/bin/webpack.js`
    (change app.js to app.min.js in index.html)
