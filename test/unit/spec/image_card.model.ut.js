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
                "embedCode": "<div>embed code</div>"
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
                    small: experience.data.collateral.splash,
                    large: experience.data.collateral.splash
                });
            });
        });

        describe('embedCode', function() {
            it('should be copied from the passed-in value', function() {
                expect(imageCard.embedCode).toBe('<div>embed code</div>');
            });
        });

    });

    describe('methods:', function() {
        describe('complete()', function() {
            let canAdvance;

            beforeEach(function() {
                canAdvance = jasmine.createSpy('canAdvance()');
                imageCard.on('canAdvance', canAdvance);
                spyOn(Card.prototype, 'complete');

                imageCard.complete();
            });

            it('should call super()', function() {
                expect(Card.prototype.complete).toHaveBeenCalled();
            });

            it('should emit "canAdvance"', function() {
                expect(canAdvance).toHaveBeenCalled();
            });
        });
    });
});
