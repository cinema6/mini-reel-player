import dispatcher from '../services/dispatcher.js';

function SponsoredCardController(card) {
    dispatcher.addSource('card', card, ['clickthrough']);
}
SponsoredCardController.prototype = {
    clickthrough: function clickthrough(itemView) {
        return this.model.clickthrough(itemView.type);
    }
};

export default SponsoredCardController;
