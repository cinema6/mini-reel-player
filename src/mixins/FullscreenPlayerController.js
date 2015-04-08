import cinema6 from '../services/cinema6.js';

function FullscreenPlayerController() {}
FullscreenPlayerController.prototype = {
    initFullscreen: function() {
        this.minireel.on('launch', () => cinema6.fullscreen(true));
        this.minireel.on('close', () => cinema6.fullscreen(false));
    }
};

export default FullscreenPlayerController;
