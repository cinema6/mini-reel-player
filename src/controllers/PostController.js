import ModuleController from './ModuleController.js';
import PostView from '../views/PostView.js';

export default class PostController extends ModuleController {
    constructor() {
        super(...arguments);

        this.view = new PostView();

        this.view.on('replay', () => {
            this.emit('replay');
            this.deactivate();
        });
        this.view.on('close', () => this.deactivate());
    }

    renderInto() {
        this.view.update({
            website: this.model.website
        });

        return super(...arguments);
    }
}
