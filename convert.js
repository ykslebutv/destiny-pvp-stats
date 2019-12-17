/*
  Purpose:
  - downloads the latest complete manifest from Bungie
    and converts it into smaller/flattened pieces based on schema

  Usage:
  - run 'node convert.js'
*/

'use strict';

const Promise = require('es6-promise');
const fetch = require('node-fetch');
const fs = require('fs');

const saveManifest = (fileName, json) => {
    console.log(`Writing ${ fileName }`);

    const jsonStr = JSON.stringify(json, null, 2);
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

        if (schema.filter && schema.filter.field && schema.filter.allowedValues) {
            if (!schema.filter.allowedValues.find(value => json[hash][schema.filter.field] === value)) {
                return;
            }
        }

        schema.fields.map(field => {
            Object.assign(obj, getValue(json[hash], field));
        });

        const key = schema.key ? getValue(json[hash], schema.key)[schema.key] : hash;
        sectionManifest[key] = obj;
    });

    return sectionManifest;
}

const convertManifest = (json, schema) => {
    const manifest = {};
    Object.keys(schema).map(section => {
        manifest[section] = convertSection(section, json[section], schema[section]);
    });
    saveManifest('./src/manifest.json', manifest);
}

const fetchManifestUrl = () => {
    console.log('Getting manifest URL...');
    const url = 'https://www.bungie.net/platform/Destiny2/Manifest/';
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(json => {
                resolve(`http://bungie.net${ json.Response.jsonWorldContentPaths.en }`);
            });
    });
}

const fetchManifest = (url) => {
    console.log('Downloading manifest...');
    //const localUrl = 'http://localhost:8003/downloadedManifest.json';
    return new Promise((resolve, reject) => {
        fetch(url).then(res => resolve(res.json()));
    });
}

const schema = {
    "DestinyActivityModeDefinition": {
        key: "modeType",
        fields: [
            "displayProperties.name",
            "displayProperties.icon",
            "modeType",
            "friendlyName"
        ]
    },
    "DestinyActivityDefinition": {
        fields: [
            "displayProperties.name",
            "pgcrImage"
        ]
    },
    "DestinyStatDefinition": {
        fields: [
            "displayProperties.name",
            "displayProperties.icon"
        ]
    },
    "DestinySandboxPerkDefinition": {
        fields: [
            "displayProperties.name",
            "displayProperties.icon"
        ],
        filter: {
            field: 'isDisplayable',
            allowedValues: [true]
        }
    },
    "DestinyInventoryBucketDefinition": {
        fields: [
            "displayProperties.name"
        ]
    },
    "DestinyInventoryItemDefinition": {
        fields: [
            "displayProperties.name",
            "displayProperties.icon"
        ],
        filter: {
            field: 'itemType',
            allowedValues: [2, 3] // just armor and weapons to keep manifest slim
        }
    }
}

fetchManifestUrl()
    .then(url => fetchManifest(url))
    .then(manifest => convertManifest(manifest, schema));
