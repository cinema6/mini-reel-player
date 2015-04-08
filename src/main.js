import {Promise} from 'es6-promise';
import WeakMap from 'weak-map';
import 'whatwg-fetch';
import 'raf.js';

global.Promise = Promise;
global.WeakMap = WeakMap;

import tracker from './services/tracker.js';
import './tests.js';

tracker.api('c6Tracker');
