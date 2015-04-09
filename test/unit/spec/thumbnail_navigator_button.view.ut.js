import ThumbnailNavigatorButtonView from '../../../src/views/ThumbnailNavigatorButtonView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import Runner from '../../../lib/Runner.js';
import View from '../../../lib/core/View.js';

describe('ThumbnailNavigatorButtonView', function() {
    let view;

    beforeEach(function() {
        view = new ThumbnailNavigatorButtonView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(ButtonView));
    });

    describe('properties:', function() {
        describe('template', function() {
            it('should be the contents of ThumbnailNavigatorButtonView.html', function() {
                expect(view.template).toBe(require('../../../src/views/ThumbnailNavigatorButtonView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual ButtonView classes + "page__btn"', function() {
                expect(view.classes).toEqual(new ButtonView().classes.concat(['page__btn']));
            });
        });

        describe('itemId', function() {
            it('should be null', function() {
                expect(view.itemId).toBeNull();
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('thumb', function() {
                it('should be a View', function() {
                    expect(view.thumb).toEqual(jasmine.any(View));
                });

                it('s element should be the ThumbnailNavigatorButtonView\'s firstChild', function() {
                    expect(view.thumb.element).toBe(view.element.firstChild);
                });
            });
        });
    });

    describe('methods:', function() {
        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    id: 'rc-d82a07afa900dd',
                    title: 'Video 3 : The Best Video',
                    thumb: 'my-image.png',
                    active: false,
                    ad: true
                };

                Runner.run(() => view.create());
                spyOn(view, 'addClass');
                spyOn(view, 'removeClass');
                spyOn(view, 'setAttribute');
                spyOn(view.thumb, 'setAttribute');

                Runner.run(() => view.update(data));
            });

            it('should set the itemId', function() {
                expect(view.itemId).toBe(data.id);
            });

            it('should set the title attribute', function() {
                expect(view.setAttribute).toHaveBeenCalledWith('title', data.title);
            });

            it('should set the thumb\'s background image', function() {
                expect(view.thumb.setAttribute).toHaveBeenCalledWith('style', `background-image: url("${data.thumb}");`);
            });

            describe('if the element has not been created', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorButtonView();
                    spyOn(view, 'create').and.callThrough();

                    Runner.run(() => view.update(data));
                });

                it('should create the element', function() {
                    expect(view.create).toHaveBeenCalled();
                });
            });

            describe('if the element has been created already', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorButtonView();
                    Runner.run(() => view.create());
                    spyOn(view, 'create');

                    Runner.run(() => view.update(data));
                });

                it('should not create the view', function() {
                    expect(view.create).not.toHaveBeenCalled();
                });
            });

            describe('if active is true', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();
                    data.active = true;

                    Runner.run(() => view.update(data));
                });

                it('should add the "page__btn--active" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('page__btn--active');
                    expect(view.removeClass).not.toHaveBeenCalledWith('page__btn--active');
                });
            });

            describe('if active is false', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();
                    data.active = false;

                    Runner.run(() => view.update(data));
                });

                it('should remove the "page__btn--active" class', function() {
                    expect(view.addClass).not.toHaveBeenCalledWith('page__btn--active');
                    expect(view.removeClass).toHaveBeenCalledWith('page__btn--active');
                });
            });

            describe('if ad is true', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();
                    data.ad = true;

                    Runner.run(() => view.update(data));
                });

                it('should add the "page__btn--ad" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('page__btn--ad');
                    expect(view.removeClass).not.toHaveBeenCalledWith('page__btn--ad');
                });
            });

            describe('if ad is false', function() {
                beforeEach(function() {
                    view.addClass.calls.reset();
                    view.removeClass.calls.reset();
                    data.ad = false;

                    Runner.run(() => view.update(data));
                });

                it('should remove the "page__btn--ad" class', function() {
                    expect(view.addClass).not.toHaveBeenCalledWith('page__btn--ad');
                    expect(view.removeClass).toHaveBeenCalledWith('page__btn--ad');
                });
            });
        });
    });
});
