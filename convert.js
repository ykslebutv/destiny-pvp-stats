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

const saveManifest = (section, json) => {
    const fileName = `./src/manifest/${ section }.json`;
    console.log(`Writing ${ fileName }`);

    const jsonStr = JSON.stringify(json, null, 2);
    console.log(jsonStr);

    fs.writeFile(fileName, jsonStr, err => {
        if (err) {
            console.log(err);
        }
    });
}

const convertSection = (section, json, schema) => {

    console.log(`Converting ${ section }`);

    const sectionManifest = {};

    // get lowest level name and its value, for example:
    // for "displayProperties.name" return { "name": "Mayhem" }
    const getValue = (obj, field) => {
        const path = field.split('.');
        let i = 0;
        let o = obj;
        while(path[i]) {
            o = o[path[i]];
            i = i + 1;
        }
        return Object.assign({}, { [path[i-1]]: o });
    }

    Object.keys(json).map(hash => {
        const obj = {};
        schema.map(field => {
            Object.assign(obj, getValue(json[hash], field));
        });
        sectionManifest[hash] = obj;
    });

    saveManifest(section, sectionManifest);
}

const convertManifest = (json, schema) => {
    Object.keys(schema).map(section => convertSection(section, json[section], schema[section]));
}

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
    const localUrl = 'http://localhost:8003/manifest.json';
    return new Promise((resolve, reject) => {
        fetch(localUrl).then(res => resolve(res.json()));
    });
}

const schema = {
    "DestinyActivityModeDefinition": [
        "displayProperties.name",
        "displayProperties.icon",
        "modeType",
        "friendlyName"
    ],
    "DestinyActivityDefinition": [
        "displayProperties.name",
        "pgcrImage",
    ],
    "DestinyStatDefinition": [
        "displayProperties.name",
        "displayProperties.icon"
    ]
}

fetchManifestUrl()
    .then(url => fetchManifest(url))
    .then(manifest => convertManifest(manifest, schema));
