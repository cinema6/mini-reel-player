function ResizingCardView() {}
ResizingCardView.prototype.update = function({ title, note }) {
    const length = (title || '').length + (note || '').length;

    if (length <= 100) {
        this.addClass('text--low');
    } else if (length <= 200) {
        this.addClass('text--med');
    } else {
        this.addClass('text--high');
    }

    return this.super(...arguments);
};

export default ResizingCardView;
