import './main.js';
import Runner from '../lib/Runner.js';
import SoloApplicationController from './controllers/solo/SoloApplicationController.js';

Runner.run(() => new SoloApplicationController(document.body));
