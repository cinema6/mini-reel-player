import View from '../../lib/core/View.js';
import Runner from '../../lib/Runner.js';

function setInnerHTML(html) {
    this.element.innerHTML = html;
}

export default class InstagramCaptionView extends View {
    constructor() {
        super(...arguments);
        this.tag = 'span';
    }

    update(data) {
        if(!this.element) {
            this.create();
        }
        if(data.caption) {
            const postTag = '<a href="https://instagram.com/$1/" target="_blank"' +
                'class="instag____postInfo__tag">@$1</a>';
            const hashTag = '<a href="https://instagram.com/explore/tags/$1/" target="_blank"' +
                'class="instag____postInfo__tag">#$1</a>';
            const caption = data.caption
                .replace(/@(\w+)/g, postTag)
                .replace(/#(\w+)/g, hashTag);
            Runner.scheduleOnce('render', this, setInnerHTML, [caption]);
        }
    }
}
