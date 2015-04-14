import PostController from '../controllers/PostController.js';

function PostModuleVideoCardController() {}
PostModuleVideoCardController.prototype = {
    initPost: function() {
        const post = this.model.modules.post;
        if (!post) { return; }

        const PostCtrl = this.PostCtrl = new PostController(post);

        PostCtrl.on('activate', () => this.view.playerOutlet.hide());
        PostCtrl.on('deactivate', () => this.view.playerOutlet.show());
        PostCtrl.on('replay', () => this.player.play());

        this.model.on('deactivate', () => PostCtrl.deactivate());

        this.player.on('play', () => PostCtrl.deactivate());
        this.player.on('ended', () => PostCtrl.activate());
    },

    canAutoadvance: function() {
        return this.super() && !('post' in this.model.modules);
    },

    render: function() {
        this.super(...arguments);

        if (this.PostCtrl) {
            this.PostCtrl.renderInto(this.view.postOutlet);
        }
    }
};

export default PostModuleVideoCardController;
