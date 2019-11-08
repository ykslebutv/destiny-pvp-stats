/*
  Usage:
  - specify API key below
  - run 'node convert.js'
*/

'use strict';

const Promise = require('es6-promise');
const fetch = require('node-fetch');
const fs = require('fs');

const apiKey = 'YOUR KEY HERE';

const convert = (manifest, prefix) => {
    console.log('Converting DestinyActivityDefinition data...');
    const json = manifest.DestinyActivityDefinition;

    const definitions = Object.assign({},
        ...Object.keys(json).map(hash => ({ [hash]: json[hash].displayProperties.name })));

    const fileName = './src/' + prefix + 'Definitions.json';

    fs.writeFile(fileName, JSON.stringify(definitions), err => {
        if (err) {
            console.log(err);
        }
    });

    console.log('Done!');
};

const fetchManifestUrl = () => {
    console.log('Getting manifest URL...');
    const url = 'https://www.bungie.net/platform/Destiny2/Manifest/';
    return new Promise((resolve, reject) => {
        fetch(url, { headers: { 'X-API-KEY': apiKey } })
            .then(res => res.json())
            .then(json => {
                resolve(`http://bungie.net${ json.Response.jsonWorldContentPaths.en }`);
            });
    });
}

const fetchManifest = (url) => {
    console.log('Downloading manifest...');
    return new Promise((resolve, reject) => {
        fetch(url).then(res => resolve(res.json()));
    });
}

fetchManifestUrl()
    .then(url => fetchManifest(url))
    .then(manifest => convert(manifest, 'map'));
