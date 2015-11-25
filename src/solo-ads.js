import './main.js';
import Runner from '../lib/Runner.js';
import SoloAdsApplicationController from './controllers/solo-ads/SoloAdsApplicationController.js';

Runner.run(() => new SoloAdsApplicationController(document.body));
