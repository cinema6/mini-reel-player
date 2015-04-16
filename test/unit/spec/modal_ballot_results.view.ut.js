import ModalBallotResultsView from '../../../src/views/ModalBallotResultsView.js';
import BallotResultsView from '../../../src/views/BallotResultsView.js';
import Runner from '../../../lib/Runner.js';
import ButtonView from '../../../src/views/ButtonView.js';

describe('ModalBallotResultsView', function() {
    let view;

    beforeEach(function() {
        view = new ModalBallotResultsView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(BallotResultsView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of ModalBallotResultsView.html', function() {
                expect(view.template).toBe(require('../../../src/views/ModalBallotResultsView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual BallotResultsView classes + ["ballot__group", "results-module", "playerHeight"]', function() {
                expect(view.classes).toEqual(new BallotResultsView().classes.concat(['ballot__group', 'results-module', 'playerHeight', 'player__height']));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('watchAgainButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.watchAgainButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });
        });
    });
});
