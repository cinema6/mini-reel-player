import './main.js';
import Runner from '../lib/Runner.js';
import DesktopCardApplicationController from
    './controllers/desktop-card/DesktopCardApplicationController.js';

Runner.run(() => new DesktopCardApplicationController(document.body));
