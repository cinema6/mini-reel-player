import DisplayAdController from '../controllers/DisplayAdController.js';
import {
    reduce
} from '../../lib/utils.js';

class Module {
    getControllers(modules) {
        return reduce(Object.keys(modules), (controllers, type) => {
            const model = modules[type];
            const controller = (() => {
                switch (type) {
                case 'displayAd':
                    return new DisplayAdController(model);
                default:
                    return undefined;
                }
            }());

            controllers[type] = controller;
            return controllers;
        }, {});
    }
}

export default new Module();
