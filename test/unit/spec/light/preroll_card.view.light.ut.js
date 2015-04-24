import LightPrerollCardView from '../../../../src/views/light/LightPrerollCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';

describe('LightPrerollCardView', function() {
    let view;

    beforeEach(function() {
        view = new LightPrerollCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of LightPrerollCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/light/LightPrerollCardView.html'));
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
