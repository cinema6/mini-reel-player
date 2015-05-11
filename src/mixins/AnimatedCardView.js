import animator from '../../lib/animator.js';
import Runner from '../../lib/Runner.js';

function AnimatedCardView() {}
AnimatedCardView.prototype = {
    show: function() {
        Runner.schedule('render', animator, 'trigger', ['card:show', this]);
    },

    hide: function() {
        Runner.schedule('render', animator, 'trigger', ['card:hide', this]);
    }
};

export default AnimatedCardView;
