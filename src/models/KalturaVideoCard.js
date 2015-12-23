import VideoCard from './VideoCard.js';

export default class BrightcoveVideoCard extends VideoCard {
    constructor(data) {
        super(...arguments);

        this.data.partnerid = data.data.partnerid;
        this.data.playerid = data.data.playerid;
    }

    getSrc() {
        return JSON.stringify({
            partnerid: this.data.partnerid,
            playerid: this.data.playerid,
            videoid: this.data.videoid
        });
    }
}
