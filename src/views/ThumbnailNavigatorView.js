import TemplateView from '../../lib/core/TemplateView.js';
import ButtonView from './ButtonView.js';
import SkipTimerView from './SkipTimerView.js';
import ThumbnailNavigatorListView from './ThumbnailNavigatorListView.js';
import View from '../../lib/core/View.js';
import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';
import {
    map,
    reduce,
    forEach,
    find
} from '../../lib/utils.js';

function add(...nums) {
    return reduce(nums, (total, num) => total + num, 0);
}

function getWidth(element) {
    const style = global.getComputedStyle(element);
    return add(...map([style.width, style.marginLeft, style.marginRight], parseFloat));
}

function getMinWidth(element) {
    return parseFloat(global.getComputedStyle(element).minWidth);
}

function setPrefixedStyle(element, prop, value) {
    const { style } = element;
    forEach(['-webkit-', '-moz-', '-ms-', '-o-', ''], prefix => {
        style[prefix + prop] = value;
    });
}

const EXPANDED_CLASS = 'pager__group--fullWidth';

const _ = createKey();

export default class ThumbnailNavigatorView extends TemplateView {
    constructor() {
        super(...arguments);

        _(this).width = 0;
        _(this).buttonsWidth = 0;
        _(this).thumbWidths = [];

        _(this).buttons = [];

        _(this).itemsPerPage = 0;

        _(this).data = null;

        _(this).resizeHandler = (() => {
            Runner.run(() => Runner.schedule('afterRender', () => this.resize()));
        });

        this.tag = 'div';
        this.classes.push('pager__group');
        this.template = require('./ThumbnailNavigatorView.html');
        this.instantiates = {View, ButtonView, SkipTimerView, ThumbnailNavigatorListView};
    }

    resize() {
        _(this).width = this.element.offsetWidth;
        _(this).thumbWidths = map(this.thumbs.children, thumb => getWidth(thumb.element));
        _(this).buttonsWidth = add(...map(_(this).buttons, button => getMinWidth(button.element)));
        const { width, thumbWidths, buttonsWidth } = _(this);
        const availableWidth = width - buttonsWidth;

        const itemsPerPage = _(this).itemsPerPage = Math.floor(availableWidth / thumbWidths[0]);

        const pageWidth = reduce(thumbWidths, (pageWidth, thumbWidth) => {
            const result = pageWidth + thumbWidth;

            return result < availableWidth ? result : pageWidth;
        }, 0);
        const extraSpace = width - pageWidth;
        const buttonWidth = (extraSpace / 2) - 1;
        const thumbsOffset = (extraSpace / 2);
        const totalPages = Math.ceil(thumbWidths.length / itemsPerPage);

        function setWidths(views, value) {
            forEach(views, view => view.element.style.width = value);
        }

        this.thumbsContainer.element.style.left = `${thumbsOffset}px`;
        this.thumbsContainer.element.style.right = `${thumbsOffset}px`;

        if (totalPages > 1) {
            setWidths(_(this).buttons, `${buttonWidth}px`);
        } else {
            setWidths(_(this).buttons, '');
        }

        this.scrollToActiveItem();
    }

    scrollToActiveItem() {
        const { itemsPerPage, data: { items } } = _(this);
        const currentIndex = items.indexOf(find(items, item => item.active));
        if (currentIndex < 0) { return; }

        const currentPage = Math.floor(currentIndex / itemsPerPage);
        const translatePercent = -(currentPage * 100);

        const scroller = this.thumbsScroller.element;

        setPrefixedStyle(scroller, 'transform', `translateX(${translatePercent}%)`);
    }

    update(data) {
        if (!this.element) { this.create(); }

        this.thumbs.update(data.items);

        if (data.expanded) {
            this.addClass(EXPANDED_CLASS);
        } else {
            this.removeClass(EXPANDED_CLASS);
        }

        if (data.enablePrevious) {
            this.previousButton.enable();
        } else {
            this.previousButton.disable();
        }

        if (data.enableNext) {
            this.nextButton.enable();
        } else {
            this.nextButton.disable();
        }

        _(this).data = data;

        Runner.schedule('afterRender', () => this.scrollToActiveItem());

        return super(data);
    }

    didCreateElement() {
        super();

        _(this).buttons = [this.previousButton, this.nextButton];

        this.thumbs.on('addChild', () => Runner.schedule('afterRender', () => this.resize()));
    }

    didInsertElement() {
        super();

        global.addEventListener('resize', _(this).resizeHandler, false);
    }

    willRemoveElement() {
        super();

        global.removeEventListener('resize', _(this).resizeHandler, false);
    }
}
