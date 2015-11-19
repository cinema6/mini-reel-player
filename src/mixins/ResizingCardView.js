function ResizingCardView() {}
ResizingCardView.prototype.update = function(data) {
    if (!('title' in data) && !('note' in data)) { return this.super(data); }

    const length = (data.title || '').length + (data.note || '').length;

    if (length <= 100) {
        this.addClass('text--low');
    } else if (length <= 200) {
        this.addClass('text--med');
    } else {
        this.addClass('text--high');
    }

    if (length <= 195) {
        this.addClass('copy--base');
    } else if (length <= 295) {
        this.addClass('copy--low');
    } else if (length <= 395) {
        this.addClass('copy--med');
    } else {
        this.addClass('copy--high');
    }

    return this.super(data);
};

export default ResizingCardView;
