import './main.js';
import Runner from '../lib/Runner.js';
import FullNPApplicationController from './controllers/full-np/FullNPApplicationController.js';

Runner.run(() => new FullNPApplicationController(document.body));
