import ViewController from './ViewController.js';

export default class ModuleController extends ViewController {
    constructor(model = null) {
        super(...arguments);

        this.active = false;
        this.model = model;
    }

    activate() {
        if (this.active) { return; }

        this.active = true;
        this.view.show();
        this.emit('activate');
    }

    deactivate() {
        if (!this.active) { return; }

        this.active = false;
        this.view.hide();
        this.emit('deactivate');
    }

    renderInto(...args) {
        this.view.hide();

        return super.renderInto(...args);
    }
}
