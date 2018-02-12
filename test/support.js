import path from 'path';
import appModulePath from 'app-module-path';

import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

import { Factory } from 'rosie';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as enzyme from 'enzyme';

chai.use(sinonChai);
chai.use(chaiEnzyme())

// directories to look up imported modules
// this is ondemand specific, change to meet your needs
appModulePath.addPath(__dirname);
appModulePath.addPath(path.resolve(__dirname, '../src'));

global.expect = chai.expect;
global.enzyme = enzyme;
global.sinon = sinon;
global.Factory = Factory;
