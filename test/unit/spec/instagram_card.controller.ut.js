import InstagramCardController from '../../../src/controllers/InstagramCardController.js';
import CardController from '../../../src/controllers/CardController.js';
import FullInstagramImageCardView from '../../../src/views/full/FullInstagramImageCardView.js';
import InstagramImageCard from '../../../src/models/InstagramImageCard.js';

describe('InstagramCardController', function() {
    let InstagramCardCtrl;
    let card;

    beforeEach(function() {
        card = new InstagramImageCard({
            data: {

            }
        }, {
            data: {
                collateral: {}
            }
        });

        InstagramCardCtrl = new InstagramCardController(card);
        InstagramCardCtrl.model = card;
        InstagramCardCtrl.view = new FullInstagramImageCardView();
    });

    it('should exist', function() {
        expect(InstagramCardCtrl).toEqual(jasmine.any(CardController));
    });

    describe('properties', function() {
        describe('isRendered', function() {
            it('should be initialized to false', function() {
                expect(InstagramCardCtrl.isRendered).toBe(false);
            });
        });
    });

    describe('events', function() {
        describe('model', function() {
            beforeEach(function() {
                spyOn(InstagramCardCtrl, 'renderImage');
            });

            describe('prepare', function() {
                it('should call renderImage if not already rendered', function() {
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    InstagramCardCtrl.isRendered = true;
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });

            describe('activate', function() {
                it('should call renderImage if not already rendered', function() {
                    card.activate();
                    expect(InstagramCardCtrl.renderImage).toHaveBeenCalled();
                });

                it('should not call renderImage if already rendered', function() {
                    InstagramCardCtrl.isRendered = true;
                    card.prepare();
                    expect(InstagramCardCtrl.renderImage).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods', function() {

        describe('renderImage', function() {

            beforeEach(function() {
                spyOn(InstagramCardCtrl.view, 'update');
                InstagramCardCtrl.renderImage();
            });

            it('should set the isRendered property to true', function() {
                expect(InstagramCardCtrl.isRendered).toBe(true);
            });

            it('should update the source on the template', function() {
                var expectedOutput = {
                };
                expect(InstagramCardCtrl.view.update).toHaveBeenCalledWith(expectedOutput);
            });
        });
    });

});
