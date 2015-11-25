import DisplayAdController from '../../../src/controllers/DisplayAdController.js';
import ModuleController from '../../../src/controllers/ModuleController.js';
import DisplayAd from '../../../src/models/DisplayAd.js';
import DisplayAdView from '../../../src/views/DisplayAdView.js';
import adtech from '../../../src/services/adtech.js';

describe('DisplayAdController', function() {
    let DisplayAdCtrl;
    let displayAd;

    let card;
    let experience;

    beforeEach(function() {
        card = { placementId: '83974395' };
        experience = { data: {} };

        displayAd = new DisplayAd(card, experience);

        DisplayAdCtrl = new DisplayAdController(displayAd);
    });

    it('should exist', function() {
        expect(DisplayAdCtrl).toEqual(jasmine.any(ModuleController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a DisplayAdView', function() {
                expect(DisplayAdCtrl.view).toEqual(jasmine.any(DisplayAdView));
            });
        });
    });

    describe('methods:', function() {
        describe('activate()', function() {
            beforeEach(function() {
                spyOn(ModuleController.prototype, 'activate').and.callThrough();
                spyOn(adtech, 'load');
                spyOn(DisplayAdCtrl.view, 'create').and.callThrough();

                DisplayAdCtrl.activate();
            });

            it('should call super()', function() {
                expect(ModuleController.prototype.activate).toHaveBeenCalledWith();
            });

            it('should create its view', function() {
                expect(DisplayAdCtrl.view.create).toHaveBeenCalled();
            });

            it('should load a displayAd', function() {
                expect(adtech.load).toHaveBeenCalledWith({
                    placement: displayAd.placement,
                    adContainerId: DisplayAdCtrl.view.adContainer.id
                });
            });

            describe('if called again', function() {
                beforeEach(function() {
                    DisplayAdCtrl.view.create.calls.reset();
                    adtech.load.calls.reset();

                    DisplayAdCtrl.activate();
                });

                it('should not create its view again', function() {
                    expect(DisplayAdCtrl.view.create).not.toHaveBeenCalled();
                });

                it('should not load an ad again', function() {
                    expect(adtech.load).not.toHaveBeenCalled();
                });
            });
        });
    });
});
