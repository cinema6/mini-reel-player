import View from '../../lib/core/View.js';
import TemplateView from '../../lib/core/TemplateView.js';
import {createKey} from 'private-parts';
import {
    forEach,
    filter
} from '../../lib/utils.js';

const _ = createKey();

export default class ListView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'ul';

        this.itemViewClass = TemplateView;
        this.itemIdentifier = 'id';

        _(this).children = [];
        _(this).childrenById = {};
    }

    update(collection) {
        if (!this.element) { this.create(); }

        const {childrenById, childElement} = _(this);
        const prevChildren = _(this).children;
        const children = new Array(collection.length);

        const getId = (item => item[this.itemIdentifier]);

        forEach(collection, (item, index) => {
            const id = getId(item);
            let child = childrenById[id];

            // If there is no View for this item, create one.
            if (!child) {
                const element = childElement && childElement.cloneNode(true);

                child = childrenById[id] = new this.itemViewClass(element);
                child.id = `${this.id}--${id}`;
                child.__listId__ = id;

                this.emit('addChild', child, index);
            }

            child.update(item);

            if (prevChildren[index] !== child) {
                this.append(child);
            }

            children[index] = child;
        });

        // Remove children for which we have no more elements
        forEach(prevChildren, (child, index) => {
            if (children.indexOf(child) < 0) {
                child.remove();
                childrenById[child.__listId__] = undefined;
                this.emit('removeChild', child, index);
            }
        });

        _(this).children = children;
    }

    didCreateElement() {
        const children = filter(this.element.childNodes, child => child instanceof Element);

        if (children.length > 1) {
            throw new RangeError(
                `ListView [${this.id}] cannot have more than one child element in its template.`
            );
        }

        _(this).childElement = children[0];
        this.element.innerHTML = '';

        return super();
    }
}
