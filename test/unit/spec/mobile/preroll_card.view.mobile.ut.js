import MobilePrerollCardView from '../../../../src/views/mobile/MobilePrerollCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';

describe('MobilePrerollCardView', function() {
    let view;

    beforeEach(function() {
        view = new MobilePrerollCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of MobilePrerollCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/mobile/MobilePrerollCardView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('playerOutlet', function() {
                it('should be a PlayerOutletView', function() {
                    expect(view.playerOutlet).toEqual(jasmine.any(PlayerOutletView));
                });
            });
        });
    });
});
