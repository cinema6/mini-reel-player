import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

function setBackgroundImage(url) {
    this.element.style.backgroundImage = (url || '') && `url("${url}")`;
}

export default class NavButtonPreviewView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'span';
        this.classes.push('pager__previewImg');
    }

    setThumb(url) {
        if (!this.element) { this.create(); }
        Runner.scheduleOnce('render', this, setBackgroundImage, [url]);
    }
}
