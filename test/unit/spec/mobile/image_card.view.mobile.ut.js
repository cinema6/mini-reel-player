import MobileImageCardView from '../../../../src/views/mobile/MobileImageCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import View from '../../../../lib/core/View.js';
import LinksListView from '../../../../src/views/LinksListView.js';
import HideableView from '../../../../src/views/HideableView.js';
import ButtonView from '../../../../src/views/ButtonView.js';

describe('MobileImageCardView', function() {
    let mobileImageCardView;

    beforeEach(function() {
        mobileImageCardView = new MobileImageCardView();
    });

    it('should be a CardView', function() {
        expect(mobileImageCardView).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be a MobileImageCardView.html', function() {
                expect(mobileImageCardView.template).toBe(require('../../../../src/views/mobile/MobileImageCardView.html'));
            });
        });

        describe('playerOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileImageCardView.create());
            });

            it('should be a PlayerOutletView', function() {
                expect(mobileImageCardView.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
            });
        });

        describe('displayAdOutlet', function() {
            beforeEach(function() {
                Runner.run(() => mobileImageCardView.create());
            });

            it('should be a view', function() {
                expect(mobileImageCardView.displayAdOutlet).toEqual(jasmine.any(View));
            });
        });

        describe('links', function() {
            beforeEach(function() {
                Runner.run(() => mobileImageCardView.create());
            });

            it('should be a LinksListView', function() {
                expect(mobileImageCardView.links).toEqual(jasmine.any(LinksListView));
            });
        });

        describe('replayContainer', function() {
            beforeEach(function() {
                spyOn(HideableView.prototype, 'hide');
                Runner.run(() => mobileImageCardView.create());
            });

            it('should be a HideableView', function() {
                expect(mobileImageCardView.replayContainer).toEqual(jasmine.any(HideableView));
            });

            it('should be hidden', function() {
                expect(mobileImageCardView.replayContainer.hide).toHaveBeenCalled();
            });
        });

        describe('replayButton', function() {
            beforeEach(function() {
                Runner.run(() => mobileImageCardView.create());
            });

            it('should be a ButtonView', function() {
                expect(mobileImageCardView.replayButton).toEqual(jasmine.any(ButtonView));
            });
        });
    });
});
