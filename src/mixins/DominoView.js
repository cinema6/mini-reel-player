import Runner from '../../lib/Runner.js';
import domino from '../services/domino.js';

export default function DominoView() {}
DominoView.prototype.didInsertElement = function didInsertElement() {
    this.super();

    Runner.scheduleOnce('render', domino, 'apply');
};
