/*
  Usage:
  node convert.js
*/

const fetch = require('node-fetch');
const fs = require('fs');

const convert = (json, prefix) => {
    const definitions = Object.assign({},
        ...Object.keys(json).map(hash => ({ [hash]: json[hash].displayProperties.name })));

    const fileName = './src/' + prefix + 'Definitions.json';

    fs.writeFile(fileName, JSON.stringify(definitions), err => {
        if (err) {
            console.log(err);
        }
    });
};

const convertManifestData = (url, prefix) => {
    fetch(url)
        .then(res => res.json())
        .then(json => convert(json, prefix));
};


const destinyActivityDefinitionUrl = 'https://destiny.plumbing/en/raw/DestinyActivityDefinition.json';

convertManifestData(destinyActivityDefinitionUrl, 'map');
