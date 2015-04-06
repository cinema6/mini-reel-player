import PostBallotView from '../../../src/views/PostBallotView.js';
import PostView from '../../../src/views/PostView.js';
import ButtonView from '../../../src/views/ButtonView.js';

describe('PostBallotView', function() {
    let view;

    beforeEach(function() {
        view = new PostBallotView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(PostView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of PostBallotView.html', function() {
                expect(view.template).toBe(require('../../../src/views/PostBallotView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                view.create();
            });

            describe('replayButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.replayButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('choice1Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice1Button).toEqual(jasmine.any(ButtonView));
                    expect(view.choice1Button.id).toBe('post-module-vote1');
                });
            });

            describe('choice2Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice2Button).toEqual(jasmine.any(ButtonView));
                    expect(view.choice2Button.id).toBe('post-module-vote2');
                });
            });
        });
    });
});
