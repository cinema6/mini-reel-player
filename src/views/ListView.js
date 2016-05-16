import View from '../../lib/core/View.js';
import TemplateView from '../../lib/core/TemplateView.js';
import {createKey} from 'private-parts';
import {
    forEach,
    filter
} from '../../lib/utils.js';
const slice = Array.prototype.slice;

const _ = createKey();

export default class ListView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'ul';

        this.itemViewClass = TemplateView;
        this.itemIdentifier = 'id';

        this.children = [];

        _(this).childrenById = {};
    }

    update(_collection_) {
        if (!this.element) { this.create(); }

        const collection = _collection_ || [];
        const {childrenById, childElement} = _(this);
        const prevChildren = this.children;
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
                child.target = child.attributes['data-target'] || null;
                child.action = child.attributes['data-action'] || null;
                child.updateSelf = true;
                child.on('action', (target, action, args) => {
                    if (target !== 'view') { return this.emit('action', target, action, args); }

                    if (typeof this[action] !== 'function') {
                        throw new TypeError(
                            `ListView [${this.id}] tried to handle action [${action}] of its ` +
                            `child [${child.id}] but it does not implement ${action}().`
                        );
                    }

                    this[action](...args);
                });

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
                child.destroy();
                childrenById[child.__listId__] = undefined;
                this.emit('removeChild', child, index);
            }
        });

        this.children = children;
    }

    didCreateElement() {
        const childNodes = this.element.childNodes;
        const childElements = filter(childNodes, child => child instanceof Element);

        if (childElements.length > 1) {
            throw new RangeError(
                `ListView [${this.id}] cannot have more than one child element in its template.`
            );
        }

        _(this).childElement = childElements[0];
        // Child elements cannot be removed by setting innerHTML to '' as it breaks IE.
        forEach(slice.call(childNodes), child => this.element.removeChild(child));

        return super.didCreateElement();
    }
}
