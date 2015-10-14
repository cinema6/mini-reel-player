import SwipeableView from '../../../src/mixins/SwipeableView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';
import prefix from 'prefix';
import { DIRECTIONS } from '../../../src/mixins/SwipeableView.js';

describe('DIRECTIONS', function() {
    it('should be strings for UP, DOWN, LEFT, RIGHT and NONE', function() {
        expect(DIRECTIONS.UP).toBe('UP');
        expect(DIRECTIONS.DOWN).toBe('DOWN');
        expect(DIRECTIONS.LEFT).toBe('LEFT');
        expect(DIRECTIONS.RIGHT).toBe('RIGHT');
        expect(DIRECTIONS.NONE).toBe('NONE');
    });
});

describe('SwipeableView mixin', function() {
    let view;
    let didInsertElement;

    class MyView extends View {}
    didInsertElement = MyView.prototype.didInsertElement = jasmine.createSpy('MyView.prototype.didInsertElement()');
    MyView.mixin(SwipeableView);

    beforeEach(function() {
        view = new MyView();
        view.tag = 'div';
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(View));
    });

    describe('properties:', function() {
        describe('decelerationRate', function() {
            it('should be -10000', function() {
                expect(view.decelerationRate).toBe(-10000);
            });
        });

        describe('bounds', function() {
            it('should be an object with infinite min/max bounds', function() {
                expect(view.bounds).toEqual({
                    min: -Infinity,
                    max: Infinity
                });
            });
        });

        describe('snapPoints', function() {
            it('should be an Array', function() {
                expect(view.snapPoints).toEqual([]);
            });
        });

        describe('animating', function() {
            it('should be false', function() {
                expect(view.animating).toBe(false);
            });
        });
    });

    describe('methods:', function() {
        describe('getOffset()', function() {
            it('should return 0', function() {
                expect(view.getOffset()).toBe(0);
            });

            describe('if the view has an element', function() {
                beforeEach(function() {
                    Runner.run(() => view.create());
                });

                it('should return 0', function() {
                    expect(view.getOffset()).toBe(0);
                });

                describe('if the element is translated', function() {
                    beforeEach(function() {
                        view.element.style[prefix('transform')] = 'translate3d(-30.56px, 0px, 0px)';
                    });

                    it('should return the amount of the translation on the X axis', function() {
                        expect(view.getOffset()).toBe(-30.56);
                    });

                    describe('to 0', function() {
                        beforeEach(function() {
                            view.element.style[prefix('transform')] = 'translate3d(0px, 0px, 0px)';
                        });

                        it('should return 0', function() {
                            expect(view.getOffset()).toBe(0);
                        });
                    });
                });
            });
        });

        describe('setOffset(px)', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                document.body.appendChild(view.element);
                spyOn(view, 'cancelAnimation');

                Runner.run(() => view.setOffset(-300));
            });

            afterEach(function() {
                if (view.element && document.body.contains(view.element)) {
                    document.body.removeChild(view.element);
                }
            });

            it('should transform the element', function() {
                expect(view.element.style[prefix('transform')]).toBe('translate3d(-300px, 0px, 0px)');
            });

            it('should not call cancelAnimation()', function() {
                expect(view.cancelAnimation).not.toHaveBeenCalled();
            });

            describe('if the view is being animated', function() {
                beforeEach(function() {
                    view.animating = true;
                    Runner.run(() => view.setOffset(-250));
                });

                it('should call cancelAnimation()', function() {
                    expect(view.cancelAnimation).toHaveBeenCalled();
                });
            });

            describe('if the element has not been created yet', function() {
                beforeEach(function() {
                    view = new MyView();
                    view.tag = 'div';

                    Runner.run(() => view.setOffset(200));
                });

                it('should create the element', function() {
                    expect(view.element.style[prefix('transform')]).toBe('translate3d(200px, 0px, 0px)');
                });
            });
        });

        describe('cancelAnimation()', function() {
            let transitionend;

            beforeEach(function() {
                Runner.run(() => view.create());
                transitionend = jasmine.createSpy('transition()');
                view.element.addEventListener('transitionend', transitionend, false);

                view.cancelAnimation();
            });

            it('should trigger a transitionend event on the element', function() {
                expect(transitionend).toHaveBeenCalled();
            });
        });

        describe('animateOffset(px, time, easing)', function() {
            let result;
            let animationStart;

            beforeEach(function(done) {
                animationStart = jasmine.createSpy('animationStart()');
                view.on('animationStart', animationStart);

                Runner.run(() => view.create());
                spyOn(view, 'reflow');
                spyOn(Runner, 'scheduleOnce');

                Runner.run(() => view.animateOffset(-150, 2, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'));

                const [, context, fn, args] = Runner.scheduleOnce.calls.mostRecent().args;
                result = fn.call(context, ...args);

                setTimeout(done, 1);
            });

            it('should set the transition-property', function() {
                expect(view.element.style[prefix('transition-property')]).toBe(prefix.dash('transform'));
            });

            it('should set the transition-duration', function() {
                expect(view.element.style[prefix('transition-duration')]).toBe('2s');
            });

            it('should set the transition-timing-function', function() {
                expect(view.element.style[prefix('transition-timing-function')]).toBe('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
            });

            it('should reflow the element', function() {
                expect(view.reflow).toHaveBeenCalled();
            });

            it('should transform the element', function() {
                expect(view.element.style[prefix('transform')]).toBe('translate3d(-150px, 0px, 0px)');
            });

            it('should return a promise in the render queue', function() {
                expect(result).toEqual(jasmine.any(Promise));
            });

            it('should set animating to true', function() {
                expect(view.animating).toBe(true);
            });

            it('should emit "animationStart"', function() {
                expect(animationStart).toHaveBeenCalled();
            });

            describe('when the transition ends', function() {
                [
                    ['old webkit', 'webkitTransitionEnd'],
                    ['opera 10', 'oTransitionEnd'],
                    ['opera 12', 'otransitionend'],
                    ['modern browsers', 'transitionend']
                ].forEach(([browser, eventName]) => describe(`on ${browser}`, function() {
                    let success;
                    let animationEnd;

                    beforeEach(function(done) {
                        animationEnd = jasmine.createSpy('animationEnd()').and.callFake(() => Runner.schedule('render', null, () => {}));
                        view.on('animationEnd', animationEnd);

                        success = jasmine.createSpy('success()');
                        result.then(success);

                        const event = document.createEvent('CustomEvent');
                        event.initCustomEvent(eventName);
                        view.element.dispatchEvent(event);

                        setTimeout(done, 1);
                    });

                    it('should remove the transition css properties', function() {
                        ['transition-property', 'transition-duration', 'transition-timing-function'].forEach(prop => {
                            expect(view.element.style[prefix(prop)]).toBe('');
                        });
                    });

                    it('should set animating to false', function() {
                        expect(view.animating).toBe(false);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalled();
                    });

                    it('should emit "animationEnd"', function() {
                        expect(animationEnd).toHaveBeenCalled();
                    });
                }));
            });

            describe('if no duration or easing are specified', function() {
                beforeEach(function() {
                    Runner.scheduleOnce.and.callThrough();

                    Runner.run(() => view.animateOffset(50));
                });

                it('should default the duration to one second', function() {
                    expect(view.element.style[prefix('transition-duration')]).toBe('1s');
                });

                it('should default the transition-timing-function to "ease"', function() {
                    expect(view.element.style[prefix('transition-timing-function')]).toBe('ease');
                });
            });

            describe('if the element has not been created', function() {
                beforeEach(function() {
                    view = new MyView();
                    view.tag = 'div';
                    Runner.scheduleOnce.and.callThrough();

                    Runner.run(() => view.animateOffset(2));
                });

                it('should create the element', function() {
                    expect(view.element.style[prefix('transform')]).toBe('translate3d(2px, 0px, 0px)');
                });
            });
        });

        describe('validateSnap(offset)', function() {
            it('should return the offset provided to it', function() {
                expect(view.validateSnap(400)).toBe(400);
                expect(view.validateSnap(250)).toBe(250);
            });

            describe('if there is a super() implementation', function() {
                let result;
                let evt;

                beforeEach(function() {
                    view.super = jasmine.createSpy('this.super()').and.returnValue(233);
                    evt = { phase: 'END', velocityX: 0.22, deltaX: 384 };

                    result = view.validateSnap(122, evt);
                });

                it('should use its return value', function() {
                    expect(view.super).toHaveBeenCalledWith(122, evt);
                    expect(result).toBe(233);
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('swipe()', function() {
            let preventDefault;

            beforeEach(function() {
                preventDefault = jasmine.createSpy();

                spyOn(view, 'getOffset').and.returnValue(30);
                spyOn(view, 'setOffset');

                view.swipe({
                    phase: 'start',
                    deltaX: 0,
                    directionX: 'NONE',
                    velocityX: 0,
                    original: { preventDefault }
                });
            });

            describe('if there has a this.super() method', function() {
                let evt;

                beforeEach(function() {
                    evt = { phase: 'move', deltaX: 0, directionX: 'NONE', velocityX: 0, original: { preventDefault } };
                    view.super = jasmine.createSpy('this.super()');

                    view.swipe(evt);
                });

                afterEach(function() {
                    delete view.super;
                });

                it('should call this.super() with the event', function() {
                    expect(view.super).toHaveBeenCalledWith(evt);
                });
            });

            it('should set the offset with the swipe', function() {
                view.swipe({ phase: 'move', deltaX: 2, original: { preventDefault } });
                expect(view.setOffset).toHaveBeenCalledWith(32);
                view.setOffset.calls.reset();

                view.swipe({ phase: 'move', deltaX: -5, original: { preventDefault } });
                expect(view.setOffset).toHaveBeenCalledWith(25);

                expect(preventDefault.calls.count()).toBe(2);
            });

            describe('when moving out of bounds', function() {
                beforeEach(function() {
                    view.bounds.min = -500;
                    view.bounds.max = 0;

                    view.getOffset.and.returnValue(-250);
                    view.swipe({
                        phase: 'start',
                        deltaX: 0,
                        original: { preventDefault }
                    });
                });

                it('should reduce movement by a factor of 0.3', function() {
                    view.swipe({ phase: 'move', deltaX: 250, original: { preventDefault } });
                    expect(view.setOffset).toHaveBeenCalledWith(0);
                    view.setOffset.calls.reset();

                    view.swipe({ phase: 'move', deltaX: 260, original: { preventDefault } });
                    expect(view.setOffset).toHaveBeenCalledWith(10 * 0.3);
                    view.setOffset.calls.reset();

                    view.swipe({ phase: 'move', deltaX: -250, original: { preventDefault } });
                    expect(view.setOffset).toHaveBeenCalledWith(-500);
                    view.setOffset.calls.reset();

                    view.swipe({ phase: 'move', deltaX: -260, original: { preventDefault } });
                    expect(view.setOffset).toHaveBeenCalledWith(-500 + (-10 * 0.3));
                });
            });

            describe('when the swipe ends', function() {
                const ANIMATION_SPEED = 0.25;
                const ANIMATION_EASING = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

                function swipe(from, to, velocity = 0) {
                    const distance = to - from;
                    const direction = to === from ? DIRECTIONS.NONE :
                        (to > from) ? 'RIGHT' : 'LEFT';

                    view.getOffset.and.returnValue(from);
                    view.swipe({
                        phase: 'start',
                        deltaX: 0,
                        original: { preventDefault }
                    });
                    view.swipe({
                        phase: 'move',
                        deltaX: distance / 2,
                        original: { preventDefault }
                    });
                    view.swipe({
                        phase: 'move',
                        deltaX: distance,
                        original: { preventDefault }
                    });
                    view.swipe({
                        phase: 'end',
                        deltaX: distance,
                        velocityX: velocity,
                        directionX: direction,
                        original: { preventDefault }
                    });
                }

                beforeEach(function() {
                    spyOn(view, 'animateOffset');
                    view.snapPoints = [0, -250, -500, -750];
                    view.bounds.min = -750;
                    view.decelerationRate = -250;
                });

                it(`should animate to the nearest snapPoint in 0.4 seconds`, function() {
                    swipe(0, 100);
                    expect(view.animateOffset).toHaveBeenCalledWith(0, ANIMATION_SPEED, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(0, -100);
                    expect(view.animateOffset).toHaveBeenCalledWith(0, ANIMATION_SPEED, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(0, -150);
                    expect(view.animateOffset).toHaveBeenCalledWith(-250, ANIMATION_SPEED, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(-250, -600);
                    expect(view.animateOffset).toHaveBeenCalledWith(-500, ANIMATION_SPEED, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(-500, -624);
                    expect(view.animateOffset).toHaveBeenCalledWith(-500, ANIMATION_SPEED, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(-500, -900);
                    expect(view.animateOffset).toHaveBeenCalledWith(-750, ANIMATION_SPEED, ANIMATION_EASING);
                });

                it('should use the velocity of the swipe to snap further', function() {
                    swipe(0, -100, 0.46);
                    expect(view.animateOffset).toHaveBeenCalledWith(-500, 1.84, ANIMATION_EASING);
                    view.animateOffset.calls.reset();

                    swipe(-500, -450, 0.33);
                    expect(view.animateOffset).toHaveBeenCalledWith(-250, 1.32, ANIMATION_EASING);
                });

                describe('if there are no snapPoints', function() {
                    beforeEach(function() {
                        view.snapPoints = [];
                        view.animateOffset.calls.reset();

                        swipe(0, -300);
                    });

                    it('should not animate', function() {
                        expect(view.animateOffset).not.toHaveBeenCalled();
                    });
                });

                describe('if validateSnap() returns something other than what it wants to snap to', function() {
                    beforeEach(function() {
                        spyOn(view, 'validateSnap').and.returnValue(-750);
                        spyOn(view, 'swipe').and.callThrough();
                        swipe(-250, -600);
                    });

                    it('should snap to that value', function() {
                        expect(view.validateSnap).toHaveBeenCalledWith(-500, view.swipe.calls.mostRecent().args[0]);
                        expect(view.animateOffset).toHaveBeenCalledWith(-750, ANIMATION_SPEED, ANIMATION_EASING);
                    });
                });
            });
        });

        describe('didInsertElement()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                view.didInsertElement();
            });

            it('should call this.super()', function() {
                expect(didInsertElement).toHaveBeenCalled();
            });

            describe('touch gestures', function() {
                function touch(element, phase, coordinates) {
                    const event = document.createEvent('CustomEvent');
                    event.initCustomEvent(`touch${phase}`);
                    event.changedTouches = [{ screenX: coordinates.x, screenY: coordinates.y }];
                    event.targetTouches = [];
                    event.touches = [];

                    element.dispatchEvent(event);

                    return event;
                }

                beforeEach(function() {
                    jasmine.clock().install();
                    jasmine.clock().mockDate();
                });

                afterEach(function() {
                    jasmine.clock().uninstall();
                });

                describe('when the swipe is started', function() {
                    let evt;

                    beforeEach(function() {
                        spyOn(view, 'swipe');

                        evt = touch(view.element, 'start', { x: 50, y: 100 });
                    });

                    it('should call swipe() with an event object', function() {
                        expect(view.swipe).toHaveBeenCalledWith({
                            phase: 'start',
                            deltaX: 0,
                            deltaY: 0,
                            velocityX: 0,
                            velocityY: 0,
                            directionX: 'NONE',
                            directionY: 'NONE',
                            original: evt
                        });
                    });
                });

                describe('when the swipe is ongoing', function() {
                    beforeEach(function() {
                        touch(view.element, 'start', { x: 50, y: 100 });

                        spyOn(view, 'swipe');
                    });

                    it('should calculate the deltaX and deltaY', function() {
                        touch(view.element, 'move', { x: 55, y: 101 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            deltaX: 5,
                            deltaY: 1
                        }));
                        view.swipe.calls.reset();

                        touch(view.element, 'move', { x: 47, y: 98 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            deltaX: -3,
                            deltaY: -2
                        }));
                    });

                    it('should calculate the velocity of the gesture', function() {
                        touch(view.element, 'move', { x: 51, y: 100 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            velocityX: 0,
                            velocityY: 0
                        }));
                        view.swipe.calls.reset();

                        touch(view.element, 'move', { x: 52, y: 99 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            velocityX: 0,
                            velocityY: 0
                        }));
                        view.swipe.calls.reset();

                        jasmine.clock().tick(1);
                        touch(view.element, 'move', { x: 53, y: 99 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            velocityX: 3,
                            velocityY: 1
                        }));
                        view.swipe.calls.reset();

                        jasmine.clock().tick(3);
                        touch(view.element, 'move', { x: 54, y: 97 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            velocityX: 1 / 3,
                            velocityY: 2 / 3
                        }));
                    });

                    it('should calculate the direction of the event', function() {
                        jasmine.clock().tick(1);

                        touch(view.element, 'move', { x: 51, y: 99 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            directionX: 'RIGHT',
                            directionY: 'UP'
                        }));
                        jasmine.clock().tick(1);
                        view.swipe.calls.reset();

                        touch(view.element, 'move', { x: 51, y: 98 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            directionX: 'NONE',
                            directionY: 'UP'
                        }));
                        jasmine.clock().tick(1);
                        view.swipe.calls.reset();

                        touch(view.element, 'move', { x: 49, y: 98 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            directionX: 'LEFT',
                            directionY: 'NONE'
                        }));
                        jasmine.clock().tick(1);
                        view.swipe.calls.reset();

                        touch(view.element, 'move', { x: 50, y: 101 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            directionX: 'RIGHT',
                            directionY: 'DOWN'
                        }));
                    });

                    it('should make the phase "move"', function() {
                        touch(view.element, 'move', { x: 0, y: 300 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            phase: 'move'
                        }));
                    });

                    it('should provide the original event', function() {
                        const event = touch(view.element, 'move', { x: 51, y: 103 });
                        expect(view.swipe).toHaveBeenCalledWith(jasmine.objectContaining({
                            original: event
                        }));
                    });
                });

                describe('when the swipe ends', function() {
                    let evt;

                    beforeEach(function() {
                        touch(view.element, 'start', { x: 100, y: 100 });

                        jasmine.clock().tick(1);
                        touch(view.element, 'move', { x: 99, y: 101 });

                        jasmine.clock().tick(1);
                        touch(view.element, 'move', { x: 98, y: 102 });

                        spyOn(view, 'swipe');

                        jasmine.clock().tick(1);
                        evt = touch(view.element, 'end', { x: 98, y: 102 });
                    });

                    it('should call swipe() with an event object', function() {
                        expect(view.swipe).toHaveBeenCalledWith({
                            phase: 'end',
                            deltaX: jasmine.any(Number),
                            deltaY: jasmine.any(Number),
                            velocityX: 1,
                            velocityY: 1,
                            directionX: 'LEFT',
                            directionY: 'DOWN',
                            original: evt
                        });
                    });
                });
            });
        });
    });
});
