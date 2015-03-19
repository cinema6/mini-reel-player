import ViewController from './ViewController.js';

export default class ModuleController extends ViewController {
    constructor(model = null) {
        super(...arguments);

        this.model = model;
    }

    activate() {
        this.view.show();
        this.emit('activate');
    }

    deactivate() {
        this.view.hide();
        this.emit('deactivate');
    }

    renderInto(...args) {
        this.view.hide();

        return super(...args);
    }
}
