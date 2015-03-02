global.Promise = require('es6-promise').Promise;
global.WeakMap = require('weak-map');
require('whatwg-fetch');
require('raf.js');
require('6to5/runtime');
require('gsap/src/uncompressed/plugins/CSSPlugin.js');
import './tests.js';

import Runner from '../lib/Runner.js';
import ApplicationController from './controllers/ApplicationController.js';

Runner.run(() => new ApplicationController(document.body));
