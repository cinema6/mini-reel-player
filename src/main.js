import {Promise} from 'es6-promise';
import WeakMap from 'weak-map';
import 'whatwg-fetch';
import 'raf.js';
import 'gsap/src/uncompressed/plugins/CSSPlugin.js';

global.Promise = Promise;
global.WeakMap = WeakMap;

import Runner from '../lib/Runner.js';
import ApplicationController from './controllers/ApplicationController.js';
import tracker from './services/tracker.js';
import './tests.js';

tracker.api('c6Tracker');

Runner.run(() => new ApplicationController(document.body));
