import CarouselView from '../../../src/views/CarouselView.js';
import Runner from '../../../lib/Runner.js';
import SwipeableView from '../../../src/mixins/SwipeableView.js';
import ListView from '../../../src/views/ListView.js';
import { createUuid } from 'rc-uuid';
import TemplateView from '../../../lib/core/TemplateView.js';
import CarouselItemView from '../../../src/views/CarouselItemView.js';

describe('CarouselView', function() {
    let view;

    class ChildView extends TemplateView {
        constructor() {
            super(...arguments);

            this.tag = 'span';
            this.attributes = {
                style: `display: inline-block; width: 0px; height:473px;`
            };

            this.width = 0;
        }

        setWidth(width) {
            Runner.schedule('render', this, function() {
                this.element.style.width = `${width}px`;
            });
            this.width = width;
        }

        update(data) {
            if (data.width) {
                this.setWidth(data.width);
            }

            return super.update(...arguments);
        }
    }

    beforeEach(function() {
        view = new CarouselView();
        expect(view.itemViewClass).toBe(CarouselItemView);
        view.itemViewClass = ChildView;
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ListView));
    });

    it('should mixin SwipeableView', function() {
        expect(CarouselView.mixins).toContain(SwipeableView);
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
            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                Runner.run(() => view.update(Array.apply([], new Array(4)).map(() => ({
                    id: createUuid()
                }))));

                Runner.run(() => {
                    view.children.forEach(function(child, index) {
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
            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                Runner.run(() => view.update(Array.apply([], new Array(4)).map(() => ({
                    id: createUuid()
                }))));

                Runner.run(() => {
                    view.children.forEach(function(child, index) {
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
                    Runner.run(() => view.scrollTo(-2));
                });

                it('should animate to the proper positive offset', function() {
                    expect(view.animateOffset).toHaveBeenCalledWith(535, 0.5);
                });

                it('should set the currentIndex', function() {
                    expect(view.currentIndex).toBe(-2);
                });
            });
        });

        describe('refresh()', function() {
            let refresh;

            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);

                Runner.run(() => view.update(Array.apply([], new Array(4)).map(() => ({
                    id: createUuid()
                }))));

                spyOn(view, 'setOffset');
                view.currentIndex = 2;

                refresh = jasmine.createSpy('refresh()');
                view.on('refresh', refresh);

                Runner.run(() => {
                    view.children.forEach(function(child, index) {
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

            it('should set the offset', function() {
                expect(view.setOffset).toHaveBeenCalledWith(-535);
            });

            it('should emit refresh', function() {
                expect(refresh).toHaveBeenCalledWith();
            });
        });

        describe('when the view is inserted', function() {
            beforeEach(function() {
                Runner.run(() => view.update(Array.apply([], new Array(4)).map(() => ({
                    id: createUuid()
                }))));
                document.body.appendChild(view.element);
                Runner.run(() => {
                    view.children.forEach(function(child, index) {
                        child.setWidth(this[index]);
                    }, [335, 200, 400, 335]);
                });

                spyOn(view, 'setOffset');

                Runner.run(() => view.didInsertElement());
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

            it('should set the offset', function() {
                expect(view.setOffset).toHaveBeenCalledWith(-0);
            });
        });

        describe('when children are added', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);
                Runner.run(() => view.didInsertElement());

                view.currentIndex = -1;
                spyOn(view, 'setOffset');

                Runner.run(() => view.update([335, 200, 400, 335].map(width => ({
                    id: createUuid(),
                    width
                }))));
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

            it('should set the offset', function() {
                expect(view.setOffset).toHaveBeenCalledWith(335);
            });

            describe('when one is clicked', function() {
                let click;

                beforeEach(function() {
                    click = jasmine.createSpy('click()');
                    view.on('click', click);

                    spyOn(window, 'open');
                });

                describe('if the currentIndex does not match the view\'s index', function() {
                    beforeEach(function() {
                        view.currentIndex = 2;
                        view.children[1].emit('clickthrough', 'https://reelcontent.com/');
                    });

                    it('should not open anything', function() {
                        expect(window.open).not.toHaveBeenCalled();
                    });

                    it('should not emit click', function() {
                        expect(click).not.toHaveBeenCalled();
                    });
                });

                describe('if the currentIndex does match the view\'s index', function() {
                    beforeEach(function() {
                        view.currentIndex = 2;
                        view.children[2].emit('clickthrough', 'https://reelcontent.com/');
                    });

                    it('should open the link', function() {
                        expect(window.open).toHaveBeenCalledWith('https://reelcontent.com/');
                    });

                    it('should emit click', function() {
                        expect(click).toHaveBeenCalledWith();
                    });
                });
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
        beforeEach(function() {
            Runner.run(() => view.create());

            document.body.appendChild(view.element);
            Runner.run(() => view.didInsertElement());

            Runner.run(() => view.update(Array.apply([], new Array(4)).map(() => ({
                id: createUuid()
            }))));

            Runner.run(() => {
                view.children.forEach(function(child, index) {
                    child.setWidth(this[index]);
                }, [335, 200, 400, 335]);
                view.refresh();
            });
            Runner.run(() => view.scrollTo(2));

            Runner.run(() => {
                view.children.forEach(child => child.setWidth(child.width + 15));
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
