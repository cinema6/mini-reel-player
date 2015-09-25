import ModalShareVideoCardController from '../../../src/mixins/ModalShareVideoCardController.js';
import { EventEmitter } from 'events';
import Runner from '../../../lib/Runner.js';
import CardController from '../../../src/controllers/CardController.js';
import CardView from '../../../src/views/CardView.js';
import ModalShareView from '../../../src/views/ModalShareView.js';

describe('ModalShareVideoCardController mixin', function() {
    let Ctrl, card, showSpy, hideSpy, pauseSpy, itemSpy, renderSpy, appendSpy;

    class MyCardController extends CardController {}
    MyCardController.prototype.render = renderSpy = jasmine.createSpy('Ctrl.render()');
    MyCardController.mixin(ModalShareVideoCardController);

    beforeEach(function() {
        card = new EventEmitter();
        card.modules = {};
        card.data = { type: 'youtube' };
        card.thumbs = {};
        card.getSrc = jasmine.createSpy('card.getSrc()');
        card.complete = jasmine.createSpy('card.complete()');
        card.setPlaybackState = jasmine.createSpy('card.setPlaybackState()');

        Ctrl = new MyCardController(card);
        Ctrl.view = new CardView();

        showSpy = jasmine.createSpy('show');
        hideSpy = jasmine.createSpy('hide');
        pauseSpy = jasmine.createSpy('pause');
        itemSpy = jasmine.createSpy('shareItemClicked');
        appendSpy = jasmine.createSpy('append');

        Ctrl.view.playerOutlet = {
            show: showSpy,
            hide: hideSpy
        };
        Ctrl.view.shareOutlet = {
            append: appendSpy
        };
        Ctrl.player = {
            pause: pauseSpy
        };
        Ctrl.shareItemClicked = itemSpy;
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(CardController));
    });

    describe('properties', function() {
        describe('private', function() {
            describe('shown', function() {
                it('should initially be false', function() {
                    expect(Ctrl.__private__.shown).toBe(false);
                });
            });

            describe('shareView', function() {
                it('should initially be null', function() {
                    expect(Ctrl.__private__.shareView).toBeNull();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('private', function() {
            describe('updateView', function() {
                beforeEach(function() {
                    Ctrl.__private__.shareView = new ModalShareView();
                });

                describe('when shareView does not exist', function() {
                    it('should do nothing', function() {
                        expect(showSpy).not.toHaveBeenCalled();
                        expect(hideSpy).not.toHaveBeenCalled();
                    });
                });

                describe('when shareView exists', function() {
                    describe('when the modal is shown', function() {
                        beforeEach(function() {
                            Ctrl.__private__.shown = true;
                            Ctrl.initShare();
                            spyOn(Ctrl.__private__.shareView, 'show');
                        });

                        it('should pause the player', function() {
                            Ctrl.__private__.updateView();
                            expect(pauseSpy).toHaveBeenCalled();
                        });

                        it('should hide the player if it exists', function() {
                            Ctrl.__private__.updateView();
                            expect(hideSpy).toHaveBeenCalled();
                        });

                        it('should not hide the player if it does not exist', function() {
                            Ctrl.view.playerOutlet = null;
                            Ctrl.__private__.updateView();
                            expect(hideSpy).not.toHaveBeenCalled();
                        });

                        it('should show the share controller', function() {
                            Ctrl.__private__.updateView();
                            expect(Ctrl.__private__.shareView.show).toHaveBeenCalled();
                        });

                        it('should emit openedModal', function() {
                            spyOn(Ctrl.model, 'emit');
                            Ctrl.__private__.updateView();
                            expect(Ctrl.model.emit).toHaveBeenCalledWith('openedModal');
                        });
                    });

                    describe('when the modal is not shown', function() {
                        beforeEach(function() {
                            Ctrl.__private__.shown = false;
                            Ctrl.initShare();
                            spyOn(Ctrl.__private__.shareView, 'hide');
                        });

                        it('should hide the share controller', function() {
                            Ctrl.__private__.updateView();
                            expect(Ctrl.__private__.shareView.hide).toHaveBeenCalled();
                        });

                        it('should show the player if it exists', function() {
                            Ctrl.__private__.updateView();
                            expect(showSpy).toHaveBeenCalled();
                        });

                        it('should not show the player if it does not exist', function() {
                            Ctrl.view.playerOutlet = null;
                            Ctrl.__private__.updateView();
                            expect(showSpy).not.toHaveBeenCalled();
                        });

                        it('should emit closedModal', function() {
                            spyOn(Ctrl.model, 'emit');
                            Ctrl.__private__.updateView();
                            expect(Ctrl.model.emit).toHaveBeenCalledWith('closedModal');
                        });
                    });
                });
            });
        });

        describe('public', function() {
            describe('initShare', function() {
                beforeEach(function() {
                    Ctrl.initShare();
                });

                it('should initialize the share view', function() {
                    expect(Ctrl.__private__.shareView).not.toBeNull();
                    expect(Ctrl.__private__.shareView).toEqual(jasmine.any(ModalShareView));
                });
            });

            describe('render', function() {
                beforeEach(function() {
                    spyOn(Ctrl.__private__, 'updateView');
                });

                it('should call super', function() {
                    Ctrl.render();
                    expect(renderSpy).toHaveBeenCalled();
                });

                describe('when the share view and outlet exist', function() {
                    beforeEach(function() {
                        Ctrl.model.shareLinks = [
                            {
                                type: 'facebook'
                            }
                        ];
                        Ctrl.initShare();
                        spyOn(Ctrl.__private__.shareView, 'update');
                        Runner.run(() => Ctrl.render());
                    });

                    it('should update the view', function() {
                        expect(Ctrl.__private__.shareView.update).toHaveBeenCalledWith({
                            shareLinks: [
                                {
                                    type: 'facebook'
                                }
                            ]
                        });
                    });

                    it('should append the view to the shareOutlet', function() {
                        expect(appendSpy).toHaveBeenCalledWith(Ctrl.__private__.shareView);
                    });
                });

                it('should update the view', function() {
                    Ctrl.render();
                    expect(Ctrl.__private__.updateView).toHaveBeenCalled();
                });
            });

            describe('showShare', function() {
                beforeEach(function() {
                    spyOn(Ctrl.__private__, 'updateView');
                    Ctrl.showShare();
                });

                it('should set shown to false', function() {
                    expect(Ctrl.__private__.shown).toBe(true);
                });

                it('should update the view', function() {
                    expect(Ctrl.__private__.updateView).toHaveBeenCalled();
                });
            });

            describe('hideShare', function() {
                beforeEach(function() {
                    spyOn(Ctrl.__private__, 'updateView');
                    Ctrl.hideShare();
                });

                it('should set shown to true', function() {
                    expect(Ctrl.__private__.shown).toBe(false);
                });

                it('should update the view', function() {
                    expect(Ctrl.__private__.updateView).toHaveBeenCalled();
                });
            });
        });
    });

    describe('events', function() {
        describe('deactivate', function() {
            beforeEach(function() {
                spyOn(Ctrl, 'hideShare');
                Ctrl.initShare();
                Runner.run(() => Ctrl.model.emit('deactivate'));
            });

            it('should hide the share modal', function() {
                expect(Ctrl.hideShare).toHaveBeenCalled();
            });
        });
    });
});
