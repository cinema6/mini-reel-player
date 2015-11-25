import CompanionPrerollCardController from '../../../src/mixins/CompanionPrerollCardController.js';
import PrerollCardController from '../../../src/controllers/PrerollCardController.js';
import DisplayAdView from '../../../src/views/DisplayAdView.js';
import { EventEmitter } from 'events';
import View from '../../../lib/core/View.js';
import CardView from '../../../src/views/CardView.js';
import Runner from '../../../lib/Runner.js';

describe('CompanionPrerollCardController mixin', function() {
    class MyPrerollCardController extends PrerollCardController {}
    const renderInto = MyPrerollCardController.prototype.renderInto = jasmine.createSpy('MyPrerollCardController.prototype.renderInto()');
    MyPrerollCardController.mixin(CompanionPrerollCardController);

    let Ctrl;
    let card;

    beforeEach(function() {
        card = new EventEmitter();
        card.data = {
            type: 'vast'
        };
        card.getSrc = jasmine.createSpy('card.getSrc()');

        Ctrl = new MyPrerollCardController(card);
        Ctrl.view = new CardView();
    });

    it('should exist', function() {
        expect(Ctrl).toEqual(jasmine.any(PrerollCardController));
    });

    describe('methods:', function() {
        describe('initCompanion()', function() {
            beforeEach(function() {
                Ctrl.initCompanion();
            });

            it('should give the controller a companion', function() {
                expect(Ctrl.companion).toEqual(jasmine.any(DisplayAdView));
            });

            describe('events:', function() {
                describe('player:', function() {
                    describe('companionsReady', function() {
                        let companion;
                        let showingCompanion;

                        beforeEach(function() {
                            showingCompanion = jasmine.createSpy('showingCompanion()');
                            spyOn(Ctrl.player, 'play');

                            companion = {
                                adType: null,
                                fileURI: 'http://www.ads.com/iframe/ad.html'
                            };

                            spyOn(Ctrl.player, 'getCompanions').and.returnValue([companion]);
                            spyOn(Ctrl.companion, 'populateWith');
                            spyOn(Ctrl.companion, 'show');

                            Ctrl.player.emit('companionsReady');
                            Ctrl.companion.populateWith.calls.reset();
                        });

                        it('should show the companion', function() {
                            expect(Ctrl.companion.show).toHaveBeenCalled();
                        });

                        describe('if the card is active', function() {
                            beforeEach(function() {
                                card.active = true;
                                Ctrl.on('showingCompanion', showingCompanion);

                                Ctrl.player.emit('companionsReady');
                            });

                            it('should emit showingCompanion', function() {
                                expect(showingCompanion).toHaveBeenCalled();
                            });
                        });

                        describe('if the card is not active', function() {
                            beforeEach(function() {
                                card.active = false;
                                Ctrl.on('showingCompanion', showingCompanion);

                                Ctrl.player.emit('companionsReady');
                            });

                            it('should not emit showingCompanion', function() {
                                expect(showingCompanion).not.toHaveBeenCalled();
                            });
                        });

                        describe('if the type is "iframe"', function() {
                            beforeEach(function() {
                                companion.adType = 'iframe';

                                Ctrl.player.emit('companionsReady');
                            });

                            it('should populate the companion with an iframe', function() {
                                expect(Ctrl.companion.populateWith).toHaveBeenCalledWith(`<iframe src="${companion.fileURI}" scrolling="no"></iframe>`);
                            });
                        });

                        describe('if the type is "image"', function() {
                            beforeEach(function() {
                                companion.adType = 'image';

                                Ctrl.player.emit('companionsReady');
                            });

                            it('should populate the companion with an image', function() {
                                expect(Ctrl.companion.populateWith).toHaveBeenCalledWith(`<img src="${companion.fileURI}" />`);
                            });
                        });

                        describe('if the type is "html"', function() {
                            beforeEach(function() {
                                companion.adType = 'html';

                                Ctrl.player.emit('companionsReady');
                            });

                            it('should populate the companion with raw HTML', function() {
                                expect(Ctrl.companion.populateWith).toHaveBeenCalledWith(companion.fileURI);
                            });
                        });
                    });
                });

                describe('model:', function() {
                    describe('deactivate', function() {
                        beforeEach(function() {
                            spyOn(Ctrl.companion, 'hide');

                            Runner.run(() => card.emit('deactivate'));
                        });

                        it('should hide the companion', function() {
                            expect(Ctrl.companion.hide).toHaveBeenCalled();
                        });
                    });

                    describe('activate', function() {
                        let showingCompanion;

                        beforeEach(function() {
                            showingCompanion = jasmine.createSpy('showingCompanion()');
                            Ctrl.on('showingCompanion', showingCompanion);

                            spyOn(Ctrl.player, 'play');
                        });

                        describe('if no companion was provided', function() {
                            beforeEach(function() {
                                Runner.run(() => card.emit('activate'));
                            });

                            it('should not emit showingCompanion', function() {
                                expect(showingCompanion).not.toHaveBeenCalled();
                            });
                        });

                        describe('if a companion was provided', function() {
                            beforeEach(function() {
                                spyOn(Ctrl.player, 'getCompanions').and.returnValue([{}]);
                                Runner.run(() => Ctrl.player.emit('companionsReady'));

                                Runner.run(() => card.emit('activate'));
                            });

                            it('should emit showingCompanion', function() {
                                expect(showingCompanion).toHaveBeenCalled();
                            });

                            describe('when the card is activated again', function() {
                                beforeEach(function() {
                                    Runner.run(() => card.emit('deactivate'));
                                    showingCompanion.calls.reset();

                                    Runner.run(() => card.emit('activate'));
                                });

                                it('should not emit showingCompanion', function() {
                                    expect(showingCompanion).not.toHaveBeenCalled();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('renderInto()', function() {
            let view;

            beforeEach(function() {
                view = new View();
                Ctrl.view.companionOutlet = new View();
                Ctrl.initCompanion();
                spyOn(Ctrl.companion, 'appendTo');
                spyOn(Ctrl.companion, 'hide');

                Ctrl.renderInto(view);
            });

            it('should call this.super()', function() {
                expect(renderInto).toHaveBeenCalledWith(view);
            });

            it('should hide the companion', function() {
                expect(Ctrl.companion.hide).toHaveBeenCalled();
            });

            it('should append the companion to its outlet', function() {
                expect(Ctrl.companion.appendTo).toHaveBeenCalledWith(Ctrl.view.companionOutlet);
            });
        });
    });
});
