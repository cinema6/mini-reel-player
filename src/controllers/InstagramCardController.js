import CardController from './CardController.js';

export default class InstagramCardController extends CardController {
    constructor() {
        super(...arguments);
        this.isRendered = false;

        const doRender = () => {
            if(!this.isRendered) {
                this.renderImage();
            }
        };

        this.model.on('prepare', doRender);
        this.model.on('activate', doRender);
    }

    renderImage() {
        this.isRendered = true;
        this.view.update({
            href: this.model.href,
            tags: this.model.tags,
            timeCreated: this.model.timeCreated,
            caption: this.model.caption,
            user: this.model.user,
            likes: this.model.likes,
            type: this.model.data.type,
            src: this.model.data.src
        });
        this.view.tags.update(this.model.tags.map(function(tag) {
            return {
                tag: tag
            };
        }));
        this.view.comments.update(this.model.comments.data);
        this.view.likes.update(this.model.likes.data);
    }

}
