import {createKey} from 'private-parts';
import {
    forEach,
    extend
} from '../../lib/utils.js';

const _ = createKey();

function ResizingPlayerView() {
    _(this).buttonValues = {};
}
ResizingPlayerView.prototype = {
    setButtonSize: function(size) {
        forEach(this.navItems, button => button.setSize(size));
    },

    enableNavigation: function() {
        forEach(this.navItems, button => button.enable());
        this.navEnabled = true;
        this.update(_(this).buttonValues);
    },

    disableNavigation: function() {
        forEach(this.navItems, button => button.disable());
        this.navEnabled = false;
    },

    update: function(data) {
        if (this.navEnabled) {
            return this.super(data);
        } else {
            _(this).buttonValues = { canGoForward: data.canGoForward, canGoBack: data.canGoBack };
            return this.super(extend(data, { canGoForward: false, canGoBack: false }));
        }
    }
};

export default ResizingPlayerView;
