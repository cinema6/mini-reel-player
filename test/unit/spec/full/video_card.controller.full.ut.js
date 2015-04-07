import FullVideoCardController from '../../../../src/controllers/full/FullVideoCardController.js';
import VideoCardController from '../../../../src/controllers/VideoCardController.js';
import FullVideoCardView from '../../../../src/views/full/FullVideoCardView.js';
import {EventEmitter} from 'events';
import View from '../../../../lib/core/View.js';
import SkipTimerView from '../../../../src/views/SkipTimerView.js';

describe('FullVideoCardController', function() {
    let FullVideoCardCtrl;
    let parentView;
    let card;

    beforeEach(function() {
        parentView = new View();
        card = new EventEmitter();
        card.data = {
            type: 'youtube'
        };
        card.thumbs = { large: 'large.jpg' };
        card.modules = {};
        spyOn(FullVideoCardController.prototype, 'addView').and.callThrough();

        FullVideoCardCtrl = new FullVideoCardController(card, parentView);
    });

    it('should exist', function() {
        expect(FullVideoCardCtrl).toEqual(jasmine.any(VideoCardController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a FullVideoCardView', function() {
                expect(FullVideoCardCtrl.view).toEqual(jasmine.any(FullVideoCardView));
                expect(FullVideoCardCtrl.addView).toHaveBeenCalledWith(FullVideoCardCtrl.view);
            });
        });
    });

    describe('events:', function() {
        describe('model', function() {
            describe('becameUnskippable', function() {
                beforeEach(function() {
                    FullVideoCardCtrl.view.skipTimer = new SkipTimerView();
                    spyOn(FullVideoCardCtrl.view.skipTimer, 'show');

                    FullVideoCardCtrl.model.emit('becameUnskippable');
                });

                it('should show the skip timer', function() {
                    expect(FullVideoCardCtrl.view.skipTimer.show).toHaveBeenCalled();
                });
            });

            describe('becameSkippable', function() {
                beforeEach(function() {
                    FullVideoCardCtrl.view.skipTimer = new SkipTimerView();
                    spyOn(FullVideoCardCtrl.view.skipTimer, 'hide');

                    FullVideoCardCtrl.model.emit('becameSkippable');
                });

                it('should hide the skip timer', function() {
                    expect(FullVideoCardCtrl.view.skipTimer.hide).toHaveBeenCalled();
                });
            });

            describe('skippableProgress', function() {
                let skipTimer;
                let model;

                beforeEach(function() {
                    skipTimer = FullVideoCardCtrl.view.skipTimer = new SkipTimerView();
                    model = FullVideoCardCtrl.model;

                    spyOn(FullVideoCardCtrl.view.skipTimer, 'update');
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
