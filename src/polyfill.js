import '../ext/external-helpers.js';
import { Promise } from 'es6-promise';
import WeakMap from 'weak-map';
import 'raf.js';

global.Promise = Promise;
global.WeakMap = WeakMap;
