/*
  Purpose:
  - downloads the required manifest components from Bungie
    and converts it into smaller/flattened pieces based on schema

  Usage:
  - run 'node convert.2js'
*/

'use strict';

const Promise = require('es6-promise');
const fetch = require('node-fetch');
const fs = require('fs');

const baseUrl = 'https://www.bungie.net';

const saveManifestComponent = async (name, json) => {
    const fileName = `./src/manifest/${ name }.json`;
    console.log(`Writing ${ fileName }`);

    const jsonStr = JSON.stringify(json, null, 2);
    fs.writeFile(fileName, jsonStr, err => {
        if (err) {
            console.log(err);
        }
    });
    reportMemUse();
}

const saveManifest = (json) => {
    const fileName = './src/manifest.js';
    console.log(`Writing ${ fileName }`);

    const header = "(function() {\n    window.Manifest =\n";
    const footer = "\n}());";

    const jsonStr = JSON.stringify(json, null, 2);
    fs.writeFile(fileName, header+jsonStr+footer, err => {
        if (err) {
            console.log(err);
        }
    });
}

const convertManifest = (json) => {
    const manifest = {}
    const ps = Object.keys(schema).map(componentName => {
        const componentUrl = `${ baseUrl }${ json.Response.jsonWorldComponentContentPaths.en[componentName] }`;
        return fetchManifestComponent(componentName, componentUrl)
            .then(sectionJson => convertSection(componentName, sectionJson, schema[componentName]))
            .then(convertedJson => manifest[componentName] = convertedJson);
    });

    Promise.all(ps).then(() => {
        saveManifest(manifest);
        console.log('all done!')
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

const fetchManifest = () => {
    console.log('Getting the manifest...');
    const url = `${ baseUrl }/platform/Destiny2/Manifest/`;
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => resolve(res.json()));
    });
}

const fetchManifestComponent = (name, url) => {
    console.log(`Downloading ${name} component...`)
    return new Promise((resolve, reject) => {
        fetch(url).then(res => resolve(res.json()));
    });
}

const reportMemUse = () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
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
          "displayProperties.description",
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
          "displayProperties.icon",
          "itemType",
          "itemSubType",
          "inventory.tierTypeName"
      ],
      filter: {
          field: 'itemType',
          allowedValues: [2, 3, 19] // to keep manifest slim: 2-weapons, 3-armor, 19-mods (includes ornaments)
      }
  }
}

fetchManifest().then(manifest => convertManifest(manifest));
