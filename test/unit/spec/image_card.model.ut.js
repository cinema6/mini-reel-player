import ImageCard from '../../../src/models/ImageCard.js';
import Card from '../../../src/models/Card.js';

describe('ImageCard', function() {
    let imageCard;
    let experience, data;

    beforeEach(function() {
        experience = {
            data: {
                collateral: {
                    splash: '/collateral/experiences/e-42108b552a05ea/splash'
                }
            }
        };

        data = {
            /* jshint quotmark:double */
            "data": {
                "src": "www.flickr.com/image.jpg",
                "href": "https://flic.kr/p/12345",
                "width": "100",
                "height": "100",
                "service": "flickr",
                "imageid": "12345",
                "source": "Flickr",
                "thumbs": {
                    "small": "www.site.com/small.jpg",
                    "large": "www.site.com/large.jpg"
                }
            },
            "id": "rc-4b3dc304c3573f",
            "type": "image",
            "title": "Check These Out!",
            "note": "These people play the trumpet like you've never heard before.",
            "modules": [],
            "placementId": null,
            "templateUrl": null,
            "sponsored": false,
            "campaign": {
                "campaignId": null,
                 "advertiserId": null,
                 "minViewTime": null
            },
            "collateral": {},
            "links": {},
            "params": {}
            /* jshint quotmark:single */
        };

        imageCard = new ImageCard(data, experience);
    });

    it('should be a Card', function() {
        expect(imageCard).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "image"', function() {
                expect(imageCard.type).toBe('image');
            });
        });

        describe('thumbs', function() {
            it('should be copied from the passed-in value', function() {
                expect(imageCard.thumbs).toEqual({
                    small: data.data.thumbs.small,
                    large: data.data.thumbs.large
                });
            });
        });

        describe('data', function() {
            it('should be copied from the passed-in value', function() {
                expect(imageCard.data).toEqual({
                    src: 'www.flickr.com/image.jpg',
                    href: 'https://flic.kr/p/12345',
                    width: '100',
                    height: '100',
                    service: 'flickr',
                    imageid: '12345',
                    source: 'Flickr'
                });
            });
        });

    });
});
