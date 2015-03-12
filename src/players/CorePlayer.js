import View from '../../lib/core/View.js';
import PlayerPosterView from '../../src/views/PlayerPosterView.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class CorePlayer extends View {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('playerBox');

        _(this).posterSrc = null;
        _(this).poster = new PlayerPosterView();
    }

    get poster() {
        return _(this).posterSrc;
    }
    set poster(value) {
        _(this).posterSrc = value;
        _(this).poster.setImage(value);
    }

    didCreateElement() {
        const {poster} = _(this);

        this.append(poster);
        poster.setImage(this.poster);

        return super(...arguments);
    }
}
