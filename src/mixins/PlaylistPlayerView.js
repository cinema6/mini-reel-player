import {createKey} from 'private-parts';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

const FULL_WIDTH_CLASS = 'cards__list--fullWidth';

function PlaylistPlayerView() {
    _(this).navigationShown = true;
}
PlaylistPlayerView.prototype = {
    expand: function() {
        this.cards.addClass(FULL_WIDTH_CLASS);
        forEach(this.nextButtons, button => button.hide());
    },

    contract: function() {
        this.cards.removeClass(FULL_WIDTH_CLASS);
        if (_(this).navigationShown) {
            forEach(this.nextButtons, button => button.show());
        }
    },

    showNavigation: function() {
        _(this).navigationShown = true;
        return this.super();
    },

    hideNavigation: function() {
        _(this).navigationShown = false;
        return this.super();
    }
};

export default PlaylistPlayerView;
