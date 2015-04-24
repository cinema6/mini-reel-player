import CardController from './CardController.js';
import DisplayAdController from './DisplayAdController.js';
import DisplayAdCardView from '../views/DisplayAdCardView.js';

export default class DisplayAdCardController extends CardController {
    constructor() {
        super(...arguments);

        this.view = new DisplayAdCardView();
        this.DisplayAdCtrl = new DisplayAdController(this.model.displayAd);

        this.model.on('prepare', () => this.DisplayAdCtrl.activate());
        this.model.on('activate', () => this.DisplayAdCtrl.activate());
        this.model.on('deactivate', () => this.DisplayAdCtrl.deactivate());
    }

    render() {
        super();

        const { sponsor, links: { Website: website }, socialLinks: links } = this.model;

        this.DisplayAdCtrl.renderInto(this.view.displayAdOutlet);
        this.view.update({ sponsor, website, links, hasLinks: !!links.length || !!website });
    }
}
