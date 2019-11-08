/*
  Usage:
  - download the manifest (.content file) and unzip it
  - open it as a sqlite connection in DBeaver and export the DestinyActivityDefinition 
    table to JSON (eg DestinyActivityDefinition_201911071340.json)
  - run "node convertFromDB.js"
*/

const destinyActivityDefinitionFile = 'DestinyActivityDefinition_201911071340.json';

const fs = require('fs');
const path = require('path');

const convert = (json, prefix) => {

    const mainArray = json["DestinyActivityDefinition"];

    const definitionsArr = mainArray.map(obj => {
          const prop = JSON.parse(obj.json);
          return { [prop.hash]: prop.displayProperties.name };
        }
    );

    definitionsObj = Object.assign({}, ...definitionsArr);

    const fileName = './src/' + prefix + 'Definitions.json';

    fs.writeFile(fileName, JSON.stringify(definitionsObj), err => {
        if (err) {
            console.log(err);
        }
    });
};

const convertManifestData = (filename, prefix) => {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
        convert(JSON.parse(data), prefix);
    });
};

convertManifestData(destinyActivityDefinitionFile, 'map');
