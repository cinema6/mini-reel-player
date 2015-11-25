import LightboxPrerollCardView from '../../../../src/views/lightbox/LightboxPrerollCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import View from '../../../../lib/core/View.js';

describe('LightboxPrerollCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightboxPrerollCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightboxPrerollCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/lightbox/LightboxPrerollCardView.html'));
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

            describe('companionOutlet', function() {
                it('should be a View', function() {
                    expect(view.companionOutlet).toEqual(jasmine.any(View));
                });
            });
        });
    });
});
