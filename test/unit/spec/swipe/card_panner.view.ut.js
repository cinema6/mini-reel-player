import CardPannerView from '../../../../src/views/swipe/CardPannerView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';
import SwipeableView from '../../../../src/mixins/SwipeableView.js';

describe('CardPannerView', function() {
    let view;

    class ChildView extends View {
        constructor(element, width = 0) {
            super(...arguments);

            this.tag = 'span';
            this.attributes = {
                style: `display: inline-block; width: ${width}px; height:473px;`
            };

            this.width = width;
        }

        setWidth(width) {
            Runner.schedule('render', this, function() {
                this.element.style.width = `${width}px`;
            });
            this.width = width;
        }
    }

    beforeEach(function() {
        view = new CardPannerView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    it('should mixin SwipeableView', function() {
        expect(CardPannerView.mixins).toContain(SwipeableView);
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "ul"', function() {
                expect(view.tag).toBe('ul');
            });
        });

        describe('currentIndex', function() {
            it('should be 0', function() {
                expect(view.currentIndex).toBe(0);
            });
        });

        describe('locked', function() {
            it('should be false', function() {
                expect(view.locked).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('lock(yes)', function() {
            let children;

            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                children = [new ChildView(), new ChildView(), new ChildView(), new ChildView()];
                Runner.run(() => children.forEach(child => view.append(child)));

                Runner.run(() => {
                    children.forEach(function(child, index) {
                        child.setWidth(this[index]);
                    }, [335, 200, 400, 335]);
                    view.refresh();
                });

                view.currentIndex = 2;
            });

            afterEach(function() {
                document.body.removeChild(view.element);
            });

            describe('if called with true', function() {
                beforeEach(function() {
                    view.locked = false;

                    view.lock(true);
                });

                it('should set locked to true', function() {
                    expect(view.locked).toBe(true);
                });

                it('should make the min and max bounds the current snap point', function() {
                    expect(view.bounds.min).toBe(-535);
                    expect(view.bounds.max).toBe(-535);
                });
            });

            describe('if called with false', function() {
                beforeEach(function() {
                    view.locked = true;

                    view.lock(false);
                });

                it('should set locked to false', function() {
                    expect(view.locked).toBe(false);
                });

                it('should reset the min and max bounds', function() {
                    expect(view.bounds.min).toBe(-935);
                    expect(view.bounds.max).toBe(0);
                });
            });
        });

        describe('scrollTo(index)', function() {
            let children;

            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                children = [new ChildView(), new ChildView(), new ChildView(), new ChildView()];
                Runner.run(() => children.forEach(child => view.append(child)));

                Runner.run(() => {
                    children.forEach(function(child, index) {
                        child.setWidth(this[index]);
                    }, [335, 200, 400, 335]);
                    view.refresh();
                });

                spyOn(view, 'addClass').and.callThrough();
                spyOn(view, 'animateOffset');
                spyOn(Runner, 'schedule').and.callThrough();

                Runner.run(() => view.scrollTo(2));
            });

            afterEach(function() {
                document.body.removeChild(view.element);
            });

            it('should translate the element', function() {
                expect(view.animateOffset).toHaveBeenCalledWith(-535, 0.5);
            });

            it('should set the currentIndex', function() {
                expect(view.currentIndex).toBe(2);
            });

            describe('if called again with the same index', function() {
                beforeEach(function() {
                    view.animateOffset.calls.reset();
                    Runner.run(() => view.scrollTo(2));
                });

                it('should do nothing', function() {
                    expect(view.animateOffset).not.toHaveBeenCalled();
                });
            });

            describe('if called with an index below 0', function() {
                beforeEach(function() {
                    view.animateOffset.calls.reset();
                    Runner.run(() => view.scrollTo(-1));
                });

                it('should do nothing', function() {
                    expect(view.animateOffset).not.toHaveBeenCalled();
                });
            });
        });

        describe('refresh()', function() {
            let children;

            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                children = [new ChildView(), new ChildView(), new ChildView(), new ChildView()];
                Runner.run(() => children.forEach(child => view.append(child)));

                Runner.run(() => {
                    children.forEach(function(child, index) {
                        child.setWidth(this[index]);
                    }, [335, 200, 400, 335]);
                    view.refresh();
                });
            });

            afterEach(function() {
                document.body.removeChild(view.element);
            });

            it('should set its bounds', function() {
                expect(view.bounds).toEqual({
                    max: 0,
                    min: -935
                });
            });

            it('should set the snap points', function() {
                expect(view.snapPoints).toEqual([-0, -335, -535, -935]);
            });
        });

        describe('validateSnap(offset)', function() {
            let swipe;
            let evt;

            beforeEach(function() {
                swipe = jasmine.createSpy('swipe()');
                evt = { velocityX: 1.5, deltaX: -133 };

                view.snapPoints = [0, -335, -535, -935];
                view.on('swipe', swipe);
            });

            describe('if locked', function() {
                beforeEach(function() {
                    view.locked = true;
                    view.currentIndex = 2;
                });

                it('should return the offset of the the current position', function() {
                    expect(view.validateSnap(-335, evt)).toBe(-535);
                });
            });

            describe('if the user swipes the view', function() {
                let result;

                beforeEach(function() {
                    evt.velocityX = 0.21;
                    view.currentIndex = 1;
                });

                describe('to the left', function() {
                    beforeEach(function() {
                        evt.deltaX = -100;

                        result = view.validateSnap(view.snapPoints[view.currentIndex], evt);
                    });

                    it('should snap to the next point', function() {
                        expect(result).toBe(view.snapPoints[view.currentIndex + 1]);
                    });

                    describe('when the animationStarts', function() {
                        beforeEach(function() {
                            view.emit('animationStart');
                        });

                        it('should set the currentIndex', function() {
                            expect(view.currentIndex).toBe(2);
                        });

                        it('should emit swipe', function() {
                            expect(swipe).toHaveBeenCalled();
                        });
                    });

                    describe('slowly', function() {
                        beforeEach(function() {
                            evt.velocityX = 0.2;

                            result = view.validateSnap(view.snapPoints[view.currentIndex], evt);
                        });

                        it('should not go to the next point', function() {
                            expect(result).toBe(view.snapPoints[view.currentIndex]);
                        });
                    });

                    describe('when on the last card', function() {
                        beforeEach(function() {
                            view.currentIndex = view.snapPoints.length - 1;

                            result = view.validateSnap(view.snapPoints[view.currentIndex], evt);
                        });

                        it('should snap to the current card', function() {
                            expect(result).toBe(view.snapPoints[view.currentIndex]);
                        });
                    });
                });

                describe('to the right', function() {
                    beforeEach(function() {
                        evt.deltaX = 100;

                        result = view.validateSnap(view.snapPoints[view.currentIndex], evt);
                    });

                    it('should snap to the previous point', function() {
                        expect(result).toBe(0);
                    });

                    describe('when the animationStarts', function() {
                        beforeEach(function() {
                            view.emit('animationStart');
                        });

                        it('should set the currentIndex', function() {
                            expect(view.currentIndex).toBe(0);
                        });

                        it('should emit swipe', function() {
                            expect(swipe).toHaveBeenCalled();
                        });
                    });

                    describe('slowly', function() {
                        beforeEach(function() {
                            evt.velocityX = 0.2;
                            swipe.calls.reset();
                            view.removeAllListeners('animationStart');

                            result = view.validateSnap(view.snapPoints[view.currentIndex + 2], evt);
                        });

                        it('should go to the recommended offset', function() {
                            expect(result).toBe(view.snapPoints[view.currentIndex + 2]);
                        });

                        describe('when the animationStarts', function() {
                            beforeEach(function() {
                                view.emit('animationStart');
                            });

                            it('should set the currentIndex', function() {
                                expect(view.currentIndex).toBe(3);
                            });

                            it('should emit swipe', function() {
                                expect(swipe).toHaveBeenCalled();
                            });
                        });
                    });

                    describe('when on the first card', function() {
                        beforeEach(function() {
                            view.currentIndex = 0;

                            result = view.validateSnap(view.snapPoints[view.currentIndex], evt);
                        });

                        it('should snap to the current card', function() {
                            expect(result).toBe(view.snapPoints[view.currentIndex]);
                        });
                    });
                });
            });
        });
    });

    describe('if the window is resized', function() {
        let children;

        beforeEach(function() {
            Runner.run(() => view.create());

            document.body.appendChild(view.element);
            view.didInsertElement();

            children = [new ChildView(null, 335), new ChildView(null, 200), new ChildView(null, 400), new ChildView(null, 335)];
            Runner.run(() => children.forEach(child => view.append(child)));

            Runner.run(() => view.refresh());
            Runner.run(() => view.scrollTo(2));

            Runner.run(() => {
                children.forEach(child => child.setWidth(child.width + 15));
            });

            spyOn(view, 'setOffset').and.callThrough();

            const event = document.createEvent('CustomEvent');
            event.initCustomEvent('resize');
            window.dispatchEvent(event);
        });

        afterEach(function() {
            document.body.removeChild(view.element);
        });

        it('should adjust the translation', function() {
            expect(view.setOffset).toHaveBeenCalledWith(-565);
        });

        describe('when scrollTo() is called', function() {
            beforeEach(function() {
                spyOn(view, 'animateOffset');
                Runner.run(() => view.scrollTo(1));
            });

            it('should scroll to the card based on the new dimmensions', function() {
                expect(view.animateOffset).toHaveBeenCalledWith(-350, 0.5);
            });
        });
    });
});
