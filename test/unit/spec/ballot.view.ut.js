import BallotView from '../../../src/views/BallotView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Runner from '../../../lib/Runner.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('BallotView', function() {
    let view;

    beforeEach(function() {
        view = new BallotView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should be Hideable', function() {
        expect(BallotView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "ballot__group" and "player__height"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['ballot__group', 'player__height', 'playerHeight']));
            });
        });

        describe('template', function() {
            it('should be the contents of BallotView.html', function() {
                expect(view.template).toBe(require('../../../src/views/BallotView.html'));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('choice1Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice1Button).toEqual(jasmine.any(ButtonView));
                });

                describe('properties:', function() {
                    describe('.attributes', function() {
                        describe('.data-vote', function() {
                            it('should be 0', function() {
                                expect(view.choice1Button.attributes['data-vote']).toBe('0');
                            });
                        });
                    });
                });
            });

            describe('choice2Button', function() {
                it('should be a ButtonView', function() {
                    expect(view.choice2Button).toEqual(jasmine.any(ButtonView));
                });

                describe('properties:', function() {
                    describe('.attributes', function() {
                        describe('.data-vote', function() {
                            it('should be 1', function() {
                                expect(view.choice2Button.attributes['data-vote']).toBe('1');
                            });
                        });
                    });
                });
            });

            describe('watchAgainButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.watchAgainButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('showResultsButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.showResultsButton).toEqual(jasmine.any(ButtonView));
                });

                describe('properties:', function() {
                    describe('.attributes', function() {
                        describe('.data-vote', function() {
                            it('should be -1', function() {
                                expect(view.showResultsButton.attributes['data-vote']).toBe('-1');
                            });
                        });
                    });
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
