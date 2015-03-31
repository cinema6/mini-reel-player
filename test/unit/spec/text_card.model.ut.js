import TextCard from '../../../src/models/TextCard.js';
import Card from '../../../src/models/Card.js';

describe('TextCard', function() {
    let textCard;
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
            "data": {},
            "id": "rc-4b3dc304c3573f",
            "type": "text",
            "title": "Check These Out!",
            "note": "This people play the trumpet like you've never heard before.",
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

        textCard = new TextCard(data, experience);
    });

    it('should be a Card', function() {
        expect(textCard).toEqual(jasmine.any(Card));
    });

    describe('properties:', function() {
        describe('type', function() {
            it('should be "text"', function() {
                expect(textCard.type).toBe('text');
            });
        });

        describe('thumbs', function() {
            it('should be copied from the passed-in value', function() {
                expect(textCard.thumbs).toEqual({
                    small: experience.data.collateral.splash,
                    large: experience.data.collateral.splash
                });
            });
        });
    });

    describe('methods:', function() {
        describe('complete()', function() {
            let canAdvance;

            beforeEach(function() {
                canAdvance = jasmine.createSpy('canAdvance()');
                textCard.on('canAdvance', canAdvance);
                spyOn(Card.prototype, 'complete');

                textCard.complete();
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
