function SkipTimerVideoCardController() {}
SkipTimerVideoCardController.prototype = {
    initSkipTimer: function() {
        this.model.on('becameUnskippable', () => this.view.skipTimer.show());
        this.model.on('becameSkippable', () => this.view.skipTimer.hide());
        this.model.on('skippableProgress', remaining => this.view.skipTimer.update(remaining));
    }
};

export default SkipTimerVideoCardController;
