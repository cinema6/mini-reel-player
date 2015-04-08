import './main.js';
import Runner from '../lib/Runner.js';
import LightboxPlaylistApplicationController
    from './controllers/lightbox-playlist/LightboxPlaylistApplicationController.js';

Runner.run(() => new LightboxPlaylistApplicationController(document.body));
