import FullPrerollCardView from '../../../../src/views/full/FullPrerollCardView.js';
import CardView from '../../../../src/views/CardView.js';
import Runner from '../../../../lib/Runner.js';
import PlayerOutletView from '../../../../src/views/PlayerOutletView.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';
import View from '../../../../lib/core/View.js';

describe('FullPrerollCardView', function() {
    let view;

    beforeEach(function() {
        view = new FullPrerollCardView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(CardView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of FullPrerollCardView.html', function() {
                expect(view.template).toBe(require('../../../../src/views/full/FullPrerollCardView.html'));
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

            describe('skipTimer', function() {
                it('should be a SkipTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipTimerView));
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
