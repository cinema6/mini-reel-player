export default class PlayerInterface {
    constructor() {
        this.currentTime = Number;
        this.duration = Number;
        this.ended = Boolean;
        this.paused = Boolean;
        this.readyState = Number;
        this.seeking = Boolean;
        this.src = null;
        this.error = null;
        this.poster = null;
    }

    pause() {}
    play() {}
    load() {}
    unload() {}
    reload() {}
    minimize() {}
}
