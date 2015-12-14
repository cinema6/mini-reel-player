function FullscreenPlayerController() {}
FullscreenPlayerController.prototype = {
    initFullscreen: function() {
        this.minireel.on('launch', () => this.minireel.embed.ping('fullscreen', true));
        this.minireel.on('close', () => this.minireel.embed.ping('fullscreen', false));
    }
};

export default FullscreenPlayerController;
