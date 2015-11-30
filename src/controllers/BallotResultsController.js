import ModuleController from './ModuleController.js';
import {
    map
} from '../../lib/utils.js';

export default class BallotResultsController extends ModuleController {
    constructor() {
        super(...arguments);

        this.model.on('hasResults', () => this.updateView());
    }

    updateView() {
        const { choices, results } = this.model;

        return this.view.update({
            results: map(choices, (choice, index) => ({
                choice,
                result: results[index] === null ?
                    '50%' : `${Math.round(results[index] * 100)}%`
            }))
        });
    }

    activate() {
        this.updateView();
        return super.activate();
    }
}
