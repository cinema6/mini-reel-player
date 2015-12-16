import VideoCard from '../../../src/models/VideoCard.js';
import BrightcoveVideoCard from '../../../src/models/BrightcoveVideoCard.js';

describe('BrightcoveVideoCard', function() {
    let card;
    let experience;
    let data;

    beforeEach(function() {
        experience = {
            data: {}
        };

        /* jshint quotmark:double */
        data = {
            "data": {
                "autoplay": true,
                "service": "brightcove",
                "videoid": "4655415742001",
                "accountid": "4652941506001",
                "playerid": "71cf5be9-7515-44d8-bb99-29ddc6224ff8",
                "embedid": "some-embed-id",
                "href": "http://players.brightcove.net/4652941506001/71cf5be9-7515-44d8-bb99-29ddc6224ff8_default/index.html?videoId=4655415742001",
                "thumbs": {
                    "small": "http://brightcove.vo.llnwd.net/e1/pd/96980657001/96980657001_207566970001_titmouse-still.jpg?pubId=4652941506001&videoId=4655415742001",
                    "large": "http://brightcove.vo.llnwd.net/e1/pd/96980657001/96980657001_207566970001_titmouse-still.jpg?pubId=4652941506001&videoId=4655415742001"
                }
            },
            "id": "rc-5ac14f008cef",
            "type": "brightcove",
            "title": "Birdz, Beautifully Blue: Brought to you By Brightcove",
            "note": null,
            "source": "Brightcove",
            "modules": [],
            "thumbs": null,
            "placementId": null,
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
                "campaignId": null,
                "advertiserId": null,
                "minViewTime": null,
                "countUrls": [],
                "clickUrls": []
            },
            "collateral": {},
            "links": {},
            "shareLinks": {},
            "params": {}
        };
        /* jshint quotmark:single */
        
        card = new BrightcoveVideoCard(data, experience);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            it('should set the accountid', function() {
                expect(card.data.accountid).toBe('4652941506001');
            });
            
            it('should set the playerid or default it', function() {
                expect(card.data.playerid).toBe('71cf5be9-7515-44d8-bb99-29ddc6224ff8');
                delete data.data.playerid;
                card = new BrightcoveVideoCard(data, experience);
                expect(card.data.playerid).toBe('default');
            });
            
            it('should set the embedid or default it', function() {
                expect(card.data.embedid).toBe('some-embed-id');
                delete data.data.embedid;
                card = new BrightcoveVideoCard(data, experience);
                expect(card.data.embedid).toBe('default');
            });
        });
    });

    describe('methods:', function() {
        describe('getSrc()', function() {
            it('should return an object of values required to load the video', function() {
                expect(card.getSrc()).toEqual(JSON.stringify({
                    accountid: '4652941506001',
                    playerid: '71cf5be9-7515-44d8-bb99-29ddc6224ff8',
                    videoid: '4655415742001',
                    embedid: 'some-embed-id'
                }));
            });
        });
    });
});
