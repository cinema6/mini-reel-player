import VideoCard from './VideoCard.js';

export default class BrightcoveVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);

        this.data.accountid = data.data.accountid;
        this.data.playerid = data.data.playerid || 'default';
        this.data.embedid = data.data.embedid || 'default';
    }

    getSrc() {
        return JSON.stringify({
            accountid: this.data.accountid,
            playerid: this.data.playerid,
            videoid: this.data.videoid,
            embedid: this.data.embedid
        });
    }
}
