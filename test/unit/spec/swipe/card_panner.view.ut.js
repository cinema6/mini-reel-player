import CardPannerView from '../../../../src/views/swipe/CardPannerView.js';
import View from '../../../../lib/core/View.js';
import Runner from '../../../../lib/Runner.js';
import SwipeableView from '../../../../src/mixins/SwipeableView.js';

fdescribe('CardPannerView', function() {
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

        describe('delegate', function() {
            it('should be null', function() {
                expect(view.delegate).toBeNull();
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

            beforeEach(function() {
                swipe = jasmine.createSpy('swipe()');

                view.snapPoints = [0, -335, -535, -935];
                view.on('swipe', swipe);
            });

            describe('if there is no delegate', function() {
                let result;

                beforeEach(function() {
                    result = view.validateSnap(-535);
                });

                it('should return the value passed to it', function() {
                    expect(result).toBe(-535);
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
            });

            describe('if there is a delegate', function() {
                beforeEach(function() {
                    view.delegate = {};
                });

                describe('if the delegate does not implement getSnapCardIndex()', function() {
                    beforeEach(function() {
                        delete view.delegate.getSnapCardIndex;
                    });

                    it('should return the value passed to it', function() {
                        expect(view.validateSnap(-335)).toBe(-335);
                    });
                });

                describe('if the delegate does implements getSnapCardIndex()', function() {
                    let result;

                    beforeEach(function() {
                        view.delegate.getSnapCardIndex = jasmine.createSpy('delegate.getSnapCardIndex()').and.returnValue(1);

                        result = view.validateSnap(view.snapPoints[2]);
                    });

                    it('should call the method with the index of the card it will snap to', function() {
                        expect(view.delegate.getSnapCardIndex).toHaveBeenCalledWith(2);
                    });

                    it('should return the offset of the index returned by the method', function() {
                        expect(result).toBe(view.snapPoints[1]);
                    });

                    describe('when the animationStarts', function() {
                        beforeEach(function() {
                            view.emit('animationStart');
                        });

                        it('should set the currentIndex', function() {
                            expect(view.currentIndex).toBe(1);
                        });

                        it('should emit swipe', function() {
                            expect(swipe).toHaveBeenCalled();
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
