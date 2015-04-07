import SkipTimerVideoCardController from '../../../src/mixins/SkipTimerVideoCardController.js';
import VideoCardController from '../../../src/controllers/VideoCardController.js';
import VideoCardView from '../../../src/views/VideoCardView.js';
import SkipTimerView from '../../../src/views/SkipTimerView.js';
import {EventEmitter} from 'events';
class MyVideoCardController extends VideoCardController {}
MyVideoCardController.mixin(SkipTimerVideoCardController);

describe('SkipTimerVideoCardController mixin', function() {
    let Ctrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'youtube'
        };
        card.modules = {};
        card.thumbs = {};

        Ctrl = new MyVideoCardController(card);
        Ctrl.view = new VideoCardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('methods:', function() {
        describe('initSkipTimer()', function() {
            beforeEach(function() {
                Ctrl.initSkipTimer();
            });

            describe('events:', function() {
                describe('model', function() {
                    describe('becameUnskippable', function() {
                        beforeEach(function() {
                            Ctrl.view.skipTimer = new SkipTimerView();
                            spyOn(Ctrl.view.skipTimer, 'show');

                            card.emit('becameUnskippable');
                        });

                        it('should show the skip timer', function() {
                            expect(Ctrl.view.skipTimer.show).toHaveBeenCalled();
                        });
                    });

                    describe('becameSkippable', function() {
                        beforeEach(function() {
                            Ctrl.view.skipTimer = new SkipTimerView();
                            spyOn(Ctrl.view.skipTimer, 'hide');

                            card.emit('becameSkippable');
                        });

                        it('should hide the skip timer', function() {
                            expect(Ctrl.view.skipTimer.hide).toHaveBeenCalled();
                        });
                    });

                    describe('skippableProgress', function() {
                        let skipTimer;
                        let model;

                        beforeEach(function() {
                            skipTimer = Ctrl.view.skipTimer = new SkipTimerView();
                            model = card;

                            spyOn(Ctrl.view.skipTimer, 'update');
                        });

                        it('should update the skipTimer with the remaining time', function() {
                            model.emit('skippableProgress', 5);
                            expect(skipTimer.update).toHaveBeenCalledWith(5);
                            skipTimer.update.calls.reset();

                            model.emit('skippableProgress', 3);
                            expect(skipTimer.update).toHaveBeenCalledWith(3);
                        });
                    });
                });
            });
        });
    });
});
