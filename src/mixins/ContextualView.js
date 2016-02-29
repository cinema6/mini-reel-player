export default function ContextualView() {}
ContextualView.prototype.didCreateElement = function didCreateElement() {
    this.context = this.attributes['data-link-context'] || null;

    return this.super();
};
