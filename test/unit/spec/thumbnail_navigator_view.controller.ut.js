import ThumbnailNavigatorViewController from '../../../src/controllers/ThumbnailNavigatorViewController.js';
import ViewController from '../../../src/controllers/ViewController.js';
import MiniReel from '../../../src/models/MiniReel.js';
import ThumbnailNavigatorView from '../../../src/views/ThumbnailNavigatorView.js';
import Runner from '../../../lib/Runner.js';
import ThumbnailNavigatorButtonView from '../../../src/views/ThumbnailNavigatorButtonView.js';

describe('ThumbnailNavigatorViewController', function() {
    let ThumbnailNavigatorViewCtrl;
    let minireel;

    beforeEach(function() {
        spyOn(ThumbnailNavigatorViewController.prototype, 'addView').and.callThrough();
        minireel = new MiniReel();

        ThumbnailNavigatorViewCtrl = new ThumbnailNavigatorViewController(minireel);
    });

    it('should exist', function() {
        expect(ThumbnailNavigatorViewCtrl).toEqual(jasmine.any(ViewController));
    });

    describe('properties:', function() {
        describe('view', function() {
            it('should be a ThumbnailNavigatorView', function() {
                expect(ThumbnailNavigatorViewCtrl.view).toEqual(jasmine.any(ThumbnailNavigatorView));
                expect(ThumbnailNavigatorViewCtrl.addView).toHaveBeenCalledWith(ThumbnailNavigatorViewCtrl.view);
            });
        });

        describe('model', function() {
            it('should be the minireel', function() {
                expect(ThumbnailNavigatorViewCtrl.model).toBe(minireel);
            });

            describe('events:', function() {
                describe('init', function() {
                    beforeEach(function() {
                        spyOn(ThumbnailNavigatorViewCtrl, 'updateView');

                        minireel.emit('init');
                    });

                    it('should call updateView()', function() {
                        expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
                    });
                });

                describe('move', function() {
                    beforeEach(function() {
                        spyOn(ThumbnailNavigatorViewCtrl, 'updateView');

                        minireel.emit('move');
                    });

                    it('should call updateView()', function() {
                        expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
                    });
                });

                describe('becameSkippable', function() {
                    beforeEach(function() {
                        spyOn(ThumbnailNavigatorViewCtrl, 'enable');

                        minireel.emit('becameSkippable');
                    });

                    it('should enable itself', function() {
                        expect(ThumbnailNavigatorViewCtrl.enable).toHaveBeenCalled();
                    });
                });

                describe('becameUnskippable', function() {
                    beforeEach(function() {
                        spyOn(ThumbnailNavigatorViewCtrl, 'disable');

                        minireel.emit('becameUnskippable');
                    });

                    it('should disable itself', function() {
                        expect(ThumbnailNavigatorViewCtrl.disable).toHaveBeenCalled();
                    });
                });

                describe('skippableProgress', function() {
                    beforeEach(function() {
                        Runner.run(() => ThumbnailNavigatorViewCtrl.view.create());
                        spyOn(ThumbnailNavigatorViewCtrl.view.skipTimer, 'update');
                    });

                    it('should update the skip timer', function() {
                        ThumbnailNavigatorViewCtrl.model.emit('skippableProgress', 4);
                        expect(ThumbnailNavigatorViewCtrl.view.skipTimer.update).toHaveBeenCalledWith(4);
                        ThumbnailNavigatorViewCtrl.view.skipTimer.update.calls.reset();

                        ThumbnailNavigatorViewCtrl.model.emit('skippableProgress', 10);
                        expect(ThumbnailNavigatorViewCtrl.view.skipTimer.update).toHaveBeenCalledWith(10);
                    });
                });
            });
        });

        describe('enabled', function() {
            it('should be true', function() {
                expect(ThumbnailNavigatorViewCtrl.enabled).toBe(true);
            });
        });

        describe('expanded', function() {
            it('should be false', function() {
                expect(ThumbnailNavigatorViewCtrl.expanded).toBe(false);
            });
        });

        describe('thumbsShown', function() {
            it('should be true', function() {
                expect(ThumbnailNavigatorViewCtrl.thumbsShown).toBe(true);
            });
        });
    });

    describe('methods:', function() {
        describe('previous()', function() {
            beforeEach(function() {
                spyOn(minireel, 'previous');

                ThumbnailNavigatorViewCtrl.previous();
            });

            it('should go back', function() {
                expect(minireel.previous).toHaveBeenCalled();
            });
        });

        describe('next()', function() {
            beforeEach(function() {
                spyOn(minireel, 'next');

                ThumbnailNavigatorViewCtrl.next();
            });

            it('should go forward', function() {
                expect(minireel.next).toHaveBeenCalled();
            });
        });

        describe('jump(button)', function() {
            let button;

            beforeEach(function() {
                minireel.deck = [
                    { id: 'rc-d82a07afa900dd' },
                    { id: 'rc-45595d54d6e671' },
                    { id: 'rc-23176d28097a94' }
                ];
                spyOn(minireel, 'moveTo');

                button = new ThumbnailNavigatorButtonView();
                button.itemId = minireel.deck[1].id;

                ThumbnailNavigatorViewCtrl.jump(button);
            });

            it('should move the minireel to the card with the provided id', function() {
                expect(minireel.moveTo).toHaveBeenCalledWith(minireel.deck[1]);
            });
        });

        describe('expand()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.expanded = false;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');
                spyOn(ThumbnailNavigatorViewCtrl.view, 'resize');

                Runner.run(() => ThumbnailNavigatorViewCtrl.expand());
            });

            it('should set expanded to true', function() {
                expect(ThumbnailNavigatorViewCtrl.expanded).toBe(true);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            it('should resize() the view', function() {
                expect(ThumbnailNavigatorViewCtrl.view.resize).toHaveBeenCalled();
            });

            describe('if it is already expanded', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();
                    ThumbnailNavigatorViewCtrl.view.resize.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.expand());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                    expect(ThumbnailNavigatorViewCtrl.view.resize).not.toHaveBeenCalled();
                });
            });
        });

        describe('contract()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.expanded = true;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');
                spyOn(ThumbnailNavigatorViewCtrl.view, 'resize');

                Runner.run(() => ThumbnailNavigatorViewCtrl.contract());
            });

            it('should set expanded to false', function() {
                expect(ThumbnailNavigatorViewCtrl.expanded).toBe(false);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            it('should resize() the view', function() {
                expect(ThumbnailNavigatorViewCtrl.view.resize).toHaveBeenCalled();
            });

            describe('if it is already contracted', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();
                    ThumbnailNavigatorViewCtrl.view.resize.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.contract());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                    expect(ThumbnailNavigatorViewCtrl.view.resize).not.toHaveBeenCalled();
                });
            });
        });

        describe('enable()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.enabled = false;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');

                ThumbnailNavigatorViewCtrl.enable();
            });

            it('should set enabled to true', function() {
                expect(ThumbnailNavigatorViewCtrl.enabled).toBe(true);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            describe('if it is already enabled', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.enable());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                });
            });
        });

        describe('disable()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.enabled = true;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');

                ThumbnailNavigatorViewCtrl.disable();
            });

            it('should set enabled to false', function() {
                expect(ThumbnailNavigatorViewCtrl.enabled).toBe(false);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            describe('if it is already disabled', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.disable());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                });
            });
        });

        describe('showThumbs()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.thumbsShown = false;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');
                spyOn(ThumbnailNavigatorViewCtrl.view, 'resize');

                Runner.run(() => ThumbnailNavigatorViewCtrl.showThumbs());
            });

            it('should set thumbsShown to true', function() {
                expect(ThumbnailNavigatorViewCtrl.thumbsShown).toBe(true);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            it('should resize() the view', function() {
                expect(ThumbnailNavigatorViewCtrl.view.resize).toHaveBeenCalled();
            });

            describe('if the thumbs are already shown', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();
                    ThumbnailNavigatorViewCtrl.view.resize.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.showThumbs());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                    expect(ThumbnailNavigatorViewCtrl.view.resize).not.toHaveBeenCalled();
                });
            });
        });

        describe('hideThumbs()', function() {
            beforeEach(function() {
                ThumbnailNavigatorViewCtrl.thumbsShown = true;
                spyOn(ThumbnailNavigatorViewCtrl, 'updateView');
                spyOn(ThumbnailNavigatorViewCtrl.view, 'resize');

                Runner.run(() => ThumbnailNavigatorViewCtrl.hideThumbs());
            });

            it('should set thumbsShown to false', function() {
                expect(ThumbnailNavigatorViewCtrl.thumbsShown).toBe(false);
            });

            it('should update the view', function() {
                expect(ThumbnailNavigatorViewCtrl.updateView).toHaveBeenCalled();
            });

            it('should resize() the view', function() {
                expect(ThumbnailNavigatorViewCtrl.view.resize).toHaveBeenCalled();
            });

            describe('if the thumbs are already hidden', function() {
                beforeEach(function() {
                    ThumbnailNavigatorViewCtrl.updateView.calls.reset();
                    ThumbnailNavigatorViewCtrl.view.resize.calls.reset();

                    Runner.run(() => ThumbnailNavigatorViewCtrl.hideThumbs());
                });

                it('should do nothing', function() {
                    expect(ThumbnailNavigatorViewCtrl.updateView).not.toHaveBeenCalled();
                    expect(ThumbnailNavigatorViewCtrl.view.resize).not.toHaveBeenCalled();
                });
            });
        });

        describe('updateView()', function() {
            let view;

            beforeEach(function() {
                view = ThumbnailNavigatorViewCtrl.view;

                spyOn(view, 'update');

                minireel.currentIndex = 1;
                minireel.deck = [
                    { id: 'rc-b3515d85dbc2ff', title: 'How to Make Apple Pie', ad: false, thumbs: { small: 'thumb3.jpg' } },
                    { id: 'rc-7ff71ed5aa309e', title: 'How to Make Pumpkin Pie', ad: true, thumbs: { small: 'thumbs1.png' } },
                    { id: 'rc-fcfe1c22672c09', title: 'How to Make Blueberry Pie', ad: false, thumbs: { small: 'thumbs6.gif' } }
                ];
                minireel.currentCard = minireel.deck[1];
                minireel.length = minireel.deck.length;

                ThumbnailNavigatorViewCtrl.updateView();
            });

            it('should update the view with data', function() {
                expect(view.update).toHaveBeenCalledWith({
                    enabled: jasmine.any(Boolean),
                    expanded: jasmine.any(Boolean),
                    thumbsShown: jasmine.any(Boolean),
                    enableNext: jasmine.any(Boolean),
                    enablePrevious: jasmine.any(Boolean),
                    items: minireel.deck.map((card, index) => ({
                        id: card.id,
                        title: `Video ${index + 1} : ${card.title}`,
                        thumb: card.thumbs.small,
                        ad: card.ad,
                        active: card === minireel.currentCard
                    }))
                });
            });

            describe('enablePrevious', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                });

                describe('if standalone is true', function() {
                    beforeEach(function() {
                        minireel.standalone = true;
                    });

                    describe('if the currentIndex is null', function() {
                        beforeEach(function() {
                            minireel.currentIndex = null;

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: true }));
                        });
                    });

                    describe('if on the first card', function() {
                        beforeEach(function() {
                            minireel.currentIndex = 0;
                            minireel.currentCard = minireel.deck[0];

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be false', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: false }));
                        });
                    });

                    describe('if on a card that is not the first', function() {
                        beforeEach(function() {
                            minireel.currentIndex = 1;
                            minireel.currentCard = minireel.deck[1];

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: true }));
                        });
                    });
                });

                describe('if standalone is false', function() {
                    beforeEach(function() {
                        minireel.standalone = false;
                    });

                    describe('if the currentIndex is null', function() {
                        beforeEach(function() {
                            minireel.currentIndex = null;

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: true }));
                        });
                    });

                    describe('if on the first card', function() {
                        beforeEach(function() {
                            minireel.currentIndex = 0;
                            minireel.currentCard = minireel.deck[0];

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: true }));
                        });
                    });

                    describe('if on a card that is not the first', function() {
                        beforeEach(function() {
                            minireel.currentIndex = 1;
                            minireel.currentCard = minireel.deck[1];

                            ThumbnailNavigatorViewCtrl.updateView();
                        });

                        it('should be true', function() {
                            expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enablePrevious: true }));
                        });
                    });
                });
            });

            describe('enableNext', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                });

                describe('if not on the last card', function() {
                    beforeEach(function() {
                        minireel.currentIndex = minireel.deck.length - 2;
                        minireel.currentCard = minireel.deck[minireel.currentIndex];

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enableNext: true }));
                    });
                });

                describe('if on the last card', function() {
                    beforeEach(function() {
                        minireel.currentIndex = minireel.deck.length - 1;
                        minireel.currentCard = minireel.deck[minireel.currentIndex];

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enableNext: false }));
                    });
                });
            });

            describe('enabled', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                });

                describe('if the enabled property is false', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.enabled = false;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enabled: false }));
                    });
                });

                describe('if the enabled property is true', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.enabled = true;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ enabled: true }));
                    });
                });
            });

            describe('expanded', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                });

                describe('if the expanded property is false', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.expanded = false;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ expanded: false }));
                    });
                });

                describe('if the expanded property is true', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.expanded = true;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ expanded: true }));
                    });
                });
            });

            describe('thumbsShown', function() {
                beforeEach(function() {
                    view.update.calls.reset();
                });

                describe('if the thumbsShown property is false', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.thumbsShown = false;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be false', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ thumbsShown: false }));
                    });
                });

                describe('if the thumbsShown property is true', function() {
                    beforeEach(function() {
                        ThumbnailNavigatorViewCtrl.thumbsShown = true;

                        ThumbnailNavigatorViewCtrl.updateView();
                    });

                    it('should be true', function() {
                        expect(view.update).toHaveBeenCalledWith(jasmine.objectContaining({ thumbsShown: true }));
                    });
                });
            });
        });
    });
});
