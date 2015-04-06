import MobilePlayerController from '../../../../src/controllers/mobile/MobilePlayerController.js';
import PlayerController from '../../../../src/controllers/PlayerController.js';
import cinema6 from '../../../../src/services/cinema6.js';
import ApplicationView from '../../../../src/views/ApplicationView.js';
import Runner from '../../../../lib/Runner.js';
import MobilePlayerView from '../../../../src/views/mobile/MobilePlayerView.js';
import TableOfContentsViewController from '../../../../src/controllers/mobile/TableOfContentsViewController.js';
import Card from '../../../../src/models/Card.js';
import TextCard from '../../../../src/models/TextCard.js';
import VideoCard from '../../../../src/models/VideoCard.js';
import RecapCard from '../../../../src/models/RecapCard.js';
import MobileTextCardController from '../../../../src/controllers/mobile/MobileTextCardController.js';
import MobileVideoCardController from '../../../../src/controllers/mobile/MobileVideoCardController.js';
import MobileRecapCardController from '../../../../src/controllers/mobile/MobileRecapCardController.js';
import View from '../../../../lib/core/View.js';

describe('MobilePlayerController', function() {
    let MobilePlayerCtrl;

    let applicationView;
    let session;
    let experience;

    beforeEach(function() {
        cinema6.constructor();

        experience = {
            data: {
                collateral: {}
            }
        };

        const init = cinema6.init;
        spyOn(cinema6, 'init').and.callFake(function() {
            return (session = init.apply(cinema6, arguments));
        });

        spyOn(MobilePlayerController.prototype, 'addView').and.callThrough();

        spyOn(TableOfContentsViewController.prototype, 'renderInto');

        applicationView = new ApplicationView(document.createElement('body'));

        Runner.run(() => MobilePlayerCtrl = new MobilePlayerController(applicationView));
    });

    it('should be a controller', function() {
        expect(MobilePlayerCtrl).toEqual(jasmine.any(PlayerController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a PlayerView', function() {
                expect(MobilePlayerCtrl.view).toEqual(jasmine.any(MobilePlayerView));
                expect(MobilePlayerCtrl.addView).toHaveBeenCalledWith(MobilePlayerCtrl.view);
            });
        });

        describe('CardControllers', function() {
            it('should be a mapping of CardControllers', function() {
                expect(MobilePlayerCtrl.CardControllers.text).toBe(MobileTextCardController);
                expect(MobilePlayerCtrl.CardControllers.video).toBe(MobileVideoCardController);
                expect(MobilePlayerCtrl.CardControllers.recap).toBe(MobileRecapCardController);
            });
        });

        describe('TableOfContentsViewCtrl', function() {
            it('should be a TableOfContentsViewController', function() {
                expect(MobilePlayerCtrl.TableOfContentsViewCtrl).toEqual(jasmine.any(TableOfContentsViewController));
            });
        });
    });

    describe('events:', function() {
        describe('TableOfContentsViewCtrl', function() {
            describe('show', function() {
                beforeEach(function() {
                    spyOn(MobilePlayerCtrl.view, 'hideChrome');
                    MobilePlayerCtrl.TableOfContentsViewCtrl.emit('show');
                });

                it('should hide the navigation', function() {
                    expect(MobilePlayerCtrl.view.hideChrome).toHaveBeenCalled();
                });
            });

            describe('hide', function() {
                beforeEach(function() {
                    spyOn(MobilePlayerCtrl.view, 'showChrome');
                    MobilePlayerCtrl.TableOfContentsViewCtrl.emit('hide');
                });

                it('should show the navigation', function() {
                    expect(MobilePlayerCtrl.view.showChrome).toHaveBeenCalled();
                });
            });
        });

        describe('minireel', function() {
            describe('init', function() {
                beforeEach(function() {
                    spyOn(MobilePlayerCtrl.view, 'appendTo');
                    spyOn(MobilePlayerCtrl, 'updateView');

                    MobilePlayerCtrl.minireel.deck = [
                        new TextCard({ data: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new RecapCard({}, experience, MobilePlayerCtrl.minireel)
                    ];
                    MobilePlayerCtrl.view.toc = new View();
                    MobilePlayerCtrl.view.cards = new View(document.createElement('span'));

                    Runner.run(() => MobilePlayerCtrl.minireel.emit('init'));
                });

                it('should render the TableOfContentsViewCtrl into the view.toc', function() {
                    expect(MobilePlayerCtrl.TableOfContentsViewCtrl.renderInto).toHaveBeenCalledWith(MobilePlayerCtrl.view.toc);
                });
            });

            describe('launch', function() {
                beforeEach(function() {
                    spyOn(cinema6, 'fullscreen');

                    MobilePlayerCtrl.minireel.deck = [
                        new TextCard({ data: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new VideoCard({ type: 'youtube', collateral: {}, data: {}, params: {} }, experience),
                        new RecapCard({}, experience, MobilePlayerCtrl.minireel)
                    ];

                    Runner.run(() => MobilePlayerCtrl.minireel.emit('init'));

                    MobilePlayerCtrl.cardCtrls.forEach(Ctrl => spyOn(Ctrl, 'render'));
                    Runner.run(() => MobilePlayerCtrl.minireel.emit('launch'));
                });

                it('should enter fullscreen mode', function() {
                    expect(cinema6.fullscreen).toHaveBeenCalledWith(true);
                });
            });

            describe('close', function() {
                beforeEach(function() {
                    spyOn(cinema6, 'fullscreen');
                    MobilePlayerCtrl.minireel.emit('close');
                });

                it('should leave fullscreen mode', function() {
                    expect(cinema6.fullscreen).toHaveBeenCalledWith(false);
                });
            });
        });
    });

    describe('methods', function() {
        describe('toggleToc()', function() {
            beforeEach(function() {
                spyOn(MobilePlayerCtrl.TableOfContentsViewCtrl, 'toggle');

                MobilePlayerCtrl.toggleToc();
            });

            it('should call toggle() on the TableOfContentsViewCtrl', function() {
                expect(MobilePlayerCtrl.TableOfContentsViewCtrl.toggle).toHaveBeenCalled();
            });
        });

        describe('updateView()', function() {
            beforeEach(function() {
                spyOn(MobilePlayerCtrl.view, 'update');
                spyOn(PlayerController.prototype, 'updateView');

                MobilePlayerCtrl.minireel.standalone = false;
                MobilePlayerCtrl.minireel.title = 'My Awesome MiniReel';
                MobilePlayerCtrl.minireel.deck = [
                    new Card({
                        thumbs: {
                            small: 'first-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'second-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'third-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'fourth-thumb.jpg'
                        }
                    }),
                    new Card({
                        thumbs: {
                            small: 'fifth-thumb.jpg'
                        }
                    })
                ];
                MobilePlayerCtrl.minireel.length = 5;
                MobilePlayerCtrl.minireel.currentIndex = 3;

                MobilePlayerCtrl.updateView();
            });

            it('should call super()', function() {
                expect(PlayerController.prototype.updateView).toHaveBeenCalled();
            });

            it('should update its view', function() {
                expect(MobilePlayerCtrl.view.update).toHaveBeenCalledWith({
                    closeable: !MobilePlayerCtrl.minireel.standalone,
                    thumbs: {
                        next: 'fifth-thumb.jpg',
                        previous: 'third-thumb.jpg'
                    }
                });
            });

            describe('if called before the first slide', function() {
                beforeEach(function() {
                    MobilePlayerCtrl.minireel.currentIndex = -1;
                    MobilePlayerCtrl.view.update.calls.reset();

                    MobilePlayerCtrl.updateView();
                });

                it('should make the previous thumb null', function() {
                    expect(MobilePlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        thumbs: {
                            next: 'first-thumb.jpg',
                            previous: null
                        }
                    }));
                });
            });

            describe('if called on the first slide', function() {
                beforeEach(function() {
                    MobilePlayerCtrl.view.update.calls.reset();

                    MobilePlayerCtrl.minireel.currentIndex = 0;
                });

                describe('if the player is not standalone', function() {
                    beforeEach(function() {
                        MobilePlayerCtrl.minireel.standalone = false;

                        MobilePlayerCtrl.updateView();
                    });

                    it('should allow the user to go back', function() {
                        expect(MobilePlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            closeable: true
                        }));
                    });
                });

                describe('if the player is standalone', function() {
                    beforeEach(function() {
                        MobilePlayerCtrl.minireel.standalone = true;

                        MobilePlayerCtrl.updateView();
                    });

                    it('should not allow the user to go back', function() {
                        expect(MobilePlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                            closeable: false
                        }));
                    });
                });
            });

            describe('if called on the last slide', function() {
                beforeEach(function() {
                    MobilePlayerCtrl.minireel.currentIndex = 4;
                    MobilePlayerCtrl.view.update.calls.reset();

                    MobilePlayerCtrl.updateView();
                });

                it('should make the next thumb null', function() {
                    expect(MobilePlayerCtrl.view.update).toHaveBeenCalledWith(jasmine.objectContaining({
                        thumbs: {
                            next: null,
                            previous: 'fourth-thumb.jpg'
                        }
                    }));
                });
            });
        });
    });
});
