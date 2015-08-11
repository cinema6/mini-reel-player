import View from '../../lib/core/View.js';

export default class InstagramCaptionView extends View {
    constructor() {
        super(...arguments);
        this.tag = 'span';
    }

    update(data) {
        const element = this.element || this.create();
        if(data.caption) {
            const postTag = '<a href="https://instagram.com/$1/" target="_blank"' +
                'class="instag____postInfo__tag">@$1</a>';
            const hashTag = '<a href="https://instagram.com/explore/tags/$1/" target="_blank"' +
                'class="instag____postInfo__tag">#$1</a>';
            element.innerHTML = data.caption
                .replace(/@(\w+)/g, postTag)
                .replace(/#(\w+)/g, hashTag);
        }
    }
}
