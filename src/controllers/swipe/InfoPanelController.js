import ViewController from '../ViewController.js';
import InfoPanelView from '../../views/swipe/InfoPanelView.js';

export default class InfoPanelController extends ViewController {
    constructor(minireel) {
        super(...arguments);

        this.model = minireel;
        this.view = this.addView(new InfoPanelView());
    }

    updateView() {
        const { title, splash, sponsor, logo, socialLinks } = this.model;

        this.view.update({
            title, splash, sponsor, logo,

            website: this.model.get('links.Website.uri'),
            links: socialLinks
        });
    }

    renderInto(view) {
        this.activate(false);
        this.updateView();

        return super.renderInto(view);
    }

    activate(yes) {
        this.view.show(yes);
        this.emit(yes ? 'activate' : 'deactivate');
    }

    close() {
        this.activate(false);
    }
}
