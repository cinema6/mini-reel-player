import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

export default class NavButtonPreviewView extends View {
    constructor() {
        super(...arguments);

        this.tag = 'span';
        this.classes.push('pager__previewImg');
    }

    setThumb(url) {
        const element = this.element || this.create();

        Runner.schedule('render', () => {
            element.style.backgroundImage = (url || '') && `url("${url}")`;
        });
    }
}
