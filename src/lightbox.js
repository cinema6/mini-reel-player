import './main.js';
import Runner from '../lib/Runner.js';
import LightboxApplicationController from './controllers/lightbox/LightboxApplicationController.js';

Runner.run(() => new LightboxApplicationController(document.body));
