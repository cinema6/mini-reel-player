import PostView from '../../../src/views/PostView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Hideable from '../../../src/mixins/Hideable.js';

describe('PostView', function() {
    let view;

    beforeEach(function() {
        view = new PostView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    it('should be hideable', function() {
        expect(PostView.mixins).toContain(Hideable);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('classes', function() {
            it('should be the normal TemplateView classes + ["actionsModal__group", "player__height"]', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['actionsModal__group', 'player__height']));
            });
        });

        describe('template', function() {
            it('should be the contents of PostView.html', function() {
                expect(view.template).toBe(require('../../../src/views/PostView.html'));
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

                describe('events:', function() {
                    describe('press', function() {
                        let replay;

                        beforeEach(function() {
                            replay = jasmine.createSpy('replay()');
                            view.on('replay', replay);
                            view.didInsertElement();

                            view.replayButton.emit('press');
                        });

                        it('should emit the "replay" event', function() {
                            expect(replay).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('closeButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.closeButton).toEqual(jasmine.any(ButtonView));
                });

                describe('events:', function() {
                    describe('press', function() {
                        let closeSpy;

                        beforeEach(function() {
                            closeSpy = jasmine.createSpy('close()');
                            view.on('close', closeSpy);
                            view.didInsertElement();

                            view.closeButton.emit('press');
                        });

                        it('should emit the "close" event', function() {
                            expect(closeSpy).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
