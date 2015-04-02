function ResizingCard() {}
ResizingCard.prototype.update = function({ title, note }) {
    if (!title || !note) { return this.super(...arguments); }
    const length = title.length + note.length;

    if (length <= 100) {
        this.addClass('text--low');
    } else if (length <= 200) {
        this.addClass('text--med');
    } else {
        this.addClass('text--high');
    }

    return this.super(...arguments);
};

export default ResizingCard;
