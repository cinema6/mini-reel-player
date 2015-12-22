import VideoCard from '../../../src/models/VideoCard.js';
import KalturaVideoCard from '../../../src/models/KalturaVideoCard.js';

describe('KalturaVideoCard', function() {
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
                "service": "kaltura",
                "partnerid": "2054981",
                "playerid": "32784031",
                "videoid": "1_dsup2iqd",
                "href": "",
                "thumbs": {
                    "small": "https://lh4.googleusercontent.com/-7XOxnCrBu9k/AAAAAAAAAAI/AAAAAAAAAKI/yGNCVbp82gE/s0-c-k-no-ns/photo.jpg",
                    "large": "https://lh4.googleusercontent.com/-7XOxnCrBu9k/AAAAAAAAAAI/AAAAAAAAAKI/yGNCVbp82gE/s0-c-k-no-ns/photo.jpg"
                }
            },
            "id": "rc-86afeb278139",
            "type": "kaltura",
            "title": "Kewltastic Kaltura",
            "note": "Autodesk makes quality, well engineered, bug free software.",
            "source": "Kaltura",
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
        
        card = new KalturaVideoCard(data, experience);
    });

    it('should exist', function() {
        expect(card).toEqual(jasmine.any(VideoCard));
    });

    describe('properties:', function() {
        describe('data', function() {
            it('should set the partnerid', function() {
                expect(card.data.partnerid).toBe('2054981');
            });
            
            it('should set the playerid', function() {
                expect(card.data.playerid).toBe('32784031');
            });
        });
    });

    describe('methods:', function() {
        describe('getSrc()', function() {
            it('should return an object of values required to load the video', function() {
                expect(card.getSrc()).toEqual(JSON.stringify({
                    partnerid: '2054981',
                    playerid: '32784031',
                    videoid: '1_dsup2iqd'
                }));
            });
        });
    });
});
