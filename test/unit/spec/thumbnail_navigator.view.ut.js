import ThumbnailNavigatorView from '../../../src/views/ThumbnailNavigatorView.js';
import TemplateView from '../../../lib/core/TemplateView.js';
import Runner from '../../../lib/Runner.js';
import SkipTimerView from '../../../src/views/SkipTimerView.js';
import ButtonView from '../../../src/views/ButtonView.js';
import ThumbnailNavigatorListView from '../../../src/views/ThumbnailNavigatorListView.js';
import View from '../../../lib/core/View.js';
import $ from 'jquery';
import {
    map
} from '../../../lib/utils.js';

describe('ThumbnailNavigatorView', function() {
    let view;

    beforeEach(function() {
        view = new ThumbnailNavigatorView();
    });

    it('should exist', function() {
        expect(view).toEqual(jasmine.any(TemplateView));
    });

    describe('properties:', function() {
        describe('tag', function() {
            it('should be "div"', function() {
                expect(view.tag).toBe('div');
            });
        });

        describe('template', function() {
            it('should be the contents of ThumbnailNavigatorView.html', function() {
                expect(view.template).toBe(require('../../../src/views/ThumbnailNavigatorView.html'));
            });
        });

        describe('classes', function() {
            it('should be the usual TemplateView classes + "pager__group"', function() {
                expect(view.classes).toEqual(new TemplateView().classes.concat(['pager__group']));
            });
        });

        describe('child views:', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('skipTimer', function() {
                it('should be a SkipTimerView', function() {
                    expect(view.skipTimer).toEqual(jasmine.any(SkipTimerView));
                });
            });

            describe('previousButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.previousButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('nextButton', function() {
                it('should be a ButtonView', function() {
                    expect(view.nextButton).toEqual(jasmine.any(ButtonView));
                });
            });

            describe('thumbsContainer', function() {
                it('should be a View', function() {
                    expect(view.thumbsContainer).toEqual(jasmine.any(View));
                });
            });

            describe('thumbsScroller', function() {
                it('should be a View', function() {
                    expect(view.thumbsScroller).toEqual(jasmine.any(View));
                });
            });

            describe('thumbs', function() {
                it('should be a ThumbnailNavigatorListView', function() {
                    expect(view.thumbs).toEqual(jasmine.any(ThumbnailNavigatorListView));
                });
            });
        });
    });

    describe('events:', function() {
        describe('thumbs', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
            });

            describe('addChild', function() {
                beforeEach(function() {
                    spyOn(view, 'resize');

                    Runner.run(() => view.thumbs.emit('addChild', new View()));
                });

                it('should resize itself', function() {
                    expect(view.resize).toHaveBeenCalled();
                });
            });
        });
    });

    describe('methods:', function() {
        let $style;
        let bodyView;
        let testBoxView;
        let $navigator;

        class TestBoxView extends View {
            constructor() {
                super(...arguments);

                this.tag = 'div';
                this.attributes.style = 'width: 1024px; height: 768px; position: relative;';
            }
        }

        function populateThumbs(amount, activeIndex) {
            const data = {
                thumbsShown: true,
                items: map(new Array(amount), (value, index) => ({
                    id: index,
                    active: index === activeIndex
                }))
            };

            Runner.run(() => view.update(data));

            return view.data;
        }

        beforeAll(function() {
            $style = $([
                '<style>',
                    '.pager__group {',
                        'height:2.875rem;/*46px*/',
                        'margin:0; display: block; ',
                        'position: absolute; z-index: 1;',
                        'left:0; right:0; bottom:0',
                    '}',
                    '.pager__btn {',
                        'min-width:23px;/*23px*/ height:2.875rem;/*46px*/ position:absolute;',
                        'background:#d94040 no-repeat 50% 50%; border:0; padding:0; margin:0;',
                        'cursor:pointer;',
                    '}',
                        '.pager__btn--disabled {',
                            'opacity:0.25; cursor:default;',
                        '}',
                            '.pager__btn--disabled .pager__label {',
                                'color:#1b1b1b;',
                            '}',
                            '.pager__btn--disabled .pager__icon-path {',
                                'fill: #1b1b1b;',
                            '}',
                        '.pager__prev {',
                            'left:0;',
                        '}',
                        '.pager__next {',
                            'right:0;',
                        '}',
                    '.pager__border {',
                        'width:1px;',
                        'display: block;',
                        'position: absolute; top:0; bottom:0;',
                        'background:#fff;',
                    '}',
                        '.pager__prev .pager__border {',
                            'right:0;',
                        '}',
                        '.pager__next .pager__border {',
                            'left:0;',
                        '}',
                    '.pager__icon {',
                        'display:block; width:0.75rem;/*12px*/ height:100%;',
                        'position:absolute; top:0; left:12.5%; margin:0;',
                    '}',
                        '.pager__icon-next {',
                            'right:12.5%; left:auto;',
                        '}',
                        '.pager__icon-path {',
                            'fill: #fff;',
                        '}',
                    '.pager__label {',
                        'font-weight:bold; color:#fff; line-height:1; font-size:0.875rem;',
                        'display: block; text-transform: uppercase;',
                        'position:absolute; z-index: 1; top:1rem; left:40%;',
                    '}',
                        '.pager__next .pager__label {',
                            'right:40%; left:auto;',
                        '}',
                    '/* pages styles */',
                    '.pages__group {',
                        'position:absolute; left:1.5625rem;/*25px*/ right:1.5625rem;/*25px*/',
                        'height:100%; overflow: hidden; margin:0;',
                    '}',
                        '.pages__scroller {',
                            'position: relative; left: 0;',
                            '-webkit-transition: 1s left; -o-transition: 1s left;',
                            '-ms-transition: 1s left; -moz-transition: 1s left;',
                            'transition: 1s left;',
                        '}',
                            '.pages__list {',
                                'margin:0; padding:0; list-style: none;',
                                'width:12000%;',
                            '}',
                                '.pages__item {',
                                    'float:left;',
                                    'width:5.625rem;/*90px*/ height:2.875rem;/*46px*/',
                                    'margin:0; padding:0;',
                                    'position:relative; overflow: hidden;',
                                    'border:0;',
                                    'border-left:1px solid #fff;',
                                    'border-right:1px solid #fff;',
                                    'box-sizing:border-box;',
                                '}',
                                    '.pages__navBtn,',
                                    '.pages__page {',
                                        'display: block;',
                                        'width:100%; height:100%;',
                                        'margin:0; border:0; padding:0;',
                                    '}',
                                    '.pages__page {',
                                        'cursor: pointer;',
                                        'background:black url("../../img/default_square.jpg") 50% 50% / cover no-repeat;',
                                    '}',
                                        '.pages__page--ad:after {',
                                            'content:"Ad";',
                                            'position: absolute;',
                                            'top:2px; left:2px;',
                                            'background:#000; color:#fff;',
                                            'padding:0 2px;',
                                            'font-size:0.625rem; font-weight:bold;',
                                        '}',
                                        '.pages__preview-img {',
                                            'position:absolute; top:0;',
                                            'width:100%; height:100%; display: block;',
                                            'background:no-repeat 50% 50% / 100%;',
                                        '}',
                                        '.pages__label {',
                                            'display: block; width:100%;',
                                            'position: absolute; top:-0.875rem; left:0;',
                                            'color:#000; font-size:6rem; line-height: 1; font-weight: bold;',
                                            'opacity:0.5;',
                                        '}',
                                        '.pages__fader {',
                                            'background:#000; opacity:0.4;',
                                            'position:absolute; width:100%; height:100%;',
                                            'top:0; left:0; z-index: 1;',
                                        '}',
                                            '.pages__page--active .pages__fader {',
                                                'opacity:0;',
                                            '}',
                                        '.pages__current-indicator {',
                                            'opacity:0; display: block; ',
                                            'width:100%; height:0.25rem;',
                                            'position: absolute; bottom:0; left:0; z-index: 2;',
                                            'background:#d94040;',
                                            'overflow: hidden;',
                                        '}',
                                            '.pages__page--active .pages__current-indicator {',
                                                'opacity:1;',
                                            '}',
                '</style>'
            ].join('\n'));
            $style.appendTo('head');

            bodyView = new View(document.body);
        });

        beforeEach(function() {
            testBoxView = new TestBoxView();
            Runner.run(() => bodyView.append(testBoxView));

            Runner.run(() => view.create());
            $navigator = $(view.element);
        });

        afterAll(function() {
            $style.remove();
        });

        afterEach(function() {
            Runner.run(() => testBoxView.remove());
        });

        describe('scrollToActiveItem()', function() {
            let data;
            let scroller;

            function setActive(index) {
                populateThumbs(data.items.length, index);
                Runner.run(() => view.scrollToActiveItem());
            }

            function assertTransform(element, value) {
                expect(element.style['-webkit-transform']).toBe(value);
                expect(element.style['-moz-transform']).toBe(value);
                expect(element.style['-ms-transform']).toBe(value);
                expect(element.style['-o-transform']).toBe(value);
                expect(element.style.transform).toBe(value);
            }

            beforeEach(function() {
                data = populateThumbs(40, -1);
                $navigator.find('.pages__list li').width('100px');

                Runner.run(() => view.appendTo(testBoxView));
                scroller = view.thumbsScroller;
                Runner.run(() => view.resize());
            });

            describe('if not on any page', function() {
                beforeEach(function() {
                    setActive(-1);
                });

                it('should not set the transform', function() {
                    expect(scroller.element.style.transform).toBeFalsy();
                });
            });

            describe('if on the first page', function() {
                it('should set the tranform to 0%', function() {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(index => {
                        setActive(index);
                        assertTransform(scroller.element, 'translateX(0%)');
                    });
                });
            });

            describe('if on the second page', function() {
                it('should set the transform to -100%', function() {
                    [9, 10, 11, 12, 13, 14, 15, 16, 17].forEach(index => {
                        setActive(index);
                        assertTransform(scroller.element, 'translateX(-100%)');
                    });
                });
            });

            describe('if on the third page', function() {
                it('should set the transform to -200%', function() {
                    [18, 19, 20, 21, 22, 23, 24, 25, 26].forEach(index => {
                        setActive(index);
                        assertTransform(scroller.element, 'translateX(-200%)');
                    });
                });
            });
        });

        describe('resize()', function() {
            beforeEach(function() {
                spyOn(view, 'scrollToActiveItem');

                Runner.run(() => view.resize());
            });

            it('should call scrollToActiveItem()', function() {
                expect(view.scrollToActiveItem).toHaveBeenCalled();
            });

            describe('the buttons', function() {
                it('should grow to fill the remaining space of the paginator', function() {
                    populateThumbs(12);
                    $navigator.find('.pages__list li').width('150px');
                    Runner.run(() => view.appendTo(testBoxView));
                    Runner.run(() => view.resize());

                    expect($navigator.find('.pager__btn--prev').width()).toBe(61);
                    expect($navigator.find('.pager__btn--next').width()).toBe(61);
                });

                it('should take the minimum width of the buttons into account', function() {
                    populateThumbs(12);
                    $navigator.find('.pages__list li').width('100px');
                    Runner.run(() => view.appendTo(testBoxView));
                    $navigator.find('.pager__btn').css('min-width', '100px');
                    Runner.run(() => view.resize());
                    $(testBoxView.element).width(1022);
                    Runner.run(() => view.resize());

                    expect($navigator.find('.pager__btn--prev').width()).toBe(110);
                    expect($navigator.find('.pager__btn--next').width()).toBe(110);
                });

                it('should not impose a width if all the buttons fit on one page', function() {
                    populateThumbs(12);
                    $navigator.find('.pages__list li').width('100px');
                    Runner.run(() => view.appendTo(testBoxView));
                    Runner.run(() => view.resize());
                    populateThumbs(5);
                    Runner.run(() => view.resize());

                    expect($navigator.find('.pager__btn--prev').prop('style').width).toBe('');
                    expect($navigator.find('.pager__btn--next').prop('style').width).toBe('');
                    expect($navigator.find('.pages__group').prop('style').left).not.toBe('');
                    expect($navigator.find('.pages__group').prop('style').right).not.toBe('');
                });
            });

            describe('the paginator', function() {
                var $pages;

                beforeEach(function() {
                    populateThumbs(12);
                    $navigator.find('.pages__list li').width('170px');
                    $navigator.find('.pages__list li').css('margin-right', '5px');
                    Runner.run(() => view.appendTo(testBoxView));
                    Runner.run(() => view.resize());

                    $pages = $navigator.find('.pages__group');
                });

                it('should be centered', function() {
                    expect($pages.css('left')).toBe('74.5px');
                    expect($pages.css('right')).toBe('74.5px');
                });
            });
        });

        describe('update(data)', function() {
            let data;

            beforeEach(function() {
                data = {
                    enabled: true,
                    expanded: false,
                    enableNext: false,
                    enablePrevious: true,
                    items: [
                        { id: 'rc-843e2e1a66b5ac', title: 'Hello', ad: false, active: false },
                        { id: 'rc-0fb3c1b2e98f9f', title: 'World', ad: false, active: true }
                    ]
                };
                Runner.run(() => view.create());
                spyOn(TemplateView.prototype, 'update');
                spyOn(view.thumbs, 'update');
                spyOn(view, 'scrollToActiveItem');

                Runner.run(() => view.update(data));
            });

            it('should call super()', function() {
                expect(TemplateView.prototype.update).toHaveBeenCalledWith(data);
            });

            it('should update the thumbs list', function() {
                expect(view.thumbs.update).toHaveBeenCalledWith(data.items);
            });

            it('should scrollToActiveItem()', function() {
                expect(view.scrollToActiveItem).toHaveBeenCalled();
            });

            describe('if the element is not created', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorView();
                    spyOn(view, 'create').and.callThrough();

                    Runner.run(() => view.update(data));
                });

                it('should create the element', function() {
                    expect(view.create).toHaveBeenCalled();
                });
            });

            describe('if the element is already created', function() {
                beforeEach(function() {
                    view = new ThumbnailNavigatorView();
                    Runner.run(() => view.create());
                    spyOn(view, 'create');

                    Runner.run(() => view.update(data));
                });

                it('should not create the element', function() {
                    expect(view.create).not.toHaveBeenCalled();
                });
            });

            describe('if expanded is true', function() {
                beforeEach(function() {
                    spyOn(view, 'addClass');
                    spyOn(view, 'removeClass');
                    data.expanded = true;

                    Runner.run(() => view.update(data));
                });

                it('should add the "pager__group--fullWidth" class', function() {
                    expect(view.addClass).toHaveBeenCalledWith('pager__group--fullWidth');
                    expect(view.removeClass).not.toHaveBeenCalledWith('pager__group--fullWidth');
                });
            });

            describe('if expanded is false', function() {
                beforeEach(function() {
                    spyOn(view, 'addClass');
                    spyOn(view, 'removeClass');
                    data.expanded = false;

                    Runner.run(() => view.update(data));
                });

                it('should add the "pager__group--fullWidth" class', function() {
                    expect(view.addClass).not.toHaveBeenCalledWith('pager__group--fullWidth');
                    expect(view.removeClass).toHaveBeenCalledWith('pager__group--fullWidth');
                });
            });

            describe('if enableNext is true', function() {
                beforeEach(function() {
                    spyOn(view.nextButton, 'enable');
                    spyOn(view.nextButton, 'disable');
                    data.enableNext = true;

                    Runner.run(() => view.update(data));
                });

                it('should enable the nextButton', function() {
                    expect(view.nextButton.enable).toHaveBeenCalled();
                    expect(view.nextButton.disable).not.toHaveBeenCalled();
                });
            });

            describe('if enableNext is false', function() {
                beforeEach(function() {
                    spyOn(view.nextButton, 'enable');
                    spyOn(view.nextButton, 'disable');
                    data.enableNext = false;

                    Runner.run(() => view.update(data));
                });

                it('should disable the nextButton', function() {
                    expect(view.nextButton.enable).not.toHaveBeenCalled();
                    expect(view.nextButton.disable).toHaveBeenCalled();
                });
            });

            describe('if enablePrevious is true', function() {
                beforeEach(function() {
                    spyOn(view.previousButton, 'enable');
                    spyOn(view.previousButton, 'disable');
                    data.enablePrevious = true;

                    Runner.run(() => view.update(data));
                });

                it('should enable the nextButton', function() {
                    expect(view.previousButton.enable).toHaveBeenCalled();
                    expect(view.previousButton.disable).not.toHaveBeenCalled();
                });
            });

            describe('if enablePrevious is false', function() {
                beforeEach(function() {
                    spyOn(view.previousButton, 'enable');
                    spyOn(view.previousButton, 'disable');
                    data.enablePrevious = false;

                    Runner.run(() => view.update(data));
                });

                it('should disable the nextButton', function() {
                    expect(view.previousButton.enable).not.toHaveBeenCalled();
                    expect(view.previousButton.disable).toHaveBeenCalled();
                });
            });
        });
    });

    describe('hooks:', function() {
        describe('didInsertElement()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                Runner.run(() => view.didInsertElement());
            });

            describe('when the window resizes', function() {
                beforeEach(function() {
                    const event = document.createEvent('CustomEvent');
                    event.initCustomEvent('resize');

                    spyOn(view, 'resize');

                    global.dispatchEvent(event);
                });

                it('should resize the view', function() {
                    expect(view.resize).toHaveBeenCalled();
                });
            });
        });

        describe('willRemoveElement()', function() {
            beforeEach(function() {
                Runner.run(() => view.create());
                Runner.run(() => view.didInsertElement());
                Runner.run(() => view.willRemoveElement());
            });

            describe('when the window resizes', function() {
                beforeEach(function() {
                    const event = document.createEvent('CustomEvent');
                    event.initCustomEvent('resize');

                    spyOn(view, 'resize');

                    global.dispatchEvent(event);
                });

                it('should do nothing', function() {
                    expect(view.resize).not.toHaveBeenCalled();
                });
            });
        });
    });
});
