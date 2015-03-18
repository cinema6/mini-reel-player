import DisplayAd from '../../../src/models/DisplayAd.js';

describe('DisplayAd', function() {
    let displayAd;
    let card;
    let experience;

    beforeEach(function() {
        card = {
            placementId: null
        };

        experience = {
            data: {
                placementId: '6245378'
            }
        };

        displayAd = new DisplayAd(card, experience);
    });

    it('should exist', function() {
        expect(displayAd).toEqual(jasmine.any(Object));
    });

    describe('properties:', function() {
        describe('placement', function() {
            it('should be the minireel\'s placementId as an int', function() {
                expect(displayAd.placement).toBe(parseInt(experience.data.placementId, 10));
            });

            describe('if the card has a placementId', function() {
                beforeEach(function() {
                    card.placementId = '4509564';
                    displayAd = new DisplayAd(card, experience);
                });

                it('should be the card\'s placementId as an int', function() {
                    expect(displayAd.placement).toBe(parseInt(card.placementId, 10));
                });
            });
        });

        describe('isDefault', function() {
            it('should be true', function() {
                expect(displayAd.isDefault).toBe(true);
            });

            describe('if the card has a placementId', function() {
                beforeEach(function() {
                    card.placementId = '4509564';
                    displayAd = new DisplayAd(card, experience);
                });

                it('should be false', function() {
                    expect(displayAd.isDefault).toBe(false);
                });
            });
        });
    });
});
