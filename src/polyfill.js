import 'babel-core/external-helpers';
import { Promise } from 'es6-promise';
import WeakMap from 'weak-map';
import 'whatwg-fetch';
import 'raf.js';

global.Promise = Promise;
global.WeakMap = WeakMap;
