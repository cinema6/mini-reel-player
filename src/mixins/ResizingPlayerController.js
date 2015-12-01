function ResizingPlayerController() {}
ResizingPlayerController.prototype = {
    initResizing: function() {
        this.minireel.on('move', () => {
            const { currentCard } = this.minireel;
            if (!currentCard) { return; }
            const {  title, note } = currentCard;

            const length = (title || '').length + (note || '').length;

            if (length <= 100) {
                this.view.setButtonSize('small');
            } else if (length <= 200) {
                this.view.setButtonSize('med');
            } else {
                this.view.setButtonSize('large');
            }
        });
    }
};

export default ResizingPlayerController;
