import ModalShareController from '../../../src/mixins/ModalShareController.js';
import { EventEmitter } from 'events';
import ViewController from '../../../src/controllers/ViewController.js';
import Runner from '../../../lib/Runner.js';
import CardController from '../../../src/controllers/CardController.js';
import CardView from '../../../src/views/CardView.js';
import ModalShareView from '../../../src/views/ModalShareView.js';

describe('ModalShareController mixin', function() {
    let Ctrl, card, showSpy, hideSpy, pauseSpy, itemSpy, renderSpy, appendSpy;

    class MyCardController extends CardController {}
    MyCardController.prototype.render = renderSpy = jasmine.createSpy('Ctrl.render()');
    MyCardController.mixin(ModalShareController);

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

            describe('ShareCtrl', function() {
                it('should initially be null', function() {
                    expect(Ctrl.__private__.ShareCtrl).toBeNull();
                });
            });
        });
    });

    describe('methods:', function() {
        describe('private', function() {
            describe('updateView', function() {
                beforeEach(function() {
                    Ctrl.__private__.ShareCtrl = new ViewController();
                });

                describe('when ShareCtrl does not exist', function() {
                    it('should do nothing', function() {
                        expect(showSpy).not.toHaveBeenCalled();
                        expect(hideSpy).not.toHaveBeenCalled();
                    });
                });

                describe('when ShareCtrl exists', function() {
                    describe('when the modal is shown', function() {
                        beforeEach(function() {
                            Ctrl.__private__.shown = true;
                            Ctrl.initShare();
                            spyOn(Ctrl.__private__.ShareCtrl.view, 'show');
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
                            expect(Ctrl.__private__.ShareCtrl.view.show).toHaveBeenCalled();
                        });
                    });

                    describe('when the modal is not shown', function() {
                        beforeEach(function() {
                            Ctrl.__private__.shown = false;
                            Ctrl.initShare();
                            spyOn(Ctrl.__private__.ShareCtrl.view, 'hide');
                        });

                        it('should hide the share controller', function() {
                            Ctrl.__private__.updateView();
                            expect(Ctrl.__private__.ShareCtrl.view.hide).toHaveBeenCalled();
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
                    });
                });
            });
        });

        describe('public', function() {
            describe('initShare', function() {
                beforeEach(function() {
                    Ctrl.initShare();
                });

                it('should initialize the share controller', function() {
                    expect(Ctrl.__private__.ShareCtrl).not.toBeNull();
                    expect(Ctrl.__private__.ShareCtrl).toEqual(jasmine.any(ViewController));
                });

                it('should give the share controller a ModalShareView', function() {
                    expect(Ctrl.__private__.ShareCtrl.view).toEqual(jasmine.any(ModalShareView));
                });

                it('should give the share controller a close method', function() {
                    expect(Ctrl.__private__.ShareCtrl.close).toEqual(jasmine.any(Function));
                    spyOn(Ctrl, 'hideShare');
                    Ctrl.__private__.ShareCtrl.close();
                    expect(Ctrl.hideShare).toHaveBeenCalled();
                });

                it('should give the share controller a shareItemClicked method', function() {
                    expect(Ctrl.__private__.ShareCtrl.shareItemClicked).toEqual(jasmine.any(Function));
                    Ctrl.__private__.ShareCtrl.shareItemClicked('arg1', 'arg2');
                    expect(itemSpy).toHaveBeenCalledWith('arg1', 'arg2');
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

                describe('when the share controller and outlet exist', function() {
                    beforeEach(function() {
                        Ctrl.model.shareLinks = [
                            {
                                type: 'facebook'
                            }
                        ];
                        Ctrl.initShare();
                        spyOn(Ctrl.__private__.ShareCtrl.view, 'update');
                        Runner.run(() => Ctrl.render());
                    });

                    it('should update the view', function() {
                        expect(Ctrl.__private__.ShareCtrl.view.update).toHaveBeenCalledWith({
                            shareLinks: [
                                {
                                    type: 'facebook'
                                }
                            ]
                        });
                    });

                    it('should append the view to the shareOutlet', function() {
                        expect(appendSpy).toHaveBeenCalledWith(Ctrl.__private__.ShareCtrl.view);
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
